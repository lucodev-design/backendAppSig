import mysql from "mysql2/promise";

export const pool = mysql.createPool({
  host: "localhost",
  user: "root",       // tu usuario de MySQL
  password: "",       // tu contraseña de MySQL (si no tienes, dejar vacío)
  database: "sig_db",
  waitForConnections: true,
  connectionLimit: 10,
});
