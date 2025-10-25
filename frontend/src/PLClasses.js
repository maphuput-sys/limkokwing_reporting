import React, { useState, useEffect } from "react";
import axios from "axios";

const API_BASE_URL = "https://limkokwing-reporting3.onrender.com/api/classes";

const PLClasses = () => {
  const [classesData, setClassesData] = useState([]);
  const [form, setForm] = useState({
    id: null,
    class_name: "",
    course: "",
    lecturer: "",
    venue: "",
  });
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);

  /* ========================================================
     🔹 Fetch Classes
  ======================================================== */
  const fetchClasses = async () => {
    try {
      setLoading(true);
      const res = await axios.get(API_BASE_URL);
      setClassesData(res.data);
    } catch (err) {
      console.error("❌ Error fetching classes:", err);
      alert("Failed to load classes. Check console for details.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchClasses();
  }, []);

  /* ========================================================
     🔹 Handle form input
  ======================================================== */
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  /* ========================================================
     🔹 Add (Assign) Class
  ======================================================== */
  const handleAdd = async () => {
    if (!form.class_name || !form.course || !form.lecturer || !form.venue) {
      alert("Please fill in all fields.");
      return;
    }

    try {
      const res = await axios.post(API_BASE_URL, form);
      setClassesData([res.data, ...classesData]);
      setForm({ id: null, class_name: "", course: "", lecturer: "", venue: "" });
      alert("✅ Class assigned successfully!");
    } catch (err) {
      console.error("❌ Failed to add class:", err);
      alert(err.response?.data?.message || "Failed to add class.");
    }
  };

  /* ========================================================
     🔹 Edit Class
  ======================================================== */
  const handleEdit = (cls) => {
    setForm({
      id: cls.id,
      class_name: cls.class_name,
      course: cls.course,
      lecturer: cls.lecturer,
      venue: cls.venue,
    });
    setIsEditing(true);
  };

  /* ========================================================
     🔹 Update Class
  ======================================================== */
  const handleUpdate = async () => {
    try {
      const res = await axios.put(`${API_BASE_URL}/${form.id}`, form);
      setClassesData(
        classesData.map((c) => (c.id === form.id ? res.data : c))
      );
      setIsEditing(false);
      setForm({ id: null, class_name: "", course: "", lecturer: "", venue: "" });
      alert("✅ Class updated successfully!");
    } catch (err) {
      console.error("❌ Failed to update class:", err);
      alert(err.response?.data?.message || "Update failed.");
    }
  };

  /* ========================================================
     🔹 Delete Class
  ======================================================== */
  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this class?")) return;
    try {
      await axios.delete(`${API_BASE_URL}/${id}`);
      setClassesData(classesData.filter((c) => c.id !== id));
      alert("🗑️ Class deleted successfully!");
    } catch (err) {
      console.error("❌ Failed to delete class:", err);
      alert(err.response?.data?.message || "Delete failed.");
    }
  };

  /* ========================================================
     🔹 Cancel Edit
  ======================================================== */
  const handleCancel = () => {
    setIsEditing(false);
    setForm({ id: null, class_name: "", course: "", lecturer: "", venue: "" });
  };

  return (
    <div className="container mt-4">
      <h2 className="mb-4 text-center">📚 Program Leader Class Management</h2>

      {/* Form Card */}
      <div className="card p-3 shadow-sm mb-4">
        <h5>{isEditing ? "✏️ Edit Class" : "➕ Assign New Class"}</h5>

        <div className="row g-2">
          <div className="col-md-3">
            <input
              type="text"
              name="class_name"
              className="form-control"
              placeholder="Class Name"
              value={form.class_name}
              onChange={handleChange}
            />
          </div>
          <div className="col-md-3">
            <input
              type="text"
              name="course"
              className="form-control"
              placeholder="Course"
              value={form.course}
              onChange={handleChange}
            />
          </div>
          <div className="col-md-3">
            <input
              type="text"
              name="lecturer"
              className="form-control"
              placeholder="Lecturer"
              value={form.lecturer}
              onChange={handleChange}
            />
          </div>
          <div className="col-md-3">
            <input
              type="text"
              name="venue"
              className="form-control"
              placeholder="Venue"
              value={form.venue}
              onChange={handleChange}
            />
          </div>
        </div>

        <div className="mt-3 text-end">
          {isEditing ? (
            <>
              <button className="btn btn-success me-2" onClick={handleUpdate}>
                💾 Update
              </button>
              <button className="btn btn-secondary" onClick={handleCancel}>
                Cancel
              </button>
            </>
          ) : (
            <button className="btn btn-primary" onClick={handleAdd}>
              ➕ Assign Class
            </button>
          )}
        </div>
      </div>

      {/* Table Card */}
      <div className="card shadow-sm p-3">
        <h5 className="mb-3">📋 Assigned Classes</h5>
        {loading ? (
          <p className="text-center">Loading classes...</p>
        ) : (
          <table className="table table-striped table-bordered">
            <thead className="table-dark">
              <tr>
                <th>Class Name</th>
                <th>Course</th>
                <th>Lecturer</th>
                <th>Venue</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {classesData.length === 0 ? (
                <tr>
                  <td colSpan="5" className="text-center">
                    No classes assigned yet.
                  </td>
                </tr>
              ) : (
                classesData.map((cls) => (
                  <tr key={cls.id}>
                    <td>{cls.class_name}</td>
                    <td>{cls.course}</td>
                    <td>{cls.lecturer}</td>
                    <td>{cls.venue}</td>
                    <td>
                      <button
                        className="btn btn-warning btn-sm me-2"
                        onClick={() => handleEdit(cls)}
                      >
                        ✏️ Edit
                      </button>
                      <button
                        className="btn btn-danger btn-sm"
                        onClick={() => handleDelete(cls.id)}
                      >
                        🗑️ Delete
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default PLClasses;
