import pg from "pg";
import dotenv from "dotenv";

console.log("PGPASSWORD:", process.env.PGPASSWORD);
console.log("PGUSER:", process.env.PGUSER);
console.log("PGDATABASE:", process.env.PGDATABASE);
console.log("PGHOST:", process.env.PGHOST);
console.log("PGPORT:", process.env.PGPORT);

dotenv.config();

const { Pool } = pg;

const pool = new Pool({
  user: process.env.PGUSER,
  host: process.env.PGHOST,
  database: process.env.PGDATABASE,
  password: process.env.PGPASSWORD,
  port: process.env.PGPORT,
});

export default pool;
