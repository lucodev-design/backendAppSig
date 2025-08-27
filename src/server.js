// src/server.js
import express from "express";
import { pool } from "./db.js";
import dotenv from "dotenv";
import cors from "cors";

import authRoutes from "./routes/auth.routes.js";
import asistenciaRoutes from "./routes/asistencia.routes.js";
import usuariosRoutes from "./routes/usuarios.routes.js";
import sedesRoutes from "./routes/sedes.routes.js";

dotenv.config();

const app = express();

// Lista de orígenes permitidos
const allowedOrigins = [
  "http://localhost:5173", // desarrollo local
  "https://fastidious-naiad-8071bd.netlify.app" // frontend en producción (Netlify)
];

// Middleware CORS
app.use(cors({
  origin: function (origin, callback) {
    // Permite llamadas desde herramientas tipo Postman (sin origin)
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS: " + origin));
    }
  },
  methods: ["GET", "POST", "PUT", "DELETE"],
  credentials: true
}));

app.use(express.json());

// Rutas
app.use("/api/auth", authRoutes);
app.use("/api/asistencias", asistenciaRoutes);
app.use("/api/usuarios", usuariosRoutes);
app.use("/api/sedes", sedesRoutes);

// Test conexión a la BD
app.get("/db-status", async (req, res) => {
  try {
    const result = await pool.query("SELECT current_database() AS db");
    res.json({ message: `Conectado a la base de datos: ${result.rows[0].db}` });
  } catch (error) {
    res.status(500).json({ error: "Error al conectar con la base de datos", details: error.message });
  }
});

app.get("/ping", (req, res) => {
  res.json({ message: "pong" });
});

// Iniciar servidor
const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`✅ Servidor corriendo en puerto ${PORT}`);
});
