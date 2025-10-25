import React, { useState, useEffect } from "react";
import axios from "axios";

const API_BASE_URL = "http://localhost:5000/api";

const PLCourses = () => {
  const [courses, setCourses] = useState([]);
  const [lecturers, setLecturers] = useState([]);
  const [form, setForm] = useState({
    course_name: "",
    course_code: "",
    lecturer_id: "",
  });
  const [editingCourse, setEditingCourse] = useState(null);
  const [loading, setLoading] = useState(false);

  // ============================
  // 🔹 Fetch all courses
  // ============================
  const fetchCourses = async () => {
    try {
      const res = await axios.get(`${API_BASE_URL}/courses`);
      setCourses(res.data);
    } catch (error) {
      console.error("❌ Error fetching courses:", error);
      alert("Failed to fetch courses. Check backend connection.");
    }
  };

  // ============================
  // 🔹 Fetch all lecturers
  // ============================
  const fetchLecturers = async () => {
    try {
      const res = await axios.get(`${API_BASE_URL}/lecturers`);
      setLecturers(res.data);
    } catch (error) {
      console.error("❌ Error fetching lecturers:", error);
      alert("Failed to fetch lecturers. Check backend connection.");
    }
  };

  useEffect(() => {
    fetchCourses();
    fetchLecturers();
  }, []);

  // ============================
  // 🔹 Handle input change
  // ============================
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // ============================
  // 🔹 Add or update course
  // ============================
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!form.course_name || !form.course_code || !form.lecturer_id) {
      alert("⚠️ Please fill in all fields before submitting.");
      return;
    }

    setLoading(true);
    try {
      if (editingCourse) {
        // UPDATE existing course
        const res = await axios.put(
          `${API_BASE_URL}/courses/${editingCourse.course_id}`,
          form
        );

        // Instant update in UI
        setCourses((prev) =>
          prev.map((c) =>
            c.course_id === editingCourse.course_id
              ? res.data.updatedCourse
              : c
          )
        );

        alert("✅ Course updated successfully!");
      } else {
        // ADD new course (now returns newCourse with lecturer_name)
        const res = await axios.post(`${API_BASE_URL}/courses`, form);
        setCourses((prev) => [res.data.newCourse, ...prev]);
        alert("✅ Course assigned successfully!");
      }

      // Reset form and editing state
      setForm({ course_name: "", course_code: "", lecturer_id: "" });
      setEditingCourse(null);
    } catch (error) {
      console.error("❌ Error saving course:", error);
      alert("❌ Failed to save course. Check console for details.");
    } finally {
      setLoading(false);
    }
  };

  // ============================
  // 🔹 Edit course
  // ============================
  const handleEdit = (course) => {
    setEditingCourse(course);
    setForm({
      course_name: course.course_name,
      course_code: course.course_code,
      lecturer_id: course.lecturer_id || "",
    });
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // ============================
  // 🔹 Cancel edit
  // ============================
  const handleCancelEdit = () => {
    setEditingCourse(null);
    setForm({ course_name: "", course_code: "", lecturer_id: "" });
  };

  // ============================
  // 🔹 Delete course
  // ============================
  const handleDelete = async (course_id) => {
    if (window.confirm("🗑️ Are you sure you want to delete this course?")) {
      try {
        await axios.delete(`${API_BASE_URL}/courses/${course_id}`);
        setCourses(courses.filter((c) => c.course_id !== course_id));
        alert("✅ Course deleted successfully!");
      } catch (error) {
        console.error("❌ Error deleting course:", error);
        alert("Failed to delete course. Check console for details.");
      }
    }
  };

  return (
    <div className="container mt-4">
      <h2 className="mb-4 text-center">📘 Programme Leader - Manage Courses</h2>

      {/* Add / Edit Course Form */}
      <div className="card p-3 shadow-sm mb-4">
        <h5 className="mb-3">
          {editingCourse ? "✏️ Edit Course Assignment" : "➕ Assign Course to Lecturer"}
        </h5>

        {editingCourse && (
          <div className="alert alert-info">
            Editing <strong>{editingCourse.course_name}</strong> — make changes and click
            <b> “Update Course”</b>.
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label>Course Name</label>
            <input
              type="text"
              name="course_name"
              className="form-control"
              value={form.course_name}
              onChange={handleChange}
              placeholder="Enter course name"
              required
            />
          </div>

          <div className="mb-3">
            <label>Course Code</label>
            <input
              type="text"
              name="course_code"
              className="form-control"
              value={form.course_code}
              onChange={handleChange}
              placeholder="Enter course code"
              required
            />
          </div>

          <div className="mb-3">
            <label>Assign Lecturer</label>
            <select
              name="lecturer_id"
              className="form-select"
              value={form.lecturer_id}
              onChange={handleChange}
              required
            >
              <option value="">-- Select Lecturer --</option>
              {lecturers.map((lec) => (
                <option key={lec.lecturer_id} value={lec.lecturer_id}>
                  {lec.lecturer_name}
                </option>
              ))}
            </select>
          </div>

          <button type="submit" className="btn btn-success" disabled={loading}>
            {loading
              ? "Saving..."
              : editingCourse
              ? "Update Course"
              : "Assign Course"}
          </button>

          {editingCourse && (
            <button
              type="button"
              className="btn btn-secondary ms-2"
              onClick={handleCancelEdit}
            >
              Cancel Edit
            </button>
          )}
        </form>
      </div>

      {/* Courses Table */}
      <div className="card shadow-sm p-3">
        <h5 className="mb-3">📋 Assigned Courses</h5>
        <table className="table table-hover table-bordered">
          <thead className="table-dark">
            <tr>
              <th>ID</th>
              <th>Course Name</th>
              <th>Course Code</th>
              <th>Lecturer</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {courses.length > 0 ? (
              courses.map((course) => (
                <tr key={course.course_id}>
                  <td>{course.course_id}</td>
                  <td>{course.course_name}</td>
                  <td>{course.course_code}</td>
                  <td>{course.lecturer_name || "Unassigned"}</td>
                  <td>
                    <button
                      className="btn btn-sm btn-warning me-2"
                      onClick={() => handleEdit(course)}
                    >
                      ✏️ Edit
                    </button>
                    <button
                      className="btn btn-sm btn-danger"
                      onClick={() => handleDelete(course.course_id)}
                    >
                      🗑️ Delete
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="5" className="text-center text-muted">
                  No courses assigned yet.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default PLCourses;
