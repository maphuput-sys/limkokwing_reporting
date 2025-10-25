import express from "express";
import pool from "../models/db.js";

const router = express.Router();

// ----------------------------
// Get courses & lecturers for a student
// ----------------------------
router.get("/:student_id/courses", async (req, res) => {
  const { student_id } = req.params;

  try {
    const [rows] = await pool.query(
      `SELECT sc.course_id, c.course_name, sc.lecturer_id, l.lecturer_name
       FROM student_courses sc
       JOIN courses c ON sc.course_id = c.course_id
       JOIN lecturers l ON sc.lecturer_id = l.lecturer_id
       WHERE sc.student_id = ?`,
      [student_id]
    );

    res.json(rows); // returns array: [{course_id, course_name, lecturer_id, lecturer_name}, ...]
  } catch (err) {
    console.error("Failed to fetch student courses:", err);
    res.status(500).json({ error: "Failed to fetch courses" });
  }
});

export default router;
