import { Pool } from "pg";
import dotenv from "dotenv";

dotenv.config();

export const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: true,
  keepAlive: true,
  max: 5,
  idleTimeoutMillis: 30_000,
  connectionTimeoutMillis: 20_000,
});


pool.on("error", (err) => {
  console.error("Unexpected PG pool error:", err);
  process.exit(1);
});
