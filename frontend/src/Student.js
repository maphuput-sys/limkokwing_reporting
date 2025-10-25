import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "./App.css";
import StudentMonitoring from "./StudentMonitoring";

const API_BASE_URL = "https://limkokwing-reporting3.onrender.com/api";

const Student = () => {
  const navigate = useNavigate();
  const [activeSection, setActiveSection] = useState("monitoring");
  const [ratings, setRatings] = useState([]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const student_id = parseInt(localStorage.getItem("student_id") || "1");

  // 🔹 Fetch courses & lecturers assigned to this student
  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const res = await axios.get(`${API_BASE_URL}/students/${student_id}/courses`);
        // Expecting: [{ course_id, course_name, lecturer_id, lecturer_name }]
        const mapped = res.data.map((c) => ({
          course_id: c.course_id,
          course: c.course_name,
          lecturer_id: c.lecturer_id,
          lecturer: c.lecturer_name,
          rating: 0,
          feedback: "",
        }));
        setRatings(mapped);
      } catch (err) {
        console.error("Failed to fetch courses:", err.response || err);
        setMessage("❌ Failed to load courses.");
      }
    };

    fetchCourses();
  }, [student_id]);

  // 🔹 Handle rating change
  const handleRatingChange = (index, value) => {
    const updated = [...ratings];
    updated[index].rating = parseInt(value, 10);
    setRatings(updated);
  };

  // 🔹 Handle feedback change
  const handleFeedbackChange = (index, value) => {
    const updated = [...ratings];
    updated[index].feedback = value;
    setRatings(updated);
  };

  // 🔹 Submit ratings
  const submitRatings = async () => {
    setLoading(true);
    setMessage("");
    try {
      for (const r of ratings) {
        // Only send the fields your backend expects
        await axios.post(`${API_BASE_URL}/ratings/rate/lecturer`, {
          student_id,
          lecturer_id: r.lecturer_id,
          rating: r.rating,
          feedback: r.feedback || `Feedback for ${r.lecturer}`,
        });
      }

      setMessage("✅ Ratings submitted successfully!");
      // Reset ratings
      setRatings((prev) =>
        prev.map((r) => ({ ...r, rating: 0, feedback: "" }))
      );
    } catch (err) {
      console.error("Error submitting ratings:", err.response || err);
      setMessage(
        `❌ Failed to submit ratings: ${err.response?.data?.error || err.message}`
      );
    } finally {
      setLoading(false);
    }
  };

  // 🔹 Register Out
  const handleRegisterOut = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("student_id");
    localStorage.removeItem("student_name");
    navigate("/register");
  };

  return (
    <div className="dashboard-wrapper">
      {/* Sidebar Menu */}
      <nav className="sidebar">
        <h2>Student Menu</h2>
        <ul>
          <li
            className={activeSection === "monitoring" ? "active" : ""}
            onClick={() => setActiveSection("monitoring")}
          >
            Monitoring
          </li>
          <li
            className={activeSection === "rating" ? "active" : ""}
            onClick={() => setActiveSection("rating")}
          >
            Rating
          </li>
          <li className="logout" onClick={handleRegisterOut}>
            📝 Register Out
          </li>
        </ul>
      </nav>

      {/* Main Content */}
      <div className="dashboard-container">
        <h2>🎓 Student Dashboard</h2>

        {activeSection === "monitoring" && (
          <section className="dashboard-section">
            <StudentMonitoring />
          </section>
        )}

        {activeSection === "rating" && (
          <section className="dashboard-section">
            <h3>Rate Your Classes & Lecturers</h3>

            {message && <div className="alert">{message}</div>}

            {ratings.length === 0 && <p>Loading courses...</p>}

            {ratings.map((item, index) => (
              <div key={index} className="rating-card">
                <h4>{item.course}</h4>
                <p>
                  <strong>Lecturer:</strong> {item.lecturer}
                </p>

                <label>Rating:</label>
                <select
                  value={item.rating}
                  onChange={(e) => handleRatingChange(index, e.target.value)}
                >
                  <option value={0}>-- Select Rating --</option>
                  {[1, 2, 3, 4, 5].map((num) => (
                    <option key={num} value={num}>
                      {num} {num === 1 ? "Star" : "Stars"}
                    </option>
                  ))}
                </select>

                <label>Feedback:</label>
                <textarea
                  value={item.feedback}
                  onChange={(e) => handleFeedbackChange(index, e.target.value)}
                  placeholder="Write your comments..."
                />

                <hr />
              </div>
            ))}

            <button
              className="submit-btn"
              onClick={submitRatings}
              disabled={loading || ratings.length === 0}
            >
              {loading ? "Submitting..." : "Submit Ratings"}
            </button>
          </section>
        )}
      </div>
    </div>
  );
};

export default Student;
