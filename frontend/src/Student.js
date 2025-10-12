import React, { useState } from "react";
import "./App.css";

const Student = () => {
  const [activeSection, setActiveSection] = useState("monitoring");

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
        </ul>
      </nav>

      {/* Main Content */}
      <div className="dashboard-container">
        <h2>🎓 Student Dashboard</h2>

        {activeSection === "monitoring" && (
          <section className="dashboard-section">
            <h3>Monitoring</h3>
            <p>Track your attendance, class performance, and lecturer ratings here.</p>
          </section>
        )}

        {activeSection === "rating" && (
          <section className="dashboard-section">
            <h3>Rating</h3>
            <p>Provide feedback or rate your lecturers after each week of reporting.</p>
          </section>
        )}
      </div>
    </div>
  );
};

export default Student;
