import { Router } from "express";
import {pool} from "../db.js";

const router = Router();

// Registrar asistencia
router.post("/", async (req, res) => {
  const { usuario_id, estado } = req.body;
  try {
    const fecha = new Date().toISOString().split("T")[0];
    const hora = new Date().toLocaleTimeString("es-PE", { hour12: false });
    await pool.query(
      "INSERT INTO asistencias (usuario_id, fecha, hora, estado) VALUES (?, ?, ?, ?)",
      [usuario_id, fecha, hora, estado]
    );
    res.json({ message: "Asistencia registrada" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Listar asistencias
router.get("/", async (req, res) => {
  try {
    const [rows] = await pool.query(`
      SELECT a.id, u.nombre, a.fecha, a.hora, a.estado
      FROM asistencias a
      JOIN usuarios u ON u.id = a.usuario_id
      ORDER BY a.fecha DESC, a.hora DESC
    `);
    res.json(rows);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
