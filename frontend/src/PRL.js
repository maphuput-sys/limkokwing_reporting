import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import PRLCourses from "./PRLCourses";
import PRLReports from "./PRLReports";
import axios from "axios";
import "./App.css";

const API_BASE_URL = "http://localhost:5000/api";

const PRL = () => {
  const [activeSection, setActiveSection] = useState("classes");
  const [ratings, setRatings] = useState([]);
  const [courses, setCourses] = useState([]);
  const [monitoringData, setMonitoringData] = useState([]);

  const prlId = 1; // Replace with actual logged-in PRL ID
  const navigate = useNavigate();

  // Fetch data per section
  useEffect(() => {
    if (activeSection === "ratings") fetchRatings();
    if (activeSection === "classes") fetchClasses();
    if (activeSection === "monitoring") fetchMonitoringData();
    if (activeSection === "coursesList") fetchCourses();
  }, [activeSection]);

  const fetchCourses = async () => {
    try {
      const res = await axios.get(`${API_BASE_URL}/prl/${prlId}/courses`);
      setCourses(res.data);
    } catch (err) {
      console.error("Error fetching courses:", err);
    }
  };

  const fetchMonitoringData = async () => {
    try {
      const res = await axios.get(`${API_BASE_URL}/prl/${prlId}/monitoring`);
      setMonitoringData(res.data);
    } catch {
      setMonitoringData([
        { course_name: "Software Engineering", totalRegistered: 50, studentsPresent: 45, averageRating: 4.2 },
        { course_name: "Multimedia Design", totalRegistered: 40, studentsPresent: 28, averageRating: 4.7 },
      ]);
    }
  };

  const fetchClasses = async () => {
    try {
      const res = await axios.get(`${API_BASE_URL}/prl/${prlId}/classes`);
      setCourses(res.data);
    } catch (err) {
      console.error("Error fetching classes:", err);
    }
  };

  const fetchRatings = async () => {
    try {
      const res = await axios.get(`${API_BASE_URL}/prl/${prlId}/ratings`);
      setRatings(res.data);
    } catch (err) {
      console.error("Error fetching ratings:", err);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("prlToken");
    alert("Logged out successfully.");
    navigate("/register");
  };

  const cardStyle = {
    flex: "1 1 200px",
    padding: "20px",
    borderRadius: "10px",
    boxShadow: "0 4px 8px rgba(0,0,0,0.1)",
    backgroundColor: "#fff",
    textAlign: "center",
    minWidth: "150px",
  };

  return (
    <div className="dashboard-wrapper">
      {/* Sidebar */}
      <nav className="sidebar">
        <h2>PRL Menu</h2>
        <ul>
          <li className={activeSection === "classes" ? "active" : ""} onClick={() => setActiveSection("classes")}>📚 Classes</li>
          <li className={activeSection === "reports" ? "active" : ""} onClick={() => setActiveSection("reports")}>📝 Reports</li>
          <li className={activeSection === "monitoring" ? "active" : ""} onClick={() => setActiveSection("monitoring")}>📊 Monitoring</li>
          <li className={activeSection === "ratings" ? "active" : ""} onClick={() => setActiveSection("ratings")}>⭐ Ratings</li>
          <li className={activeSection === "coursesList" ? "active" : ""} onClick={() => setActiveSection("coursesList")}>📖 Courses</li>
        </ul>
        <button onClick={handleLogout} className="logout-btn">🚪 Logout</button>
      </nav>

      {/* Dashboard Content */}
      <div className="dashboard-container">
        <h2>📘 Principal Lecturer Dashboard</h2>

        {/* Classes Section */}
        {activeSection === "classes" && (
          <section className="dashboard-section">
            <h3>📚 Lecturer Assigned Classes</h3>
            <table className="table table-hover table-bordered">
              <thead className="table-dark">
                <tr>
                  <th>Course Name</th>
                  <th>Course Code</th>
                  <th>Lecturer</th>
                </tr>
              </thead>
              <tbody>
                {courses.length > 0 ? courses.map((c, i) => (
                  <tr key={i}>
                    <td>{c.course_name}</td>
                    <td>{c.course_code}</td>
                    <td>{c.lecturer_name}</td>
                  </tr>
                )) : (
                  <tr><td colSpan="3" className="text-center">No classes available</td></tr>
                )}
              </tbody>
            </table>
          </section>
        )}

        {/* Courses Section */}
        {activeSection === "coursesList" && (
          <section className="dashboard-section">
            <h3>📖 All Courses Under My Stream</h3>
            <PRLCourses />
          </section>
        )}

        {/* Reports Section */}
        {activeSection === "reports" && (
          <section className="dashboard-section">
            <PRLReports />
          </section>
        )}

        {/* Monitoring Section */}
        {activeSection === "monitoring" && (
          <section className="dashboard-section">
            <h3>📊 Monitoring Student Engagement</h3>
            {monitoringData.length === 0 ? <p>No monitoring data available.</p> : (
              <div style={{ display: "flex", gap: "20px", flexWrap: "wrap", marginBottom: "30px" }}>
                <div style={cardStyle}><h4>Total Registered</h4><p>{monitoringData.reduce((sum, c) => sum + c.totalRegistered, 0)}</p></div>
                <div style={cardStyle}><h4>Students Present</h4><p>{monitoringData.reduce((sum, c) => sum + c.studentsPresent, 0)}</p></div>
                <div style={cardStyle}><h4>Attendance %</h4><p>{((monitoringData.reduce((sum, c) => sum + c.studentsPresent, 0)/monitoringData.reduce((sum, c) => sum + c.totalRegistered, 0))*100).toFixed(1)}%</p></div>
                <div style={cardStyle}><h4>Average Rating</h4><p>{"⭐".repeat(Math.round(monitoringData.reduce((sum, c) => sum + c.averageRating, 0)/monitoringData.length))}</p></div>
              </div>
            )}
          </section>
        )}

        {/* Ratings Section */}
        {activeSection === "ratings" && (
          <section className="dashboard-section">
            <h3>⭐ Student Ratings Overview</h3>
            {ratings.length === 0 ? <p>No ratings yet.</p> : (
              <div style={{ display: "flex", gap: "20px", justifyContent: "center", flexWrap: "wrap", marginBottom: "30px" }}>
                <div style={cardStyle}><h4>Total Ratings</h4><p style={{ fontSize: "1.5rem", fontWeight: "bold" }}>{ratings.length}</p></div>
                <div style={cardStyle}><h4>Average Rating</h4>
                  <p style={{ fontSize: "1.5rem", fontWeight: "bold" }}>
                    {(ratings.reduce((sum, r) => sum + (r.rating || 0), 0)/ratings.length).toFixed(1)} / 5
                  </p>
                  <div style={{ fontSize: "1.3rem" }}>
                    {"⭐".repeat(Math.round(ratings.reduce((sum, r) => sum + (r.rating || 0), 0)/ratings.length))}
                    {"☆".repeat(5 - Math.round(ratings.reduce((sum, r) => sum + (r.rating || 0), 0)/ratings.length))}
                  </div>
                </div>
              </div>
            )}
          </section>
        )}

      </div>
    </div>
  );
};

export default PRL;
