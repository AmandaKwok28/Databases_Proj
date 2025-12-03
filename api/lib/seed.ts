import fs from "fs";
import pg from "pg";
import dotenv from "dotenv";

dotenv.config();

const { Client } = pg;

async function init() {
  const sql = fs.readFileSync("lib/seed.sql", "utf8");

  const client = new Client({
    connectionString: process.env.DATABASE_URL
  });

  await client.connect();

  try {
    await client.query(sql);
    console.log("DB seeded successfully");
  } catch (err) {
    console.error("Error running seed.sql:", err);
  } finally {
    await client.end();
  }
}

init();
