import express from "express";
import cors from "cors";
import bodyParser from "body-parser";
import pool from "./models/db.js";

import studentroutes from "./routes/studentroutes.js";
import lecturerroutes from "./routes/lecturerroutes.js";
import ratingroutes from "./routes/ratingroutes.js";
import reportroutes from "./routes/reportroutes.js";
import courseroutes from "./routes/courseroutes.js";
import authroutes from "./routes/authroutes.js";
import classroutes from "./routes/classroutes.js"; // ✅ NEW import

const app = express();
const PORT = 5000;

app.use(cors());
app.use(bodyParser.json());

/* ----------------------------
   ✅ UNIVERSAL REGISTRATION
---------------------------- */
app.post("/api/register", async (req, res) => {
  const { name, email, password, role } = req.body;

  try {
    let table, columns;

    switch (role) {
      case "student":
        table = "student";
        columns = ["student_name", "student_email", "student_password"];
        break;
      case "lecturer":
        table = "lecturers";
        columns = ["lecturer_name", "lecturer_email", "lecturer_password"];
        break;
      case "pl":
        table = "program_leaders";
        columns = ["name", "email", "password"];
        break;
      case "prl":
        table = "principal_lecturers";
        columns = ["name", "email", "password"];
        break;
      default:
        return res.status(400).json({ message: "Invalid role" });
    }

    // Check if user already exists
    const [existing] = await pool.query(
      `SELECT * FROM ${table} WHERE ${columns[1]} = ?`,
      [email]
    );
    if (existing.length > 0) {
      return res.status(400).json({ message: "User already exists" });
    }

    // Insert new user
    const [result] = await pool.query(
      `INSERT INTO ${table} (${columns.join(", ")}) VALUES (?, ?, ?)`,
      [name, email, password]
    );

    res.json({
      message: `${role} registered successfully`,
      user: { id: result.insertId, name, email, role },
    });
  } catch (err) {
    console.error("❌ Registration error:", err);
    res.status(500).json({ message: "Registration failed" });
  }
});

/* ----------------------------
   ✅ UNIVERSAL LOGIN
---------------------------- */
app.post("/api/login", async (req, res) => {
  const { email, password, role } = req.body;

  try {
    let table, columns;

    switch (role) {
      case "student":
        table = "student";
        columns = ["student_name", "student_email", "student_password"];
        break;
      case "lecturer":
        table = "lecturers";
        columns = ["lecturer_name", "lecturer_email", "lecturer_password"];
        break;
      case "pl":
        table = "program_leaders";
        columns = ["name", "email", "password"];
        break;
      case "prl":
        table = "principal_lecturers";
        columns = ["name", "email", "password"];
        break;
      default:
        return res.status(400).json({ message: "Invalid role" });
    }

    const [rows] = await pool.query(
      `SELECT * FROM ${table} WHERE ${columns[1]} = ? AND ${columns[2]} = ?`,
      [email, password]
    );

    if (rows.length === 0) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    res.json({
      message: "Login successful",
      user: rows[0],
    });
  } catch (err) {
    console.error("❌ Login error:", err);
    res.status(500).json({ message: "Login failed" });
  }
});

/* ----------------------------
   ✅ ROUTES
---------------------------- */
app.use("/api/students", studentroutes);
app.use("/api/lecturers", lecturerroutes);
app.use("/api/ratings", ratingroutes);
app.use("/api/reports", reportroutes);
app.use("/api/courses", courseroutes);
app.use("/api/classes", classroutes); // ✅ Added this new route
app.use("/api/auth", authroutes);

app.listen(PORT, () => {
  console.log(`✅ Server running on http://localhost:${PORT}`);
});
