import express from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import pool from "../models/db.js";

const router = express.Router();
const SECRET = "your_secret_key_here"; // ❗Replace with process.env.JWT_SECRET in production

// ============================================================
// 1️⃣ REGISTER LECTURER
// ============================================================
router.post("/register", async (req, res) => {
  const {
    faculty_name,
    class_name,
    lecturer_name,
    email,
    password,
  } = req.body;

  try {
    if (!faculty_name || !class_name || !lecturer_name || !email || !password) {
      return res.status(400).json({ error: "All fields are required" });
    }

    // Check if lecturer already exists
    const [existing] = await pool.execute(
      "SELECT * FROM lecturers WHERE email = ?",
      [email]
    );
    if (existing.length > 0) {
      return res.status(409).json({ error: "Email already registered" });
    }

    // Hash password
    const hashed = await bcrypt.hash(password, 10);

    const sql = `
      INSERT INTO lecturers
      (faculty_name, class_name, lecturer_name, email, password)
      VALUES (?, ?, ?, ?, ?)
    `;
    await pool.execute(sql, [
      faculty_name,
      class_name,
      lecturer_name,
      email,
      hashed,
    ]);

    res.status(201).json({ message: "Lecturer registered successfully" });
  } catch (err) {
    console.error("Registration Error:", err);
    res.status(500).json({ error: "Registration failed" });
  }
});

// ============================================================
// 2️⃣ LOGIN LECTURER
// ============================================================
router.post("/login", async (req, res) => {
  const { email, password } = req.body;

  try {
    const [rows] = await pool.execute(
      "SELECT * FROM lecturers WHERE email = ?",
      [email]
    );
    if (rows.length === 0) {
      return res.status(401).json({ error: "Lecturer not found" });
    }

    const lecturer = rows[0];
    const match = await bcrypt.compare(password, lecturer.password);
    if (!match) {
      return res.status(401).json({ error: "Invalid credentials" });
    }

    const token = jwt.sign(
      { id: lecturer.id, email: lecturer.email, role: "lecturer" },
      SECRET,
      { expiresIn: "2h" }
    );

    res.json({
      message: "Login successful",
      token,
      lecturer: {
        id: lecturer.id,
        name: lecturer.lecturer_name,
        email: lecturer.email,
        faculty: lecturer.faculty_name,
        class_name: lecturer.class_name,
      },
    });
  } catch (err) {
    console.error("Login Error:", err);
    res.status(500).json({ error: "Login failed" });
  }
});

// ============================================================
// 3️⃣ SUBMIT LECTURE REPORT
// ============================================================
router.post("/report", async (req, res) => {
  const {
    lecturer_id,
    faculty_name,
    class_name,
    week_of_reporting,
    date_of_lecture,
    course_name,
    course_code,
    actual_students_present,
    total_registered_students,
    venue,
    scheduled_time,
    topic_taught,
    learning_outcomes,
    recommendations,
  } = req.body;

  try {
    const sql = `
      INSERT INTO lecturer_reports
      (lecturer_id, faculty_name, class_name, week_of_reporting,
       date_of_lecture, course_name, course_code,
       actual_students_present, total_registered_students,
       venue, scheduled_time, topic_taught, learning_outcomes, recommendations)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;
    await pool.execute(sql, [
      lecturer_id,
      faculty_name,
      class_name,
      week_of_reporting,
      date_of_lecture,
      course_name,
      course_code,
      actual_students_present,
      total_registered_students,
      venue,
      scheduled_time,
      topic_taught,
      learning_outcomes,
      recommendations,
    ]);

    res.status(201).json({ message: "Report submitted successfully" });
  } catch (err) {
    console.error("Report Error:", err);
    res.status(500).json({ error: "Report submission failed" });
  }
});

// ============================================================
// 4️⃣ GET REPORTS BY LECTURER ID
// ============================================================
router.get("/reports/:lecturerId", async (req, res) => {
  const { lecturerId } = req.params;

  try {
    const [rows] = await pool.execute(
      "SELECT * FROM lecturer_reports WHERE lecturer_id = ? ORDER BY date_of_lecture DESC",
      [lecturerId]
    );
    res.json(rows);
  } catch (err) {
    console.error("Fetch Reports Error:", err);
    res.status(500).json({ error: "Could not fetch reports" });
  }
});

// ============================================================
// 5️⃣ GET COURSES ASSIGNED TO LECTURER
// ============================================================
router.get("/courses/:lecturerId", async (req, res) => {
  const { lecturerId } = req.params;

  try {
    const [rows] = await pool.execute(
      "SELECT * FROM courses WHERE lecturer_id = ?",
      [lecturerId]
    );
    res.json(rows);
  } catch (err) {
    console.error("Fetch Courses Error:", err);
    res.status(500).json({ error: "Could not fetch courses" });
  }
});

export default router;
