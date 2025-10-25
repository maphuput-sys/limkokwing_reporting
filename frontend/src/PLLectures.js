import React, { useState, useEffect } from "react";
import axios from "axios";

const API_BASE_URL = "https://limkokwing-reporting3.onrender.com/api";

const PLLectures = () => {
  const [lectures, setLectures] = useState([]);
  const [courses, setCourses] = useState([]);
  const [form, setForm] = useState({
    course_id: "",
    date: "",
    topic: "",
    time: "",
  });
  const [editingLecture, setEditingLecture] = useState(null);
  const [loading, setLoading] = useState(false);

  // Fetch lectures
  const fetchLectures = async () => {
    try {
      const res = await axios.get(`${API_BASE_URL}/lectures`);
      setLectures(res.data);
    } catch (error) {
      console.error("Error fetching lectures:", error);
    }
  };

  // Fetch courses
  const fetchCourses = async () => {
    try {
      const res = await axios.get(`${API_BASE_URL}/courses`);
      setCourses(res.data);
    } catch (error) {
      console.error("Error fetching courses:", error);
    }
  };

  useEffect(() => {
    fetchLectures();
    fetchCourses();
  }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // Add or update lecture
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.course_id || !form.date || !form.topic || !form.time) {
      alert("Please fill in all fields.");
      return;
    }

    setLoading(true);
    try {
      if (editingLecture) {
        await axios.put(`${API_BASE_URL}/lectures/${editingLecture.lecture_id}`, form);
        alert("✅ Lecture updated successfully!");
        setEditingLecture(null);
      } else {
        await axios.post(`${API_BASE_URL}/lectures`, form);
        alert("✅ Lecture added successfully!");
      }
      setForm({ course_id: "", date: "", topic: "", time: "" });
      fetchLectures();
    } catch (error) {
      console.error("Error saving lecture:", error);
      alert("❌ Failed to save lecture.");
    } finally {
      setLoading(false);
    }
  };

  // Edit lecture
  const handleEdit = (lecture) => {
    setEditingLecture(lecture);
    setForm({
      course_id: lecture.course_id,
      date: lecture.date,
      topic: lecture.topic,
      time: lecture.time,
    });
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // Cancel edit
  const handleCancelEdit = () => {
    setEditingLecture(null);
    setForm({ course_id: "", date: "", topic: "", time: "" });
  };

  // Delete lecture
  const handleDelete = async (lecture_id) => {
    if (window.confirm("Are you sure you want to delete this lecture?")) {
      try {
        await axios.delete(`${API_BASE_URL}/lectures/${lecture_id}`);
        alert("🗑️ Lecture deleted successfully!");
        fetchLectures();
      } catch (error) {
        console.error("Error deleting lecture:", error);
        alert("❌ Failed to delete lecture.");
      }
    }
  };

  return (
    <div className="container mt-4">
      <h2 className="mb-4 text-center">📚 Scheduled Lectures</h2>

      {/* Add / Edit Lecture Form */}
      <div className="card p-3 shadow-sm mb-4">
        <h5 className="mb-3">{editingLecture ? "✏️ Edit Lecture" : "➕ Add New Lecture"}</h5>
        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label>Course</label>
            <select
              name="course_id"
              className="form-select"
              value={form.course_id}
              onChange={handleChange}
              required
            >
              <option value="">-- Select Course --</option>
              {courses.map((course) => (
                <option key={course.course_id} value={course.course_id}>
                  {course.course_name} ({course.lecturer_name || "No Lecturer"})
                </option>
              ))}
            </select>
          </div>

          <div className="mb-3">
            <label>Date</label>
            <input
              type="date"
              name="date"
              className="form-control"
              value={form.date}
              onChange={handleChange}
              required
            />
          </div>

          <div className="mb-3">
            <label>Topic</label>
            <input
              type="text"
              name="topic"
              className="form-control"
              value={form.topic}
              onChange={handleChange}
              placeholder="Enter topic"
              required
            />
          </div>

          <div className="mb-3">
            <label>Time</label>
            <input
              type="text"
              name="time"
              className="form-control"
              value={form.time}
              onChange={handleChange}
              placeholder="e.g., 09:00-11:00"
              required
            />
          </div>

          <button type="submit" className="btn btn-success" disabled={loading}>
            {loading ? "Saving..." : editingLecture ? "Update Lecture" : "Add Lecture"}
          </button>
          {editingLecture && (
            <button type="button" className="btn btn-secondary ms-2" onClick={handleCancelEdit}>
              Cancel Edit
            </button>
          )}
        </form>
      </div>

      {/* Lectures Table */}
      <div className="card shadow-sm p-3">
        <h5 className="mb-3">📋 All Lectures</h5>
        <table className="table table-hover table-bordered">
          <thead className="table-dark">
            <tr>
              <th>Course</th>
              <th>Lecturer</th>
              <th>Date</th>
              <th>Topic</th>
              <th>Time</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {lectures.length > 0 ? (
              lectures.map((lecture) => (
                <tr key={lecture.lecture_id}>
                  <td>{lecture.course_name}</td>
                  <td>{lecture.lecturer_name || "Not Assigned"}</td>
                  <td>{lecture.date}</td>
                  <td>{lecture.topic}</td>
                  <td>{lecture.time}</td>
                  <td>
                    <button
                      className="btn btn-sm btn-warning me-2"
                      onClick={() => handleEdit(lecture)}
                    >
                      Edit
                    </button>
                    <button
                      className="btn btn-sm btn-danger"
                      onClick={() => handleDelete(lecture.lecture_id)}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="6" className="text-center text-muted">
                  No lectures scheduled yet.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default PLLectures;
