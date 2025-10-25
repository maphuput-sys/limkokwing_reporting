import express from "express";
import pool from "../models/db.js";

const router = express.Router();

/* =========================================================
   🔹 GET all courses (for PL or admin view)
   ========================================================= */
router.get("/", async (req, res) => {
  try {
    const [rows] = await pool.query(`
      SELECT 
        c.course_id,
        c.course_name,
        c.course_code,
        c.lecturer_id,
        l.lecturer_name,
        c.assigned_by_pl_id,
        pl.name AS assigned_by_pl_name,
        pl.email AS pl_email,
        c.venue
      FROM courses c
      LEFT JOIN lecturers l ON c.lecturer_id = l.lecturer_id
      LEFT JOIN program_leaders pl ON c.assigned_by_pl_id = pl.pl_id
      ORDER BY c.course_name ASC
    `);
    res.json(rows);
  } catch (err) {
    console.error("❌ Error fetching courses:", err);
    res.status(500).json({ message: "Server error" });
  }
});

/* =========================================================
   🔹 GET courses assigned BY a specific PL
   ========================================================= */
router.get("/assigned", async (req, res) => {
  const { pl_id } = req.query;
  if (!pl_id) return res.status(400).json({ message: "pl_id is required" });

  try {
    const [rows] = await pool.query(`
      SELECT 
        c.course_id,
        c.course_name,
        c.course_code,
        c.lecturer_id,
        l.lecturer_name,
        c.assigned_by_pl_id,
        pl.name AS assigned_by_pl_name,
        pl.email AS pl_email,
        c.venue
      FROM courses c
      LEFT JOIN lecturers l ON c.lecturer_id = l.lecturer_id
      LEFT JOIN program_leaders pl ON c.assigned_by_pl_id = pl.pl_id
      WHERE c.assigned_by_pl_id = ?
      ORDER BY c.course_name ASC
    `, [pl_id]);

    res.json(rows);
  } catch (err) {
    console.error("❌ Error fetching assigned courses:", err);
    res.status(500).json({ message: "Server error" });
  }
});

/* =========================================================
   🔹 GET courses assigned TO a specific lecturer
   ========================================================= */
router.get("/lecturer", async (req, res) => {
  const { lecturer_id } = req.query;
  if (!lecturer_id) return res.status(400).json({ message: "lecturer_id is required" });

  try {
    const [rows] = await pool.query(`
      SELECT 
        c.course_id,
        c.course_name,
        c.course_code,
        l.lecturer_name,
        pl.name AS assigned_by_pl_name,
        pl.email AS pl_email,
        c.venue
      FROM courses c
      LEFT JOIN lecturers l ON c.lecturer_id = l.lecturer_id
      LEFT JOIN program_leaders pl ON c.assigned_by_pl_id = pl.pl_id
      WHERE c.lecturer_id = ?
      ORDER BY c.course_name ASC
    `, [lecturer_id]);

    res.json(rows);
  } catch (err) {
    console.error("❌ Error fetching lecturer's courses:", err);
    res.status(500).json({ message: "Server error" });
  }
});

/* =========================================================
   🔹 POST: Add / Assign new course
   ========================================================= */
router.post("/", async (req, res) => {
  const { course_name, course_code, lecturer_id, assigned_by_pl_id, venue } = req.body;

  try {
    // Optional: trim strings
    const nameTrimmed = course_name?.trim();
    const codeTrimmed = course_code?.trim();

    if (!nameTrimmed || !codeTrimmed) {
      return res.status(400).json({ message: "course_name and course_code are required" });
    }

    let lecturer_name = null;
    if (lecturer_id) {
      const [lecturer] = await pool.query(
        "SELECT lecturer_name FROM lecturers WHERE lecturer_id = ?",
        [lecturer_id]
      );
      lecturer_name = lecturer[0]?.lecturer_name || null;
    }

    const [result] = await pool.query(`
      INSERT INTO courses 
        (course_name, course_code, lecturer_id, lecturer_name, assigned_by_pl_id, venue)
      VALUES (?, ?, ?, ?, ?, ?)
    `, [nameTrimmed, codeTrimmed, lecturer_id || null, lecturer_name, assigned_by_pl_id || null, venue || null]);

    const [newCourse] = await pool.query(
      "SELECT * FROM courses WHERE course_id = ?",
      [result.insertId]
    );

    res.status(201).json({ message: "✅ Course assigned successfully", newCourse: newCourse[0] });

  } catch (err) {
    console.error("❌ Error adding course:", err);
    res.status(500).json({ message: "Server error" });
  }
});

/* =========================================================
   🔹 PUT: Update existing course (returns updated record)
   ========================================================= */
router.put("/:id", async (req, res) => {
  const { id } = req.params;
  const { course_name, course_code, lecturer_id, assigned_by_pl_id, venue } = req.body;

  try {
    const nameTrimmed = course_name?.trim();
    const codeTrimmed = course_code?.trim();

    if (!nameTrimmed || !codeTrimmed) {
      return res.status(400).json({ message: "course_name and course_code are required" });
    }

    let lecturer_name = null;
    if (lecturer_id) {
      const [lecturer] = await pool.query(
        "SELECT lecturer_name FROM lecturers WHERE lecturer_id = ?",
        [lecturer_id]
      );
      lecturer_name = lecturer[0]?.lecturer_name || null;
    }

    await pool.query(`
      UPDATE courses
      SET 
        course_name = ?, 
        course_code = ?, 
        lecturer_id = ?, 
        lecturer_name = ?, 
        assigned_by_pl_id = ?, 
        venue = ?
      WHERE course_id = ?
    `, [nameTrimmed, codeTrimmed, lecturer_id || null, lecturer_name, assigned_by_pl_id || null, venue || null, id]);

    const [updatedCourse] = await pool.query("SELECT * FROM courses WHERE course_id = ?", [id]);
    res.json({ message: "✅ Course updated successfully", updatedCourse: updatedCourse[0] });

  } catch (err) {
    console.error("❌ Error updating course:", err);
    res.status(500).json({ message: "Server error" });
  }
});

/* =========================================================
   🔹 DELETE: Remove a course
   ========================================================= */
router.delete("/:id", async (req, res) => {
  try {
    await pool.query("DELETE FROM courses WHERE course_id = ?", [req.params.id]);
    res.json({ message: "🗑️ Course deleted successfully" });
  } catch (err) {
    console.error("❌ Error deleting course:", err);
    res.status(500).json({ message: "Server error" });
  }
});

export default router;
