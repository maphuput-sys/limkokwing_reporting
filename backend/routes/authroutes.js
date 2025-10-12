import express from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import pool from "../models/db.js";

const router = express.Router();
const SECRET = "your_secret_key_here"; // use process.env.JWT_SECRET in production

// ======================================================
// REGISTER USER (Student / Lecturer / PL / PRL)
// ======================================================
router.post("/register", async (req, res) => {
  const { name, email, password, role } = req.body;

  try {
    if (!name || !email || !password || !role) {
      return res.status(400).json({ message: "All fields are required" });
    }

    // Check if email already exists across all tables
    const [existingStudent] = await pool.execute(
      "SELECT * FROM students WHERE email = ?",
      [email]
    );
    const [existingLecturer] = await pool.execute(
      "SELECT * FROM lecturers WHERE email = ?",
      [email]
    );

    if (existingStudent.length > 0 || existingLecturer.length > 0) {
      return res.status(409).json({ message: "Email already registered" });
    }

    const hashed = await bcrypt.hash(password, 10);

    let tableName;
    let insertQuery;

    switch (role) {
      case "student":
        tableName = "students";
        insertQuery = "INSERT INTO students (name, email, password, role) VALUES (?, ?, ?, ?)";
        await pool.execute(insertQuery, [name, email, hashed, role]);
        break;

      case "lecturer":
        tableName = "lecturers";
        insertQuery = "INSERT INTO lecturers (lecturer_name, email, password) VALUES (?, ?, ?)";
        await pool.execute(insertQuery, [name, email, hashed]);
        break;

      case "prl":
        tableName = "principal_lecturers";
        insertQuery = "INSERT INTO principal_lecturers (name, email, password) VALUES (?, ?, ?)";
        await pool.execute(insertQuery, [name, email, hashed]);
        break;

      case "pl":
        tableName = "program_leaders";
        insertQuery = "INSERT INTO program_leaders (name, email, password) VALUES (?, ?, ?)";
        await pool.execute(insertQuery, [name, email, hashed]);
        break;

      default:
        return res.status(400).json({ message: "Invalid role" });
    }

    res.status(201).json({ message: `${role} registered successfully!` });
  } catch (err) {
    console.error("Registration Error:", err);
    res.status(500).json({ message: "Server error during registration" });
  }
});

// ======================================================
// LOGIN USER (All roles)
// ======================================================
router.post("/login", async (req, res) => {
  const { email, password, role } = req.body;

  try {
    let tableName;
    let nameField = "name";

    switch (role) {
      case "student":
        tableName = "students";
        break;
      case "lecturer":
        tableName = "lecturers";
        nameField = "lecturer_name";
        break;
      case "prl":
        tableName = "principal_lecturers";
        break;
      case "pl":
        tableName = "program_leaders";
        break;
      default:
        return res.status(400).json({ message: "Invalid role" });
    }

    const [rows] = await pool.execute(
      `SELECT * FROM ${tableName} WHERE email = ?`,
      [email]
    );

    if (rows.length === 0) {
      return res.status(404).json({ message: "User not found" });
    }

    const user = rows[0];
    const match = await bcrypt.compare(password, user.password);

    if (!match) {
      return res.status(401).json({ message: "Incorrect password" });
    }

    const token = jwt.sign(
      { id: user.id, email: user.email, role },
      SECRET,
      { expiresIn: "2h" }
    );

    res.json({
      message: "Login successful",
      token,
      user: {
        id: user.id,
        name: user[nameField],
        email: user.email,
        role,
      },
    });
  } catch (err) {
    console.error("Login Error:", err);
    res.status(500).json({ message: "Login failed" });
  }
});

export default router;
