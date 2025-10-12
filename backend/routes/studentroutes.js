 

import express from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import pool from "../models/db.js";

const router = express.Router();
const SECRET_KEY = "your_jwt_secret"; // Replace with a real secret key

// ==================== Register ====================
router.post("/register", async (req, res) => {
  const { name, email, password } = req.body;
  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    const sql = "INSERT INTO students (name, email, password) VALUES (?, ?, ?)";
    await pool.execute(sql, [name, email, hashedPassword]);
    res.status(201).json({ message: "Student registered" });
  } catch (err) {
    res.status(500).json({ error: "Registration failed" });
  }
});

// ==================== Login ====================
router.post("/login", async (req, res) => {
  const { email, password } = req.body;
  try {
    const [rows] = await pool.execute("SELECT * FROM students WHERE email = ?", [email]);
if (rows.length === 0) return res.status(401).json({ error: "User not found" });

    const student = rows[0];
    const isMatch = await bcrypt.compare(password, student.password);
    if (!isMatch) return res.status(401).json({ error: "Invalid password" });

    const token = jwt.sign({ id: student.id }, SECRET_KEY, { expiresIn: "1h" });
    res.json({ token, name: student.name });
  } catch (err) {
    res.status(500).json({ error: "Login failed" });
  }
});

// ==================== Monitoring (View Lectures) ====================
router.get("/monitoring/:studentId", async (req, res) => {
  const studentId = req.params.studentId;
  try {
    const [rows] = await pool.execute(
      "SELECT * FROM attendance WHERE student_id = ? ORDER BY date DESC",
      [studentId]
    );
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch monitoring data" });
  }
});

// ==================== Rating (Submit) ====================
router.post("/rating", async (req, res) => {
  const { student_id, lecture_id, rating, comment } = req.body;
  try {
    const sql = "INSERT INTO ratings (student_id, lecture_id, rating, comment) VALUES (?, ?, ?, ?)";
    await pool.execute(sql, [student_id, lecture_id, rating, comment]);
 res.status(201).json({ message: "Rating submitted" });
  } catch (err) {
    res.status(500).json({ error: "Rating failed" });
  }
});

export default router;