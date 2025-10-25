import express from "express";
import pool from "../models/db.js";

const router = express.Router();

/* =========================================================
   🔹 GET all classes (for admin/PL view)
========================================================= */
router.get("/", async (req, res) => {
  try {
    const [rows] = await pool.query("SELECT * FROM classes ORDER BY id DESC");
    res.json(rows);
  } catch (err) {
    console.error("❌ Error fetching classes:", err.message);
    res.status(500).json({ error: "Failed to fetch classes" });
  }
});

/* =========================================================
   🔹 GET classes assigned by a specific PL (for PRL)
========================================================= */
router.get("/assigned-by-pl/:plId", async (req, res) => {
  const { plId } = req.params;
  try {
    const [rows] = await pool.query(
      `SELECT c.id, c.class_name, co.course_name, l.name AS lecturer_name, c.venue
       FROM classes c
       JOIN courses co ON c.course = co.id
       JOIN lecturers l ON c.lecturer = l.id
       WHERE c.assigned_by_pl_id = ?
       ORDER BY c.id DESC`,
      [plId]
    );
    res.json(rows);
  } catch (err) {
    console.error("❌ Error fetching classes for PL:", err.message);
    res.status(500).json({ error: "Failed to fetch classes for this PL" });
  }
});

/* =========================================================
   🔹 ADD a new class (assigned by PL)
========================================================= */
router.post("/", async (req, res) => {
  const { class_name, course, lecturer, venue, assigned_by_pl_id } = req.body;

  if (!class_name || !course || !lecturer || !venue || !assigned_by_pl_id) {
    return res.status(400).json({ error: "All fields are required" });
  }

  try {
    const [result] = await pool.query(
      `INSERT INTO classes (class_name, course, lecturer, venue, assigned_by_pl_id)
       VALUES (?, ?, ?, ?, ?)`,
      [class_name, course, lecturer, venue, assigned_by_pl_id]
    );

    res.status(201).json({
      message: "✅ Class saved successfully",
      class_id: result.insertId,
    });
  } catch (err) {
    console.error("❌ Database error saving class:", err.message);
    res.status(500).json({ error: "Failed to save class" });
  }
});

/* =========================================================
   🔹 DELETE a class
========================================================= */
router.delete("/:id", async (req, res) => {
  const { id } = req.params;

  try {
    await pool.query("DELETE FROM classes WHERE id = ?", [id]);
    res.json({ message: "🗑️ Class deleted successfully" });
  } catch (err) {
    console.error("❌ Error deleting class:", err.message);
    res.status(500).json({ error: "Failed to delete class" });
  }
});

export default router;
