import { pool } from "./db.js";

const createTables = async () => {
  try {
    await pool.query(`
      CREATE TABLE IF NOT EXISTS roles (
        id SERIAL PRIMARY KEY,
        nombre VARCHAR(50) NOT NULL
      );

      CREATE TABLE IF NOT EXISTS usuarios (
        id SERIAL PRIMARY KEY,
        nombre VARCHAR(100) NOT NULL,
        email VARCHAR(100) UNIQUE NOT NULL,
        password TEXT NOT NULL,
        rol_id INT REFERENCES roles(id) ON DELETE SET NULL
      );

      CREATE TABLE IF NOT EXISTS asistencias (
        id SERIAL PRIMARY KEY,
        usuario_id INT REFERENCES usuarios(id) ON DELETE CASCADE,
        fecha DATE NOT NULL,
        hora TIME NOT NULL,
        estado VARCHAR(20) NOT NULL
      );
    `);

    console.log("✅ Tablas creadas en Render PostgreSQL");
    process.exit(0);
  } catch (error) {
    console.error("❌ Error creando tablas:", error);
    process.exit(1);
  }
};

createTables();
