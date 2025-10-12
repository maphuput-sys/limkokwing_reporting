import React, { useState } from "react";
import "./App.css";

const Lecturer = () => {
  const [activeSection, setActiveSection] = useState("submit");
  const [form, setForm] = useState({
    facultyName: "",
    className: "",
    weekOfReporting: "",
    dateOfLecture: "",
    courseName: "",
    courseCode: "",
    lecturerName: "",
    studentsPresent: "",
    totalRegistered: "",
    venue: "",
    scheduledTime: "",
    topic: "",
    learningOutcomes: "",
    recommendations: "",
  });

  const [success, setSuccess] = useState("");

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Report Submitted:", form);
    setSuccess("Report submitted successfully!");
    setForm({
      facultyName: "",
      className: "",
      weekOfReporting: "",
      dateOfLecture: "",
      courseName: "",
      courseCode: "",
      lecturerName: "",
      studentsPresent: "",
      totalRegistered: "",
      venue: "",
      scheduledTime: "",
      topic: "",
      learningOutcomes: "",
      recommendations: "",
    });
  };

  return (
    <div className="dashboard-wrapper">
      {/* Sidebar Menu */}
      <nav className="sidebar">
        <h2>Lecturer Menu</h2>
        <ul>
          <li
            className={activeSection === "submit" ? "active" : ""}
            onClick={() => setActiveSection("submit")}
          >
            <i className="bi bi-upload"></i> Submit Report
          </li>
          <li
            className={activeSection === "view" ? "active" : ""}
            onClick={() => setActiveSection("view")}
          >
            <i className="bi bi-eye"></i> View Reports
          </li>
          <li
            className={activeSection === "profile" ? "active" : ""}
            onClick={() => setActiveSection("profile")}
          >
            <i className="bi bi-person-circle"></i> Profile
          </li>
        </ul>
      </nav>

      {/* Main Content */}
      <div className="dashboard-container">
        <h2>📋 Lecturer Dashboard</h2>

        {activeSection === "submit" && (
          <section className="dashboard-section">
            <h3>Submit Weekly Report</h3>
            <form className="report-form" onSubmit={handleSubmit}>
              {Object.keys(form).map((key) => (
                <input
                  key={key}
                  type={key.includes("date") ? "date" : "text"}
                  name={key}
                  placeholder={key.replace(/([A-Z])/g, " $1")}
                  value={form[key]}
                  onChange={handleChange}
                  required
                />
              ))}
              <button type="submit">Submit Report</button>
            </form>
            {success && <p className="success-msg">{success}</p>}
          </section>
        )}

        {activeSection === "view" && (
          <section className="dashboard-section">
            <h3>View Reports</h3>
            <p>Here you’ll be able to view all submitted reports.</p>
          </section>
        )}

        {activeSection === "profile" && (
          <section className="dashboard-section">
            <h3>Lecturer Profile</h3>
            <p>View and update your profile details here.</p>
          </section>
        )}
      </div>
    </div>
  );
};

export default Lecturer;
