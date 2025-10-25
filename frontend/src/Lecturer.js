// Lecturer.js
import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "./App.css";

const API_BASE_URL = "http://localhost:5000/api";

const Lecturer = () => {
  const [activeSection, setActiveSection] = useState("courses");
  const [ratings, setRatings] = useState([]);
  const [reports, setReports] = useState([]);
  const [courses, setCourses] = useState([]);
  const [monitoringData, setMonitoringData] = useState([]);
  const [report, setReport] = useState({
    lecturer_id: "",
    course_name: "",
    course_code: "",
    faculty_name: "",
    class_name: "",
    week_of_reporting: "",
    date: "",
    lecturer_name: "",
    students_present: "",
    total_students: "",
    venue: "",
    lecture_time: "",
    topic_taught: "",
    learning_outcomes: "",
    recommendations: "",
    report_text: "",
  });
  const [message, setMessage] = useState("");

  const navigate = useNavigate();
  const token = localStorage.getItem("lecturerToken");
  const lecturerId = Number(localStorage.getItem("lecturer_id"));
  const lecturerName = localStorage.getItem("lecturerName");

  useEffect(() => {
    if (activeSection === "rating") fetchRatings();
    if (activeSection === "reports") fetchReports();
    if (activeSection === "courses") fetchAssignedCourses();
    if (activeSection === "monitoring") fetchMonitoringData();
    // eslint-disable-next-line
  }, [activeSection]);

  /* =========================================================
     🔹 Fetch courses assigned to this lecturer (FIXED)
  ========================================================= */
  const fetchAssignedCourses = async () => {
    try {
      if (!lecturerId) {
        console.warn("Lecturer ID missing — cannot fetch assigned courses.");
        setCourses([]);
        return;
      }

      const res = await axios.get(`${API_BASE_URL}/courses/lecturer`, {
        params: { lecturer_id: lecturerId }, // ✅ matches backend
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      });

      setCourses(res.data || []);
    } catch (err) {
      console.error("❌ Error fetching assigned courses:", err);
      setCourses([]);
    }
  };

  /* =========================================================
     🔹 Fetch ratings for this lecturer
  ========================================================= */
  const fetchRatings = async () => {
    try {
      if (!lecturerId) return setRatings([]);
      const res = await axios.get(`${API_BASE_URL}/ratings/lecturer/${lecturerId}`, {
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      });
      setRatings(res.data || []);
    } catch (err) {
      console.error("Error fetching ratings:", err);
      setRatings([]);
    }
  };

  /* =========================================================
     🔹 Fetch reports
  ========================================================= */
  const fetchReports = async () => {
    try {
      const res = await axios.get(`${API_BASE_URL}/reports`);
      setReports(res.data || []);
    } catch (err) {
      console.error("Error fetching reports:", err);
      setReports([]);
    }
  };

  /* =========================================================
     🔹 Fetch monitoring data
  ========================================================= */
  const fetchMonitoringData = async () => {
    try {
      const res = await axios.get(`${API_BASE_URL}/lecturer/${lecturerId}/monitoring`);
      setMonitoringData(res.data.length > 0 ? res.data : []);
    } catch (err) {
      console.warn("Monitoring data not available, using mock data.");
      setMonitoringData([
        { course_name: "Software Engineering", totalRegistered: 50, studentsPresent: 45, averageRating: 4.2 },
        { course_name: "Multimedia Design", totalRegistered: 40, studentsPresent: 37, averageRating: 4.7 },
      ]);
    }
  };

  /* =========================================================
     🔹 Handle input change for report
  ========================================================= */
  const handleReportChange = (e) => {
    const { name, value } = e.target;
    setReport((prev) => {
      const next = { ...prev, [name]: value };
      next.report_text = `${next.topic_taught || ""}${next.learning_outcomes ? " — " + next.learning_outcomes : ""}`.trim();
      return next;
    });
  };

  /* =========================================================
     🔹 Submit report
  ========================================================= */
  const handleReportSubmit = async (e) => {
    e.preventDefault();
    setMessage("");

    if (!report.course_name || !report.lecturer_name || !report.week_of_reporting) {
      setMessage("❌ Please enter course, lecturer name, and week of reporting.");
      return;
    }

    const payload = {
      lecturer_id: lecturerId || null,
      course_id: null,
      course_name: report.course_name,
      course_code: report.course_code,
      week_of_reporting: report.week_of_reporting,
      date: report.date,
      lecturer_name: report.lecturer_name,
      students_present: report.students_present ? Number(report.students_present) : null,
      total_students: report.total_students ? Number(report.total_students) : null,
      venue: report.venue,
      lecture_time: report.lecture_time,
      topic_taught: report.topic_taught,
      learning_outcomes: report.learning_outcomes,
      recommendations: report.recommendations,
      faculty_name: report.faculty_name,
      class_name: report.class_name,
      report_text: report.report_text,
    };

    try {
      const res = await axios.post(`${API_BASE_URL}/reports/add`, payload, {
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      });
      setMessage("✅ " + (res.data.message || "Report submitted successfully."));
      setReport({
        lecturer_id: "",
        course_name: "",
        course_code: "",
        faculty_name: "",
        class_name: "",
        week_of_reporting: "",
        date: "",
        lecturer_name: "",
        students_present: "",
        total_students: "",
        venue: "",
        lecture_time: "",
        topic_taught: "",
        learning_outcomes: "",
        recommendations: "",
        report_text: "",
      });
      fetchReports();
    } catch (err) {
      console.error("Error submitting report:", err);
      const errMsg = err?.response?.data?.error || err.message || "Failed to submit report.";
      setMessage("❌ " + errMsg);
    }
  };

  /* =========================================================
     🔹 Logout
  ========================================================= */
  const handleLogout = () => {
    localStorage.removeItem("lecturerToken");
    localStorage.removeItem("lecturerName");
    localStorage.removeItem("lecturer_id");
    alert("You have logged out successfully.");
    navigate("/register");
  };

  /* =========================================================
     🔹 UI Rendering
  ========================================================= */
  return (
    <div className="dashboard-wrapper">
      <nav className="sidebar">
        <h2>Lecturer Menu</h2>
        <ul>
          <li className={activeSection === "courses" ? "active" : ""} onClick={() => setActiveSection("courses")}>📚 Courses</li>
          <li className={activeSection === "reports" ? "active" : ""} onClick={() => setActiveSection("reports")}>📝 Reports</li>
          <li className={activeSection === "monitoring" ? "active" : ""} onClick={() => setActiveSection("monitoring")}>📊 Monitoring</li>
          <li className={activeSection === "rating" ? "active" : ""} onClick={() => setActiveSection("rating")}>⭐ Rating</li>
        </ul>
        <button onClick={handleLogout} className="logout-btn">🚪 Logout</button>
      </nav>

      <div className="dashboard-container">
        <h2>📘 Lecturer Dashboard</h2>

        {/* Courses Section */}
        {activeSection === "courses" && (
          <section className="dashboard-section">
            <h3>📚 My Assigned Courses</h3>
            <table className="table table-hover table-bordered">
              <thead className="table-dark">
                <tr>
                  <th>Course Name</th>
                  <th>Course Code</th>
                  <th>Lecturer</th>
                  <th>Assigned By PL</th>
                </tr>
              </thead>
              <tbody>
                {courses.length > 0 ? (
                  courses.map((course) => (
                    <tr key={course.course_id}>
                      <td>{course.course_name}</td>
                      <td>{course.course_code}</td>
                      <td>{course.lecturer_name}</td>
                      <td>{course.assigned_by_pl_id || "—"}</td>
                    </tr>
                  ))
                ) : (
                  <tr><td colSpan="4" className="text-center">No courses assigned yet</td></tr>
                )}
              </tbody>
            </table>
          </section>
        )}

        {/* Reports Section */}
        {activeSection === "reports" && (
          <section className="dashboard-section">
            <h3>📝 Weekly Reports</h3>
            <form onSubmit={handleReportSubmit} className="report-form">
              <input type="text" name="course_name" placeholder="Course Name" value={report.course_name} onChange={handleReportChange} required />
              <input type="text" name="course_code" placeholder="Course Code" value={report.course_code} onChange={handleReportChange} />
              <input type="text" name="faculty_name" placeholder="Faculty Name" value={report.faculty_name} onChange={handleReportChange} />
              <input type="text" name="class_name" placeholder="Class Name" value={report.class_name} onChange={handleReportChange} />
              <input type="text" name="week_of_reporting" placeholder="Week" value={report.week_of_reporting} onChange={handleReportChange} required />
              <input type="date" name="date" value={report.date} onChange={handleReportChange} />
              <input type="text" name="lecturer_name" placeholder="Lecturer Name" value={report.lecturer_name} onChange={handleReportChange} required />
              <input type="number" name="students_present" placeholder="Students Present" value={report.students_present} onChange={handleReportChange} />
              <input type="number" name="total_students" placeholder="Total Students" value={report.total_students} onChange={handleReportChange} />
              <input type="text" name="venue" placeholder="Venue" value={report.venue} onChange={handleReportChange} />
              <input type="text" name="lecture_time" placeholder="Lecture Time" value={report.lecture_time} onChange={handleReportChange} />
              <input type="text" name="topic_taught" placeholder="Topic Taught" value={report.topic_taught} onChange={handleReportChange} />
              <textarea name="learning_outcomes" placeholder="Learning Outcomes" value={report.learning_outcomes} onChange={handleReportChange} />
              <textarea name="recommendations" placeholder="Recommendations" value={report.recommendations} onChange={handleReportChange} />
              <button type="submit">Submit Report</button>
              {message && <p className={message.startsWith("✅") ? "text-success mt-2" : "text-danger mt-2"}>{message}</p>}
            </form>

            <h4>📄 Submitted Reports</h4>
            {reports.length === 0 ? (
              <p>No reports yet.</p>
            ) : (
              <table className="ratings-table">
                <thead>
                  <tr>
                    <th>Course</th>
                    <th>Week</th>
                    <th>Date</th>
                    <th>Topic</th>
                    <th>Recommendations</th>
                  </tr>
                </thead>
                <tbody>
                  {reports.map((rep) => (
                    <tr key={rep.report_id}>
                      <td>{rep.course_name}</td>
                      <td>{rep.week_of_reporting || rep.week}</td>
                      <td>{rep.date ? rep.date.toString().slice(0, 10) : ""}</td>
                      <td>{rep.topic_taught}</td>
                      <td>{rep.recommendations}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </section>
        )}

        {/* Monitoring Section */}
        {activeSection === "monitoring" && (
          <section className="dashboard-section">
            <h3>📊 Monitoring Student Engagement</h3>
            {monitoringData.length === 0 ? (
              <p>No monitoring data available.</p>
            ) : (
              <table className="table table-hover table-bordered">
                <thead className="table-dark">
                  <tr>
                    <th>Course</th>
                    <th>Total Registered</th>
                    <th>Students Present</th>
                    <th>Attendance %</th>
                    <th>Average Rating</th>
                  </tr>
                </thead>
                <tbody>
                  {monitoringData.map((item, index) => {
                    const attendancePercent =
                      item.totalRegistered && item.studentsPresent
                        ? ((item.studentsPresent / item.totalRegistered) * 100).toFixed(1)
                        : "N/A";
                    return (
                      <tr key={index}>
                        <td>{item.course_name}</td>
                        <td>{item.totalRegistered}</td>
                        <td>{item.studentsPresent}</td>
                        <td>{attendancePercent}%</td>
                        <td>{"⭐".repeat(Math.round(item.averageRating || 0))}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            )}
          </section>
        )}

        {/* Ratings Section */}
        {activeSection === "rating" && (
          <section className="dashboard-section">
            <h3>⭐ Student Ratings</h3>
            {ratings.length === 0 ? (
              <p>No ratings yet.</p>
            ) : (
              <table className="ratings-table">
                <thead>
                  <tr>
                    <th>Rated By</th>
                    <th>Rating</th>
                    <th>Feedback</th>
                  </tr>
                </thead>
                <tbody>
                  {ratings.map((r, index) => (
                    <tr key={index}>
                      <td>{r.student_name}</td>
                      <td>{"⭐".repeat(r.rating)}</td>
                      <td>{r.feedback || "No feedback"}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </section>
        )}
      </div>
    </div>
  );
};

export default Lecturer;
