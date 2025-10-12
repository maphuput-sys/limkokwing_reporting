import React, { useState } from "react";
import { Link } from "react-router-dom";
import "./App.css";

const PRL = () => {
  const [activeSection, setActiveSection] = useState("dashboard");

  const actions = [
    { title: "View Courses", link: "/prl-courses", color: "success" },
    { title: "View Reports / Add Feedback", link: "/prl-reports", color: "primary" },
    { title: "Monitoring", link: "/prl-monitoring", color: "info" },
    { title: "Rating", link: "/prl-rating", color: "warning" },
    { title: "Classes", link: "/prl-classes", color: "secondary" },
  ];

  return (
    <div className="dashboard-wrapper">
      {/* Sidebar Menu */}
      <nav className="sidebar">
        <h2>PRL Menu</h2>
        <ul>
          <li
            className={activeSection === "dashboard" ? "active" : ""}
            onClick={() => setActiveSection("dashboard")}
          >
            Dashboard
          </li>
          <li
            className={activeSection === "reports" ? "active" : ""}
            onClick={() => setActiveSection("reports")}
          >
            Reports
          </li>
          <li
            className={activeSection === "profile" ? "active" : ""}
            onClick={() => setActiveSection("profile")}
          >
            Profile
          </li>
        </ul>
      </nav>

      {/* Main Content */}
      <div className="dashboard-container">
        <h2 className="mb-4 text-center">Principal Lecturer Dashboard</h2>

        {/* Dashboard Section */}
        {activeSection === "dashboard" && (
          <div className="row">
            {actions.map((action) => (
              <div className="col-md-4 mb-3" key={action.title}>
                <div
                  className={`card text-center shadow-sm border-${action.color}`}
                >
                  <div className="card-body">
                    <h5 className="card-title">{action.title}</h5>
                    <Link
                      to={action.link}
                      className={`btn btn-${action.color} mt-2`}
                    >
                      Open
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Reports Section */}
        {activeSection === "reports" && (
          <section className="dashboard-section">
            <h3>Reports & Feedback</h3>
            <p>Here you can view submitted lecturer reports and add feedback.</p>
          </section>
        )}

        {/* Profile Section */}
        {activeSection === "profile" && (
          <section className="dashboard-section">
            <h3>PRL Profile</h3>
            <p>Manage your details and department information here.</p>
          </section>
        )}
      </div>
    </div>
  );
};

export default PRL;
