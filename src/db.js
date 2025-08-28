// src/db.js
import pkg from "pg";
import dotenv from "dotenv";

dotenv.config();
const { Pool } = pkg;

export const pool = new Pool({
  connectionString: process.env.DATABASE_URL, // tu URL de PostgreSQL
  ssl: { rejectUnauthorized: false }, // necesario en Render
});
