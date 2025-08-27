// CrearUsuario.js
import pkg from "pg";
import bcrypt from "bcryptjs";

const { Pool } = pkg;

// 🔹 Configuración conexión a PostgreSQL
const pool = new Pool({
  host: "localhost",   // si estás local, en Render cambiarás
  user: "postgres",    // tu usuario de postgres
  password: "tu_password", // 👈 pon la contraseña de postgres
  database: "sig_db",  // tu base de datos en Postgres
  port: 5432,          // puerto por defecto de Postgres
});

async function crearUsuario() {
  try {
    // 🔹 Datos del usuario
    const nombre = "Admin";
    const email = "admin@mail.com";
    const passwordPlano = "123456";
    const rolId = 1; // 👈 asegúrate que en tu tabla roles ya exista este ID

    // 🔹 Encriptar contraseña
    const salt = bcrypt.genSaltSync(10);
    const passwordHash = bcrypt.hashSync(passwordPlano, salt);

    // 🔹 Insertar en usuarios (Postgres usa $1, $2 en lugar de ?)
    const query = `
      INSERT INTO usuarios (nombre, email, password, rol_id)
      VALUES ($1, $2, $3, $4)
      RETURNING id;
    `;
    const result = await pool.query(query, [nombre, email, passwordHash, rolId]);

    console.log("✅ Usuario creado con éxito!");
    console.log("ID:", result.rows[0].id);
    console.log("Email:", email);
    console.log("Contraseña:", passwordPlano);

    await pool.end();
  } catch (error) {
    console.error("❌ Error creando usuario:", error.message);
  }
}

crearUsuario();
