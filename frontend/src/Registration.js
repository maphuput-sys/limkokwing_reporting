import React, { useState } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";

// Backend URL
const API_BASE_URL = "https://limkokwing-reporting3.onrender.com";

const Registration = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    role: "student", // default role
    department: "",  // for lecturers
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      // Force role to lowercase
      const payload = { ...form, role: form.role.toLowerCase() };

      // Remove department if not lecturer
      if (payload.role !== "lecturer") delete payload.department;

      const res = await axios.post(`${API_BASE_URL}/api/register`, payload, {
        headers: { "Content-Type": "application/json" },
      });

      // Save info locally
      localStorage.setItem("role", payload.role);
      localStorage.setItem("userId", res.data.user.id);
      localStorage.setItem("userName", res.data.user.name);

      // Navigate to role-specific dashboard
      navigate(`/${payload.role}`);
    } catch (err) {
      console.error("❌ Registration error:", err.response?.data || err.message);
      setError(err.response?.data?.message || "Registration failed.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mt-5">
      <div className="row justify-content-center">
        <div className="col-md-5">
          <div className="card shadow p-4">
            <h3 className="text-center mb-4">User Registration</h3>
            <form onSubmit={handleSubmit}>
              {/* Name */}
              <input
                type="text"
                name="name"
                className="form-control mb-3"
                placeholder="Full Name"
                value={form.name}
                onChange={handleChange}
                required
              />

              {/* Email */}
              <input
                type="email"
                name="email"
                className="form-control mb-3"
                placeholder="Email"
                value={form.email}
                onChange={handleChange}
                required
              />

              {/* Password */}
              <input
                type="password"
                name="password"
                className="form-control mb-3"
                placeholder="Password"
                value={form.password}
                onChange={handleChange}
                required
              />

              {/* Department (for lecturers only) */}
              {form.role === "lecturer" && (
                <input
                  type="text"
                  name="department"
                  className="form-control mb-3"
                  placeholder="Department"
                  value={form.department}
                  onChange={handleChange}
                  required
                />
              )}

              {/* Role */}
              <select
                name="role"
                className="form-select mb-3"
                value={form.role}
                onChange={handleChange}
              >
                <option value="student">Student</option>
                <option value="lecturer">Lecturer</option>
                <option value="prl">Principal Lecturer</option>
                <option value="pl">Program Leader</option>
              </select>

              {/* Submit Button */}
              <button
                type="submit"
                className="btn btn-primary w-100"
                disabled={loading}
              >
                {loading ? "Registering..." : "Register"}
              </button>

              <div className="text-center mt-3">
                <p className="mb-1">Already have an account?</p>
                <Link to="/login" className="btn btn-outline-success w-100">
                  Go to Login
                </Link>
              </div>

              {error && <p className="text-danger mt-3">{error}</p>}
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Registration;
