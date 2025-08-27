import express from "express";
import { pool } from "../db.js";

const router = express.Router();

/**
 * 📌 Listar todas las sedes
 */
router.get("/", async (req, res) => {
  try {
    const [rows] = await pool.query("SELECT * FROM sedes");
    res.json(rows);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

/**
 * 📌 Crear una sede
 */
router.post("/", async (req, res) => {
  const { nombre, direccion } = req.body;
  try {
    const [result] = await pool.query(
      "INSERT INTO sedes (nombre, direccion) VALUES (?, ?)",
      [nombre, direccion]
    );
    res.json({ id: result.insertId, nombre, direccion });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

/**
 * 📌 Actualizar una sede
 */
router.put("/:id", async (req, res) => {
  const { id } = req.params;
  const { nombre, direccion } = req.body;
  try {
    await pool.query(
      "UPDATE sedes SET nombre=?, direccion=? WHERE id=?",
      [nombre, direccion, id]
    );
    res.json({ message: "Sede actualizada correctamente" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

/**
 * 📌 Eliminar una sede
 */
router.delete("/:id", async (req, res) => {
  const { id } = req.params;
  try {
    await db.query("DELETE FROM sedes WHERE id=?", [id]);
    res.json({ message: "Sede eliminada correctamente" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
