import express from "express";
import cors from "cors";
import bodyParser from "body-parser";

const app = express();
const PORT = 5000;

app.use(cors());
app.use(bodyParser.json());

// In-memory "database" for demo purposes
const users = [];

// Unified registration route
app.post("/api/register", (req, res) => {
  const { name, email, password, role } = req.body;

  if (!name || !email || !password || !role) {
    return res.status(400).json({ message: "All fields are required" });
  }

  // Check if user already exists
  const userExists = users.find(u => u.email === email);
  if (userExists) {
    return res.status(400).json({ message: "User already exists" });
  }

  // Save user
  const newUser = { id: users.length + 1, name, email, password, role };
  users.push(newUser);

  // Send response with a dummy token
  res.json({ message: "Registration successful", token: "dummy-token", user: newUser });
});

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
