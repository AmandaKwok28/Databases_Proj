import pg from "pg";
const { Pool } = pg;

// create a connection pool
export const pool = new Pool({
  user: "Amanda Kwok",     
  host: "localhost",     
  database: "yourdbname",
  password: "yourpassword",
  port: 5432,           
});