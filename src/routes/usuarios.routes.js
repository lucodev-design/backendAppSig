// src/routes/usuarios.routes.js
import express from "express";
import { pool } from "../db.js";
import bcrypt from "bcryptjs";

const router = express.Router();

/**
 * 📌 Obtener todos los usuarios
 */
router.get("/", async (req, res) => {
  try {
    const [rows] = await pool.query(`
      SELECT u.id, u.nombre, u.email, r.nombre AS rol
      FROM usuarios u
      JOIN roles r ON u.rol_id = r.id
    `);
    res.json(rows);
  } catch (error) {
    console.error("Error al obtener usuarios:", error);
    res.status(500).json({ error: "Error al obtener usuarios" });
  }
});

/**
 * 📌 Crear un usuario
 */
router.post("/", async (req, res) => {
  const { nombre, email, password, rol_id } = req.body;

  if (!nombre || !email || !password || !rol_id) {
    return res.status(400).json({ error: "Faltan datos obligatorios" });
  }

  try {
    const hashedPassword = await bcrypt.hash(password, 10);

    const [result] = await pool.query(
      "INSERT INTO usuarios (nombre, email, password, rol_id) VALUES (?, ?, ?, ?)",
      [nombre, email, hashedPassword, rol_id]
    );

    res.status(201).json({ id: result.insertId, nombre, email, rol_id });
  } catch (error) {
    console.error("Error al crear usuario:", error);
    res.status(500).json({ error: "Error al crear usuario" });
  }
});

/**
 * 📌 Actualizar un usuario
 */
router.put("/:id", async (req, res) => {
  const { id } = req.params;
  const { nombre, email, password, rol_id } = req.body;

  if (!nombre || !email || !rol_id) {
    return res.status(400).json({ error: "Faltan datos obligatorios" });
  }

  try {
    let query = "UPDATE usuarios SET nombre=?, email=?, rol_id=?";
    const params = [nombre, email, rol_id];

    if (password) {
      const hashedPassword = await bcrypt.hash(password, 10);
      query = "UPDATE usuarios SET nombre=?, email=?, password=?, rol_id=?";
      params.splice(2, 0, hashedPassword); // inserta hashedPassword en la posición correcta
    }

    query += " WHERE id=?";
    params.push(id);

    await pool.query(query, params);

    res.json({ message: "Usuario actualizado correctamente" });
  } catch (error) {
    console.error("Error al actualizar usuario:", error);
    res.status(500).json({ error: "Error al actualizar usuario" });
  }
});

/**
 * 📌 Eliminar un usuario
 */
router.delete("/:id", async (req, res) => {
  const { id } = req.params;
  try {
    await pool.query("DELETE FROM usuarios WHERE id=?", [id]);
    res.json({ message: "Usuario eliminado correctamente" });
  } catch (error) {
    console.error("Error al eliminar usuario:", error);
    res.status(500).json({ error: "Error al eliminar usuario" });
  }
});

export default router;
