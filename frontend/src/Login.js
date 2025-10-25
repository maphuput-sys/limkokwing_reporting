import React, { useState } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";
import API_BASE_URL from "./config";
import "bootstrap/dist/css/bootstrap.min.css";

const Login = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    email: "",
    password: "",
    role: "",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      // Send the email, password, and role to backend
      const res = await axios.post(`${API_BASE_URL}/api/login`, form, {
        headers: { "Content-Type": "application/json" },
      });

      console.log("✅ Login response:", res.data);

      if (res.data && res.data.user) {
        // Save user data in localStorage
        localStorage.setItem("userId", res.data.user.id || "");
        localStorage.setItem("role", form.role.toLowerCase());
        localStorage.setItem("email", form.email);

        // Redirect based on role
        navigate(`/${form.role.toLowerCase()}`);
      } else {
        setError("Invalid server response.");
      }
    } catch (err) {
      console.error("❌ Login error:", err);
      setError(err.response?.data?.message || "Login failed. Try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mt-5">
      <div className="row justify-content-center">
        <div className="col-md-5">
          <div className="card shadow p-4 rounded-4">
            <h3 className="text-center mb-4 fw-bold">Login</h3>

            <form onSubmit={handleSubmit}>
              {/* Email Field */}
              <div className="mb-3">
                <label className="form-label fw-semibold">Email</label>
                <input
                  type="email"
                  name="email"
                  className="form-control"
                  placeholder="Enter your email"
                  value={form.email}
                  onChange={handleChange}
                  required
                />
              </div>

              {/* Password Field */}
              <div className="mb-3">
                <label className="form-label fw-semibold">Password</label>
                <input
                  type="password"
                  name="password"
                  className="form-control"
                  placeholder="Enter your password"
                  value={form.password}
                  onChange={handleChange}
                  required
                />
              </div>

              {/* Role Dropdown */}
              <div className="mb-3">
                <label className="form-label fw-semibold">Select Role</label>
                <select
                  name="role"
                  className="form-control"
                  value={form.role}
                  onChange={handleChange}
                  required
                >
                  <option value="">-- Choose Role --</option>
                  <option value="student">Student</option>
                  <option value="lecturer">Lecturer</option>
                  <option value="pl">Program Leader</option>
                  <option value="prl">Principal Lecturer</option>
                </select>
              </div>

              {/* Login Button */}
              <button
                type="submit"
                className="btn btn-success w-100"
                disabled={loading}
              >
                {loading ? "Logging in..." : "Login"}
              </button>

              {/* Error Message */}
              {error && <p className="text-danger mt-3">{error}</p>}

              {/* Registration Link */}
              <div className="text-center mt-4">
                <p>Don't have an account?</p>
                <Link to="/register" className="btn btn-outline-primary w-100">
                  Go to Registration
                </Link>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
