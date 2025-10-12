import express from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import pool from "../models/db.js";

const router = express.Router();
// IMPORTANT: Use environment variable (e.g., process.env.JWT_SECRET) in production!
const SECRET = "your_prl_jwt_secret";

// Middleware to protect routes and extract PRL data
const authPRL = (req, res, next) => {
  const authHeader = req.headers.authorization;
  // 1. Check for token
  if (!authHeader) return res.status(401).json({ error: "Missing token" });
  
  const token = authHeader.split(" ")[1];
  
  try {
    // 2. Verify and decode token
    const decoded = jwt.verify(token, SECRET);
    req.prl = decoded; // attaches id and stream to the request
    next();
  } catch (err) {
    // 3. Handle invalid/expired token
    return res.status(401).json({ error: "Invalid token" });
  }
};

// --- PRL Registration ---
router.post("/register", async (req, res) => {
  const { name, email, password, stream } = req.body;
  try {
    const hashed = await bcrypt.hash(password, 10);
    // Corrected SQL string with quotes
    const sql = "INSERT INTO prl (name, email, password, stream) VALUES (?, ?, ?, ?)";
    await pool.execute(sql, [name, email, hashed, stream]);
    res.status(201).json({ message: "PRL registered successfully" });
  } catch (err) {
    console.error(err);
    // Check for duplicate entry error (e.g., duplicate email)
    if (err.code === 'ER_DUP_ENTRY') {
        return res.status(409).json({ error: "Email already exists" });
    }
    res.status(500).json({ error: "Registration failed" });
  }
});

// --- PRL Login ---
router.post("/login", async (req, res) => {
  const { email, password } = req.body;
  try {
    const [rows] = await pool.execute(
      "SELECT id, password, stream FROM prl WHERE email = ?",
      [email]
    );
    if (rows.length === 0) {
      return res.status(401).json({ error: "PRL not found" });
    }
    
    const prl = rows[0];
    const match = await bcrypt.compare(password, prl.password);
    
    if (!match) {
      return res.status(401).json({ error: "Invalid credentials" });
    }
    
    const token = jwt.sign({ id: prl.id, stream: prl.stream }, SECRET, {
      expiresIn: "2h",
    });
    
    res.json({ message: "Login successful", token, stream: prl.stream });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Login failed" });
  }
});

// --- Add Feedback (New, dedicated endpoint) ---
router.post("/feedback", authPRL, async (req, res) => {
    // req.prl contains { id: prl_id, stream: prl.stream }
    const prl_id = req.prl.id; 
    const { report_id, feedback } = req.body;
    
    try {
        const sql = `
          INSERT INTO prl_feedback (report_id, prl_id, feedback_text) 
          VALUES (?, ?, ?)
        `;
        await pool.execute(sql, [report_id, prl_id, feedback]);
        res.status(201).json({ message: "Feedback added successfully" });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Adding feedback failed" });
    }
});


// --- Monitoring & Rating Endpoints ---

router.get("/monitoring", authPRL, async (req, res) => {
  // Example: fetch metrics, stats or attendance trends for PRL’s stream
  const { stream } = req.prl;
  try {
    const sql = `
      SELECT l.lecturer_name, COUNT(lr.id) AS reports_count
      FROM lecturer_reports lr
      JOIN lecturers l ON lr.lecturer_id = l.id
      WHERE l.stream = ?
      GROUP BY l.lecturer_name
    `;
    const [rows] = await pool.execute(sql, [stream]);
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch monitoring data" });
  }
});

router.post("/rating", authPRL, async (req, res) => {
  const { lecturer_id, rating, comment } = req.body;
  // PRL can rate lecturers under their stream
  try {
    const sql = `
      INSERT INTO prl_rating (prl_id, lecturer_id, rating, comment)
      VALUES (?, ?, ?, ?)
    `;
    await pool.execute(sql, [req.prl.id, lecturer_id, rating, comment]);
    res.status(201).json({ message: "Rating submitted" });
  } catch (err) { // Moved the catch block into its correct position
    console.error(err);
    res.status(500).json({ error: "Submitting rating failed" });
  }
});

export default router;