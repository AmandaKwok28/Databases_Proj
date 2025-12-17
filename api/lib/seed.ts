import fs from "fs";
import dotenv from "dotenv";
import { pool } from "../db";
import { PoolClient } from "pg";

dotenv.config();

function attachClientErrorHandler(client: PoolClient): void {
  client.on("error", (err: Error) => {
    console.error("Postgres client error:", err);
  });
}


async function init() {
  // load relevant sql files
  const journalSql = fs.readFileSync("lib/journals.sql", "utf8");
  const tablesSql = fs.readFileSync("lib/tables.sql", "utf8");
  const institutionSql = fs.readFileSync("lib/institution_tuples.sql", "utf8");
  const countrySql = fs.readFileSync("lib/country_tuples.sql", "utf8");
  const orcidSql = fs.readFileSync("lib/orcid_tuples.sql", "utf8");
  const raceSql = fs.readFileSync("lib/race_tuples.sql", "utf8");
  const genderSql = fs
    .readFileSync("lib/gender_tuples.sql", "utf8")
    .split(";\n");
  const articleSql = fs.readFileSync("lib/article_tuples.sql", "utf8");

  /* ───────────── Phase 1 client ───────────── */
  const client = await pool.connect();
  attachClientErrorHandler(client);

  try {
    await client.query("BEGIN");
    await client.query("SET synchronous_commit TO OFF");

    console.log("Creating tables, seeding journals, institutions, and countries...");
    await client.query(tablesSql);
    await client.query(journalSql);
    await client.query(institutionSql);
    await client.query(countrySql);

    // console.log("Accounting for missing institutions in affiliations...");
    // const missing = await client.query(`
    //   SELECT DISTINCT a.Affiliation
    //   FROM Author a
    //   LEFT JOIN Institutions i ON a.Affiliation = i.Name
    //   WHERE i.Name IS NULL
    //     AND a.Affiliation IS NOT NULL
    //     AND a.Affiliation <> 'No Affiliation Provided';
    // `);

    // for (const row of missing.rows) {
    //   await client.query(
    //     `INSERT INTO Institutions (Name)
    //      VALUES ($1)
    //      ON CONFLICT (Name) DO NOTHING`,
    //     [row.affiliation]
    //   );
    // }

    console.log("Seeding ORCID information (temporarily disabling FKs)...");

  // Disable FK checks for this session
  await client.query(`SET session_replication_role = 'replica'`);

  await client.query(orcidSql);

  // Re-enable FK checks
  await client.query(`SET session_replication_role = 'origin'`);

  console.log("Accounting for missing institutions in affiliations (post-ORCID)...");

  const missing = await client.query(`
    SELECT DISTINCT a.Affiliation
    FROM Author a
    LEFT JOIN Institutions i ON a.Affiliation = i.Name
    WHERE i.Name IS NULL
      AND a.Affiliation IS NOT NULL
      AND a.Affiliation <> 'No Affiliation Provided';
  `);

  for (const row of missing.rows) {
    await client.query(
      `INSERT INTO Institutions (Name)
      VALUES ($1)
      ON CONFLICT (Name) DO NOTHING`,
      [row.affiliation]
    );
  }

  console.log("Seeding race information...");
  await client.query(raceSql);


    await client.query("COMMIT"); // phase 1 complete

    /* ───────────── Phase 2: gender (chunked, new client each time) ───────────── */
    const countryRes = await client.query(
      `SELECT countrycode FROM Countries`
    );
    const validCountryCodes = new Set(
      countryRes.rows.map(r => r.countrycode)
    );

    console.log("Seeding gender information...");
    const CHUNK_SIZE = 100;
    const genderStmts = genderSql
      .map(stmt => {
        // match VALUES ('Name', 'CC', 'Label')
        const match = stmt.match(
          /VALUES\s*\(\s*'([^']*)'\s*,\s*'([^']*)'\s*,\s*'([^']*)'\s*\)/i
        );

        if (!match) return stmt; // leave untouched if unexpected format

        const [, name, countryCode, label] = match;

        if (!validCountryCodes.has(countryCode)) {
          return null; // DROP the row entirely
        }


        return stmt;
      })
      .filter((s): s is string => Boolean(s && s.trim()));


    for (let i = 0; i < genderStmts.length; i += CHUNK_SIZE) {
      const chunk =
        genderStmts.slice(i, i + CHUNK_SIZE).join(";\n") + ";";

      const chunkClient = await pool.connect();

      try {
        await chunkClient.query("BEGIN");
        await chunkClient.query(chunk);
        await chunkClient.query("COMMIT");
      } catch (err) {
        try {
          await chunkClient.query("ROLLBACK");
        } catch {}
        throw err;
      } finally {
        chunkClient.release();
      }
    }

    /* ───────────── Phase 3: articles (exact-match filtering) ───────────── */
console.log("Seeding articles...");

// Load exact author names
const authorRes = await client.query(`SELECT Name FROM Author`);
const validAuthors = new Set(authorRes.rows.map(r => r.name));

// Filter article inserts by exact Author match
const articleStmts = articleSql
  .split(";\n")
  .map(stmt => {
    // Match: VALUES ('Title', 'Author', <author_number>, ...)
    const match = stmt.match(
      /VALUES\s*\(\s*'([^']*)'\s*,\s*'([^']*)'\s*,\s*\d+/i
    );

    if (!match) return null;

    const rawAuthor = match[2];

    // EXACT match only — guarantees FK validity
    if (!validAuthors.has(rawAuthor)) {
      return null; // DROP article
    }

    return stmt;
  })
  .filter((s): s is string => Boolean(s && s.trim()));

console.log(`Inserting ${articleStmts.length} articles after exact-match filtering`);

const articleClient = await pool.connect();
attachClientErrorHandler(articleClient);

try {
  await articleClient.query("BEGIN");
  await articleClient.query(articleStmts.join(";\n") + ";");
  await articleClient.query("COMMIT");
} catch (err) {
  try {
    await articleClient.query("ROLLBACK");
  } catch {}
  throw err;
} finally {
  articleClient.release();
}


    console.log("DB seeded successfully");
  } catch (err) {
    try {
      await client.query("ROLLBACK");
    } catch {}
    console.error("Error running seed.sql:", err);
  } finally {
    client.release();
  }
}

init();
