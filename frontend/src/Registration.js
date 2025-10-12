import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import API_BASE_URL from "./config";
import "bootstrap/dist/css/bootstrap.min.css";

const Registration = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    role: "student",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await axios.post(`${API_BASE_URL}/api/register`, form, {
        headers: { "Content-Type": "application/json" },
      });

      // Save role and token in localStorage
      localStorage.setItem("token", res.data.token);
      localStorage.setItem("role", form.role);
      localStorage.setItem("userId", res.data.user.id);

      // Redirect to role-specific dashboard
      navigate(`/${form.role}`);
    } catch (err) {
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
              <input type="text" name="name" className="form-control mb-3" placeholder="Full Name" value={form.name} onChange={handleChange} required />
              <input type="email" name="email" className="form-control mb-3" placeholder="Email" value={form.email} onChange={handleChange} required />
              <input type="password" name="password" className="form-control mb-3" placeholder="Password" value={form.password} onChange={handleChange} required />
              <select name="role" className="form-select mb-3" value={form.role} onChange={handleChange}>
                <option value="student">Student</option>
                <option value="lecturer">Lecturer</option>
                <option value="prl">Principal Lecturer</option>
                <option value="pl">Program Leader</option>
              </select>
              <button type="submit" className="btn btn-primary w-100" disabled={loading}>
                {loading ? "Registering..." : "Register"}
              </button>
              {error && <p className="text-danger mt-3">{error}</p>}
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Registration;
