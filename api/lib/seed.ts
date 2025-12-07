import fs from "fs";
import pg from "pg";
import dotenv from "dotenv";

dotenv.config();

const { Client } = pg;

async function init() {

  // load relevant sql files
  const journalSql = fs.readFileSync("lib/journals.sql", "utf8");
  const tablesSql = fs.readFileSync("lib/tables.sql", "utf8");
  const institutionSql = fs.readFileSync("lib/institution_tuples.sql", "utf8");
  const countrySql = fs.readFileSync("lib/country_tuples.sql", "utf8");
  const orcidSql = fs.readFileSync("lib/orcid_tuples.sql", "utf8");
  const raceSql = fs.readFileSync("lib/race_tuples.sql", "utf8");
  const genderSql = fs.readFileSync("lib/gender_tuples.sql", "utf8").split(";\n");;
  const articleSql = fs.readFileSync("lib/article_tuples.sql", "utf8");

  const client = new Client({
    connectionString: process.env.DATABASE_URL
  });

  await client.connect();

  try {
    await client.query("BEGIN;");
    await client.query("SET synchronous_commit TO OFF;");  // saw this might speed seeding up a bit
    await client.query("SET session_replication_role = 'replica';");
    await client.query(tablesSql);
    await client.query(journalSql);
    await client.query(institutionSql);
    await client.query(countrySql);    

    // authors don't perfectly align with institutions so we can fill in the missing affiliations
    const missing = await client.query(`
      SELECT DISTINCT a.Affiliation
      FROM Author a
      LEFT JOIN Institutions i ON a.Affiliation = i.Name
      WHERE i.Name IS NULL
        AND a.Affiliation IS NOT NULL
        AND a.Affiliation <> 'No Affiliation Provided';
    `);

    let inserted = 0;

    for (const row of missing.rows) {
      const aff = row.affiliation;
      await client.query(
        `INSERT INTO Institutions (Name)
         VALUES ($1)
         ON CONFLICT (Name) DO NOTHING`,
        [aff]
      );
      inserted++;
    }

    // re-enforce the foreign key constraint once you confirmed all affilatiations exist in institutions
    await client.query(`
      ALTER TABLE Author
      ADD CONSTRAINT fk_author_affiliation
      FOREIGN KEY (Affiliation)
      REFERENCES Institutions(Name);
    `);

    // insert rest of the tuples
    await client.query(orcidSql);         // should run once all institutions have the correct affiliations
    await client.query(raceSql);
    
    // gender table is way too large
    for (let i = 0; i < genderSql.length; i += 5000) {
      const chunk = genderSql.slice(i, i + 500).join(";\n") + ";";
      await client.query(chunk);
    }

    // seed the articles
    console.log('seeding articles...')
    await client.query(articleSql);
    await client.query("SET session_replication_role = 'origin';");
    await client.query("COMMIT;");
    console.log("DB seeded successfully");
  } catch (err) {
    await client.query("ROLLBACK;");
    console.error("Error running seed.sql:", err);
  } finally {
    await client.end();
  }
}

init();
