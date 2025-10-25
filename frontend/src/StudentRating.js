import React, { useState, useEffect } from "react";
import axios from "axios";

const API_BASE_URL = "http://localhost:5000/api/ratings"; // ✅ matches backend route

const StudentRating = () => {
  const [lecturers, setLecturers] = useState([]);
  const [formData, setFormData] = useState({
    student_id: "",
    lecturer_id: "",
    rating: 0,
    feedback: "",
  });
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  // 🔹 Load lecturers + set student_id
  useEffect(() => {
    const fetchLecturers = async () => {
      try {
        const res = await axios.get(`${API_BASE_URL}/lecturers`);
        setLecturers(res.data);
      } catch (err) {
        console.error("Error fetching lecturers:", err);
      }
    };

    fetchLecturers();

    setFormData((prev) => ({
      ...prev,
      student_id: localStorage.getItem("userId") || "",
    }));
  }, []);

  // 🔹 Input change
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  // 🔹 Submit rating
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    try {
      const res = await axios.post(`${API_BASE_URL}/rate/lecturer`, formData);
      setMessage("✅ " + res.data.message);

      setFormData((prev) => ({
        ...prev,
        lecturer_id: "",
        rating: 0,
        feedback: "",
      }));
    } catch (err) {
      console.error("❌ Full error response:", err);
      alert(
        "Backend error:\n" +
          JSON.stringify(err.response?.data || err.message, null, 2)
      );
      setMessage(
        `❌ ${err.response?.data?.error || "Failed to submit rating."}`
      );
    } finally {
      // ✅ proper finally block
      setLoading(false);
    }
  };

  return (
    <div className="container mt-4">
      <h2 className="text-center mb-4">⭐ Rate a Lecturer</h2>

      {message && (
        <div className="alert alert-info text-center">{message}</div>
      )}

      <form
        onSubmit={handleSubmit}
        className="p-4 shadow rounded bg-light"
        style={{ maxWidth: "600px", margin: "auto" }}
      >
        <div className="mb-3">
          <label>Student ID</label>
          <input
            type="text"
            className="form-control"
            name="student_id"
            value={formData.student_id}
            disabled
          />
        </div>

        <div className="mb-3">
          <label>Select Lecturer</label>
          <select
            className="form-select"
            name="lecturer_id"
            value={formData.lecturer_id}
            onChange={handleChange}
            required
          >
            <option value="">-- Choose Lecturer --</option>
            {lecturers.map((lect) => (
              <option key={lect.lecturer_id} value={lect.lecturer_id}>
                {lect.name}
              </option>
            ))}
          </select>
        </div>

        <div className="mb-3">
          <label>Rating (1–5)</label>
          <select
            className="form-select"
            name="rating"
            value={formData.rating}
            onChange={handleChange}
            required
          >
            <option value="0">-- Select Rating --</option>
            {[1, 2, 3, 4, 5].map((num) => (
              <option key={num} value={num}>
                {num} {num === 1 ? "Star" : "Stars"}
              </option>
            ))}
          </select>
        </div>

        <div className="mb-3">
          <label>Feedback</label>
          <textarea
            className="form-control"
            name="feedback"
            value={formData.feedback}
            onChange={handleChange}
            rows="3"
          />
        </div>

        <button
          type="submit"
          className="btn btn-primary w-100"
          disabled={loading || !formData.lecturer_id || formData.rating === 0}
        >
          {loading ? "Submitting..." : "Submit Rating"}
        </button>
      </form>
    </div>
  );
};

export default StudentRating;
