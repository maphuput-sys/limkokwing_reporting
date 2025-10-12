 import express from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import pool from "../models/db.js";

const router = express.Router();
const SECRET = "pl_secret_key"; // Replace with env variable in production

// Register PL
router.post("/register", async (req, res) => {
  const { name, email, password, faculty } = req.body;
  try {
    const hashed = await bcrypt.hash(password, 10);
    await pool.execute(
      "INSERT INTO pl (name, email, password, faculty) VALUES (?, ?, ?, ?)",
      [name, email, hashed, faculty]
    );
    res.status(201).json({ message: "PL registered" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Login PL
router.post("/login", async (req, res) => {
  const { email, password } = req.body;
  try {
    const [rows] = await pool.execute("SELECT * FROM pl WHERE email = ?", [email]);
    if (rows.length === 0) return res.status(404).json({ error: "PL not found" });
 const match = await bcrypt.compare(password, rows[0].password);
    if (!match) return res.status(401).json({ error: "Invalid credentials" });

    const token = jwt.sign({ id: rows[0].id, faculty: rows[0].faculty }, SECRET, {
      expiresIn: "2h",
    });

    res.json({ message: "Login successful", token });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Auth Middleware
const authPL = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader) return res.status(401).json({ error: "Token missing" });

  try {
    const token = authHeader.split(" ")[1];
    const decoded = jwt.verify(token, SECRET);
    req.pl = decoded;
    next();
  } catch {
    res.status(401).json({ error: "Invalid token" });
  }
};

// View PRL Reports
router.get("/reports", authPL, async (req, res) => {
  try {
    const [rows] = await pool.execute(`
      SELECT lr.*, f.feedback, l.lecturer_name 
      FROM lecturer_reports lr
      JOIN prl_feedback f ON f.report_id = lr.id
      JOIN lecturers l ON l.id = lr.lecturer_id
      ORDER BY lr.date_of_lecture DESC
    `);
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Add a new course and assign lecturer
 router.post("/add-course", authPL, async (req, res) => {
  const { course_name, course_code, lecturer_id } = req.body;
  try {
    await pool.execute(
      "INSERT INTO courses (course_name, course_code, lecturer_id) VALUES (?, ?, ?)",
      [course_name, course_code, lecturer_id]
    );
    res.status(201).json({ message: "Course added" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// View All Courses
router.get("/courses", authPL, async (req, res) => {
  try {
    const [rows] = await pool.execute(`
      SELECT c.*, l.lecturer_name 
      FROM courses c 
      LEFT JOIN lecturers l ON c.lecturer_id = l.id
    `);
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Monitor classes / reports count
router.get("/monitoring", authPL, async (req, res) => {
  try {
    const [rows] = await pool.execute(`
      SELECT l.lecturer_name, COUNT(lr.id) AS total_reports
      FROM lecturer_reports lr
      JOIN lecturers l ON lr.lecturer_id = l.id
      GROUP BY l.lecturer_name
    `);
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Rate Lecturer
router.post("/rate", authPL, async (req, res) => {
  const { lecturer_id, rating, comment } = req.body;
  try {
 await pool.execute(
      "INSERT INTO pl_rating (pl_id, lecturer_id, rating, comment) VALUES (?, ?, ?, ?)",
      [req.pl.id, lecturer_id, rating, comment]
    );
    res.status(201).json({ message: "Lecturer rated" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;