// routes/reportRoutes.js
import express from "express";
import pool from "../models/db.js"; // adjust path if different

const router = express.Router();

/**
 * POST /api/reports/add
 * Adds a new lecturer report
 */
router.post("/add", async (req, res) => {
  try {
    const {
      lecturer_id,
      course_id,
      week_of_reporting,
      date,
      course_name,
      course_code,
      lecturer_name,
      students_present,
      total_students,
      venue,
      lecture_time,
      topic_taught,
      learning_outcomes,
      recommendations,
      faculty_name,
      class_name,
      report_text,
    } = req.body;

    if (!course_name || !lecturer_name) {
      return res.status(400).json({ error: "course_name and lecturer_name are required" });
    }

    const [result] = await pool.query(
      `INSERT INTO reports
       (lecturer_id, course_id, week_of_reporting, report_text, created_at,
        faculty_name, class_name, week, date, course_name, course_code, lecturer_name,
        students_present, total_students, venue, lecture_time, topic_taught,
        learning_outcomes, recommendations)
       VALUES (?, ?, ?, ?, NOW(), ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        lecturer_id || null,
        course_id || null,
        week_of_reporting || null,
        report_text || null,
        faculty_name || null,
        class_name || null,
        week_of_reporting || null,
        date || null,
        course_name || null,
        course_code || null,
        lecturer_name || null,
        students_present ?? null,
        total_students ?? null,
        venue || null,
        lecture_time || null,
        topic_taught || null,
        learning_outcomes || null,
        recommendations || null,
      ]
    );

    res.json({ message: "✅ Report submitted successfully", report_id: result.insertId });
  } catch (err) {
    console.error("Error in POST /api/reports/add:", err);
    res.status(500).json({ error: "Failed to submit report" });
  }
});

/**
 * GET /api/reports
 * Fetch all reports (newest first)
 */
router.get("/", async (req, res) => {
  try {
    const [rows] = await pool.query("SELECT * FROM reports ORDER BY created_at DESC");
    res.json(rows);
  } catch (err) {
    console.error("Error in GET /api/reports:", err);
    res.status(500).json({ error: "Failed to fetch reports" });
  }
});

/**
 * POST /api/reports/feedback
 * Add PRL feedback
 */
router.post("/feedback", async (req, res) => {
  try {
    const { report_id, prl_name, feedback_text } = req.body;
    if (!report_id || !feedback_text) {
      return res.status(400).json({ error: "report_id and feedback_text are required" });
    }

    const [result] = await pool.query(
      `INSERT INTO report_feedback (report_id, prl_name, feedback_text, feedback_date)
       VALUES (?, ?, ?, NOW())`,
      [report_id, prl_name || null, feedback_text]
    );

    res.json({ message: "✅ Feedback submitted successfully", feedback_id: result.insertId });
  } catch (err) {
    console.error("Error in POST /api/reports/feedback:", err);
    res.status(500).json({ error: "Failed to submit feedback" });
  }
});

/**
 * DELETE /api/reports/feedback/:id
 * Delete PRL feedback by feedback_id
 */
router.delete("/feedback/:id", async (req, res) => {
  try {
    const feedbackId = req.params.id;
    if (!feedbackId) return res.status(400).json({ error: "Feedback ID is required" });

    const [result] = await pool.query("DELETE FROM report_feedback WHERE feedback_id = ?", [
      feedbackId,
    ]);

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: "Feedback not found" });
    }

    res.json({ message: "🗑 Feedback deleted successfully" });
  } catch (err) {
    console.error("Error deleting feedback:", err);
    res.status(500).json({ error: "Failed to delete feedback" });
  }
});

/**
 * GET /api/reports/with-feedback
 * Returns all reports with any matching feedback
 */
router.get("/with-feedback", async (req, res) => {
  try {
    const [rows] = await pool.query(`
      SELECT r.*, f.feedback_id, f.prl_name, f.feedback_text, f.feedback_date
      FROM reports r
      LEFT JOIN report_feedback f ON r.report_id = f.report_id
      ORDER BY r.created_at DESC, f.feedback_date DESC
    `);
    res.json(rows);
  } catch (err) {
    console.error("Error in GET /api/reports/with-feedback:", err);
    res.status(500).json({ error: "Failed to fetch reports with feedback" });
  }
});

export default router;
