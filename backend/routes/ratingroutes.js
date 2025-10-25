import express from "express";
import pool from "../models/db.js";

const router = express.Router();

/* =========================================================
   🔹 GET all lecturers (for student dropdown)
   ========================================================= */
router.get("/lecturers", async (req, res) => {
  try {
    const [rows] = await pool.query("SELECT lecturer_id, name FROM lecturers");
    res.json(rows);
  } catch (err) {
    console.error("❌ Error fetching lecturers:", err.message);
    res.status(500).json({ error: "Failed to fetch lecturers" });
  }
});

/* =========================================================
   🔹 POST - Student submits lecturer rating
   ========================================================= */
router.post("/rate/lecturer", async (req, res) => {
  const { student_id, lecturer_id, rating, feedback } = req.body;

  try {
    if (!student_id || !lecturer_id || !rating) {
      return res
        .status(400)
        .json({ error: "Missing required fields (student_id, lecturer_id, rating)" });
    }

    const sid = Number(student_id);
    const lid = Number(lecturer_id);

    // ✅ Check that student exists
    const [studentCheck] = await pool.query(
      "SELECT student_id FROM student WHERE student_id = ?",
      [sid]
    );
    if (studentCheck.length === 0) {
      return res.status(400).json({ error: "Invalid student_id — not found" });
    }

    // ✅ Check that lecturer exists
    const [lecturerCheck] = await pool.query(
      "SELECT lecturer_id FROM lecturers WHERE lecturer_id = ?",
      [lid]
    );
    if (lecturerCheck.length === 0) {
      return res.status(400).json({ error: "Invalid lecturer_id — not found" });
    }

    // ✅ Insert rating
    await pool.query(
      `INSERT INTO lecturer_ratings (student_id, lecturer_id, rating, feedback)
       VALUES (?, ?, ?, ?)`,
      [sid, lid, rating, feedback || null]
    );

    console.log(`✅ Rating added: Student ${sid} → Lecturer ${lid}`);
    res.json({ message: "Lecturer rating submitted successfully" });
  } catch (err) {
    console.error("❌ Error inserting rating:", err.message);
    res.status(500).json({ error: "Failed to submit rating", details: err.message });
  }
});

/* =========================================================
   🔹 GET - Lecturer fetches their ratings (used in Lecturer.js)
   ========================================================= */
router.get("/lecturer/:lecturer_id", async (req, res) => {
  const { lecturer_id } = req.params;

  try {
    const [rows] = await pool.query(
      `SELECT 
         lr.rating, 
         lr.feedback, 
         lr.created_at,
         s.student_id, 
         s.student_name
       FROM lecturer_ratings lr
       JOIN student s ON lr.student_id = s.student_id
       WHERE lr.lecturer_id = ?
       ORDER BY lr.created_at DESC`,
      [lecturer_id]
    );

    res.json(rows);
  } catch (err) {
    console.error("❌ Error fetching lecturer ratings:", err.message);
    res.status(500).json({ error: "Failed to fetch lecturer ratings" });
  }
});

/* =========================================================
   🔹 GET - PRL/PL view all lecturers with average ratings
   ========================================================= */
router.get("/ratings/all", async (req, res) => {
  try {
    const [rows] = await pool.query(
      `SELECT 
          l.lecturer_id, 
          l.name AS lecturer_name,
          COUNT(lr.rating) AS total_ratings,
          ROUND(AVG(lr.rating), 2) AS avg_rating
       FROM lecturers l
       LEFT JOIN lecturer_ratings lr ON l.lecturer_id = lr.lecturer_id
       GROUP BY l.lecturer_id, l.name
       ORDER BY avg_rating DESC`
    );
    res.json(rows);
  } catch (err) {
    console.error("❌ Error fetching aggregated ratings:", err.message);
    res.status(500).json({ error: "Failed to fetch lecturer ratings summary" });
  }
});

export default router;
