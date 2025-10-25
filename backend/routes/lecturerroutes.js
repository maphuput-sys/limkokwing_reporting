import express from "express";
import pool from "../models/db.js";

const router = express.Router();

// Get all lecturers
router.get("/", async (req, res) => {
  try {
    const [rows] = await pool.query("SELECT * FROM lecturers");
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch lecturers" });
  }
});

// Add a new lecturer
router.post("/add", async (req, res) => {
  const { name, email, faculty } = req.body;
  try {
    await pool.query("INSERT INTO lecturers (name, email, faculty) VALUES (?, ?, ?)", [
      name,
      email,
      faculty,
    ]);
    res.json({ message: "Lecturer added successfully" });
  } catch (err) {
    res.status(500).json({ error: "Failed to add lecturer" });
  }
});

export default router;
