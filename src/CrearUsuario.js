// CrearUsuario.js
import mysql from "mysql2/promise";
import bcrypt from "bcryptjs";

async function crearUsuario() {
  try {
    const connection = await mysql.createConnection({
      host: "localhost",
      user: "root",
      password: "",
      database: "sig_db"   // 👈 tu base real
    });

    // 🔹 Datos del usuario
    const nombre = "Admin";
    const email = "admin@mail.com";
    const passwordPlano = "123456";
    const rolId = 1; // 👈 este debe coincidir con el ID de la tabla roles (ej. 1 = admin)

    // 🔹 Encriptar contraseña
    const salt = bcrypt.genSaltSync(10);
    const passwordHash = bcrypt.hashSync(passwordPlano, salt);

    // 🔹 Insertar en usuarios
    const query = `
      INSERT INTO usuarios (nombre, email, password, rol_id)
      VALUES (?, ?, ?, ?)
    `;
    await connection.execute(query, [nombre, email, passwordHash, rolId]);

    console.log("✅ Usuario creado con éxito!");
    console.log("Email:", email);
    console.log("Contraseña:", passwordPlano);

    await connection.end();
  } catch (error) {
    console.error("❌ Error creando usuario:", error);
  }
}

crearUsuario();
