import express from "express";
import pool from "../models/db.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

const router = express.Router();
const JWT_SECRET = "your_secret_key"; // store in .env ideally

/* ----------------------------
   REGISTER (Student, Lecturer, PRL, PL)
---------------------------- */
router.post("/register", async (req, res) => {
  const { name, email, password, role, department } = req.body;

  if (!name || !email || !password || !role) {
    return res.status(400).json({ message: "All fields are required." });
  }

  if (!["student", "lecturer", "prl", "pl"].includes(role)) {
    return res.status(400).json({ message: "Invalid role." });
  }

  try {
    // Check if email already exists in users table
    const [existing] = await pool.query("SELECT * FROM users WHERE email = ?", [email]);
    if (existing.length > 0) {
      return res.status(400).json({ message: "Email already registered." });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Insert into users table
    const [result] = await pool.query(
      "INSERT INTO users (name, email, password, role) VALUES (?, ?, ?, ?)",
      [name, email, hashedPassword, role]
    );

    // If role is lecturer, insert into lecturers table
    if (role === "lecturer") {
      if (!department) {
        return res.status(400).json({ message: "Department is required for lecturers." });
      }

      await pool.query(
        "INSERT INTO lecturers (lecturer_name, lecturer_email, department) VALUES (?, ?, ?)",
        [name, email, department]
      );
    }

    res.json({
      message: "Registration successful",
      user: {
        id: result.insertId,
        name,
        email,
        role,
      },
    });
  } catch (err) {
    console.error("❌ Registration error:", err);
    res.status(500).json({ message: "Registration failed.", error: err.message });
  }
});

/* ----------------------------
   LOGIN (Student, Lecturer, PRL, PL)
---------------------------- */
router.post("/login", async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: "Email and password are required." });
  }

  try {
    const [rows] = await pool.query("SELECT * FROM users WHERE email = ?", [email]);
    if (rows.length === 0) {
      return res.status(401).json({ message: "Invalid email or password." });
    }

    const user = rows[0];
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid email or password." });
    }

    const token = jwt.sign({ id: user.id, role: user.role }, JWT_SECRET, { expiresIn: "1h" });

    res.json({
      message: "Login successful",
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (err) {
    console.error("❌ Login error:", err);
    res.status(500).json({ message: "Login failed." });
  }
});

export default router;
