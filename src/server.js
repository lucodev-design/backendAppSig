// src/server.js
import express from "express";
import { pool } from "./db.js";

// Importamos los routes
import authRoutes from "./routes/auth.routes.js";
import asistenciaRoutes from "./routes/asistencia.routes.js";
import usuariosRoutes from "./routes/usuarios.routes.js";
import sedesRoutes from "./routes/sedes.routes.js";

import cors from "cors";

// Inicializar express
const app = express();

// Middlewares
app.use(cors({
  origin: "http://localhost:5173", // tu frontend
  methods: ["GET", "POST", "PUT", "DELETE"],
  credentials: true
}));

app.use(express.json()); // para poder leer JSON en req.body

// Rutas
app.use("/api/auth", authRoutes);
app.use("/api/asistencias", asistenciaRoutes);
app.use("/api/usuarios", usuariosRoutes);
app.use("/api/sedes", sedesRoutes);

// Ruta de prueba de conexión a la BD
app.get("/db-status", async (req, res) => {
  try {
    const [rows] = await pool.query("SELECT DATABASE() AS db");
    res.json({ message: `Conectado a la base de datos: ${rows[0].db}` });
  } catch (error) {
    res.status(500).json({ error: "Error al conectar con la base de datos", details: error.message });
  }
});

// Ruta simple para testear servidor
app.get("/ping", (req, res) => {
  res.json({ message: "pong" });
});

// Iniciar servidor
const PORT = 4000;
app.listen(PORT, () => {
  console.log(`✅ Servidor corriendo en http://localhost:${PORT}`);
});
