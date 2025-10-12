import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import API_BASE_URL from "./config";
import "bootstrap/dist/css/bootstrap.min.css";

const Login = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: "", password: "" });
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
      const res = await axios.post(`${API_BASE_URL}/api/login`, form, {
        headers: { "Content-Type": "application/json" },
      });

      console.log("✅ Login response:", res.data);

      if (res.data && res.data.token) {
        localStorage.setItem("token", res.data.token);
        localStorage.setItem("role", res.data.role);
        localStorage.setItem("userId", res.data.user?.id || "");
        navigate(`/${res.data.role}`);
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
          <div className="card shadow p-4">
            <h3 className="text-center mb-4">User Login</h3>
            <form onSubmit={handleSubmit}>
              <input
                type="email"
                name="email"
                className="form-control mb-3"
                placeholder="Email"
                value={form.email}
                onChange={handleChange}
                required
              />
              <input
                type="password"
                name="password"
                className="form-control mb-3"
                placeholder="Password"
                value={form.password}
                onChange={handleChange}
                required
              />
              <button
                type="submit"
                className="btn btn-success w-100"
                disabled={loading}
              >
                {loading ? "Logging in..." : "Login"}
              </button>
              {error && <p className="text-danger mt-3">{error}</p>}
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
