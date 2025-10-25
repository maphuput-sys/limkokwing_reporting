import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "./App.css";

const API_BASE_URL = "https://limkokwing-reporting3.onrender.com/api";

const PL = () => {
  const [activeSection, setActiveSection] = useState("courses");
  const [courses, setCourses] = useState([]);
  const [classes, setClasses] = useState([]);

  const [formData, setFormData] = useState({
    course_name: "",
    course_code: "",
    lecturer_name: "",
  });

  const [classForm, setClassForm] = useState({
    id: null,
    class_name: "",
    course: "",
    lecturer: "",
    venue: "",
  });

  const navigate = useNavigate();

  /* -------------------------------
     ✅ Fetch Courses and Classes
  --------------------------------*/
  const fetchCourses = async () => {
    try {
      const res = await axios.get(`${API_BASE_URL}/courses`);
      setCourses(res.data);
    } catch (err) {
      console.error("Error fetching courses:", err);
    }
  };

  const fetchClasses = async () => {
    try {
      const res = await axios.get(`${API_BASE_URL}/classes`);
      setClasses(res.data);
    } catch (err) {
      console.error("Error fetching classes:", err);
    }
  };

  useEffect(() => {
    fetchCourses();
    fetchClasses();
  }, []);

  /* -------------------------------
     ✅ COURSE FUNCTIONS
  --------------------------------*/
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.course_name || !formData.course_code || !formData.lecturer_name) {
      alert("Please fill in all fields!");
      return;
    }

    try {
      await axios.post(`${API_BASE_URL}/courses`, formData);
      alert("✅ Course added successfully!");
      setFormData({
        course_name: "",
        course_code: "",
        lecturer_name: "",
      });
      fetchCourses();
    } catch (err) {
      console.error("Error adding course:", err);
      alert("❌ Failed to add course. Check console for details.");
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this course?")) {
      try {
        await axios.delete(`${API_BASE_URL}/courses/${id}`);
        alert("🗑️ Course deleted successfully!");
        fetchCourses();
      } catch (err) {
        console.error("Error deleting course:", err);
      }
    }
  };

  /* -------------------------------
     ✅ CLASS FUNCTIONS
  --------------------------------*/
  const handleClassChange = (e) => {
    const { name, value } = e.target;
    setClassForm({
      ...classForm,
      [name]: value,
    });
  };

  const handleAddOrUpdateClass = async (e) => {
    e.preventDefault();

    try {
      if (classForm.id) {
        // Update
        await axios.put(`${API_BASE_URL}/classes/${classForm.id}`, classForm);
        alert("✏️ Class updated successfully!");
      } else {
        // Add
        await axios.post(`${API_BASE_URL}/classes`, classForm);
        alert("✅ Class added successfully!");
      }

      setClassForm({ id: null, class_name: "", course: "", lecturer: "", venue: "" });
      fetchClasses();
    } catch (err) {
      console.error("Error adding/updating class:", err);
      alert("❌ Failed to save class.");
    }
  };

  const handleEditClass = (cls) => {
    setClassForm(cls);
  };

  const handleDeleteClass = async (id) => {
    if (window.confirm("Delete this class?")) {
      try {
        await axios.delete(`${API_BASE_URL}/classes/${id}`);
        alert("🗑️ Class deleted!");
        fetchClasses();
      } catch (err) {
        console.error("Error deleting class:", err);
      }
    }
  };

  /* -------------------------------
     ✅ LOGOUT
  --------------------------------*/
  const handleLogout = () => {
    localStorage.removeItem("user");
    navigate("/register");
  };

  /* -------------------------------
     ✅ UI RENDERING
  --------------------------------*/
  return (
    <div className="dashboard-wrapper">
      {/* Sidebar */}
      <nav className="sidebar">
        <h2>Program Leader</h2>
        <ul>
          <li
            className={activeSection === "courses" ? "active" : ""}
            onClick={() => setActiveSection("courses")}
          >
            Courses
          </li>
          <li
            className={activeSection === "lecturers" ? "active" : ""}
            onClick={() => setActiveSection("lecturers")}
          >
            Lecturers
          </li>
          <li
            className={activeSection === "classes" ? "active" : ""}
            onClick={() => setActiveSection("classes")}
          >
            Classes
          </li>
          <li
            className={activeSection === "reports" ? "active" : ""}
            onClick={() => setActiveSection("reports")}
          >
            Reports
          </li>
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
        </ul>

        <button className="btn btn-danger mt-4 w-100" onClick={handleLogout}>
          Log Out
        </button>
      </nav>

      {/* Main Content */}
      <div className="dashboard-container">
        <h2 className="text-center mb-4">Program Leader Dashboard</h2>

        {/* -------------------------------
             ✅ COURSES SECTION
        --------------------------------*/}
        {activeSection === "courses" && (
          <section>
            <h3>Manage Courses</h3>
            <p>Add new courses and assign them to lecturers below.</p>

            <div className="card p-3 mt-3">
              <form onSubmit={handleSubmit}>
                <div className="mb-3">
                  <label>Course Name</label>
                  <input
                    type="text"
                    className="form-control"
                    name="course_name"
                    placeholder="Enter course name"
                    value={formData.course_name}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="mb-3">
                  <label>Course Code</label>
                  <input
                    type="text"
                    className="form-control"
                    name="course_code"
                    placeholder="Enter course code"
                    value={formData.course_code}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="mb-3">
                  <label>Assign Lecturer</label>
                  <input
                    type="text"
                    className="form-control"
                    name="lecturer_name"
                    placeholder="Enter lecturer name"
                    value={formData.lecturer_name}
                    onChange={handleChange}
                    required
                  />
                </div>

                <button type="submit" className="btn btn-success">
                  Add Course
                </button>
              </form>
            </div>

            <div className="mt-4">
              <h4>All Courses</h4>
              {courses.length === 0 ? (
                <p>No courses added yet.</p>
              ) : (
                <table className="table table-bordered mt-3">
                  <thead>
                    <tr>
                      <th>ID</th>
                      <th>Course Name</th>
                      <th>Course Code</th>
                      <th>Lecturer</th>
                      <th>Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {courses.map((course) => (
                      <tr key={course.course_id}>
                        <td>{course.course_id}</td>
                        <td>{course.course_name}</td>
                        <td>{course.course_code}</td>
                        <td>{course.lecturer_name || "Unassigned"}</td>
                        <td>
                          <button
                            className="btn btn-danger btn-sm"
                            onClick={() => handleDelete(course.course_id)}
                          >
                            Delete
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          </section>
        )}

        {/* -------------------------------
             ✅ LECTURERS SECTION
        --------------------------------*/}
        {activeSection === "lecturers" && (
          <section>
            <h3>Lecturers Overview</h3>
            <p>List of lecturers and their assigned courses.</p>
            <table className="table table-striped mt-3">
              <thead>
                <tr>
                  <th>Lecturer</th>
                  <th>Assigned Courses</th>
                </tr>
              </thead>
              <tbody>
                {courses.map((c, i) => (
                  <tr key={i}>
                    <td>{c.lecturer_name}</td>
                    <td>{c.course_name}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </section>
        )}

        {/* -------------------------------
             ✅ CLASSES SECTION
        --------------------------------*/}
        {activeSection === "classes" && (
          <section>
            <h3>Manage Classes</h3>
            <p>Assign new classes and manage existing ones.</p>

            <div className="card p-3 mt-3">
              <form onSubmit={handleAddOrUpdateClass}>
                <div className="row g-2">
                  <div className="col-md-3">
                    <input
                      type="text"
                      name="class_name"
                      className="form-control"
                      placeholder="Class Name"
                      value={classForm.class_name}
                      onChange={handleClassChange}
                      required
                    />
                  </div>
                  <div className="col-md-3">
                    <input
                      type="text"
                      name="course"
                      className="form-control"
                      placeholder="Course"
                      value={classForm.course}
                      onChange={handleClassChange}
                      required
                    />
                  </div>
                  <div className="col-md-3">
                    <input
                      type="text"
                      name="lecturer"
                      className="form-control"
                      placeholder="Lecturer"
                      value={classForm.lecturer}
                      onChange={handleClassChange}
                      required
                    />
                  </div>
                  <div className="col-md-3">
                    <input
                      type="text"
                      name="venue"
                      className="form-control"
                      placeholder="Venue"
                      value={classForm.venue}
                      onChange={handleClassChange}
                      required
                    />
                  </div>
                </div>

                <button type="submit" className="btn btn-success mt-3">
                  {classForm.id ? "Update Class" : "Add Class"}
                </button>
              </form>
            </div>

            <div className="mt-4">
              <h4>All Classes</h4>
              {classes.length === 0 ? (
                <p>No classes added yet.</p>
              ) : (
                <table className="table table-bordered mt-3">
                  <thead>
                    <tr>
                      <th>ID</th>
                      <th>Class Name</th>
                      <th>Course</th>
                      <th>Lecturer</th>
                      <th>Venue</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {classes.map((cls) => (
                      <tr key={cls.id}>
                        <td>{cls.id}</td>
                        <td>{cls.class_name}</td>
                        <td>{cls.course}</td>
                        <td>{cls.lecturer}</td>
                        <td>{cls.venue}</td>
                        <td>
                          <button
                            className="btn btn-warning btn-sm me-2"
                            onClick={() => handleEditClass(cls)}
                          >
                            Edit
                          </button>
                          <button
                            className="btn btn-danger btn-sm"
                            onClick={() => handleDeleteClass(cls.id)}
                          >
                            Delete
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          </section>
        )}

        {/* -------------------------------
             ✅ REPORTS SECTION
        --------------------------------*/}
        {activeSection === "reports" && (
          <section>
            <h3>Reports</h3>
            <p>View reports submitted by lecturers and PRL.</p>
            <table className="table table-striped mt-3">
              <thead>
                <tr>
                  <th>Report ID</th>
                  <th>Lecturer</th>
                  <th>Course</th>
                  <th>Week</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>RPT-001</td>
                  <td>Dr. Maphupu</td>
                  <td>Software Engineering</td>
                  <td>Week 5</td>
                  <td>Reviewed</td>
                </tr>
                <tr>
                  <td>RPT-002</td>
                  <td>Mrs. Ts’along</td>
                  <td>Multimedia</td>
                  <td>Week 4</td>
                  <td>Pending</td>
                </tr>
              </tbody>
            </table>
          </section>
        )}

        {/* -------------------------------
             ✅ MONITORING SECTION
        --------------------------------*/}
        {activeSection === "monitoring" && (
          <section>
            <h3>Monitoring</h3>
            <p>Track lecturer performance and student engagement.</p>
            <div className="card p-3 mt-3">
              <ul>
                <li>Dr. Maphupu - 90% Attendance</li>
                <li>Mrs. Ts’along - 85% Engagement</li>
                <li>Mr. Mokoena - 88% Attendance</li>
              </ul>
            </div>
          </section>
        )}

        {/* -------------------------------
             ✅ RATING SECTION
        --------------------------------*/}
        {activeSection === "rating" && (
          <section>
            <h3>Lecturer Ratings</h3>
            <p>View or update ratings for lecturers and courses.</p>
            <table className="table table-bordered mt-3">
              <thead>
                <tr>
                  <th>Lecturer</th>
                  <th>Course</th>
                  <th>Rating</th>
                  <th>Remarks</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>Dr. Maphupu</td>
                  <td>Software Engineering</td>
                  <td>Excellent</td>
                  <td>Highly engaging lessons.</td>
                </tr>
                <tr>
                  <td>Mrs. Ts’along</td>
                  <td>Multimedia</td>
                  <td>Good</td>
                  <td>Needs better time management.</td>
                </tr>
              </tbody>
            </table>
          </section>
        )}
      </div>
    </div>
  );
};

export default PL;
