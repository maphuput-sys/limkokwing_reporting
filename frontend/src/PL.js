import React, { useState } from "react";
import { Link } from "react-router-dom";
import "./App.css";

const PL = () => {
  const [activeSection, setActiveSection] = useState("dashboard");

  const actions = [
    { title: "Add / Assign Courses", link: "/pl-courses", color: "success" },
    { title: "View Reports from PRL", link: "/pl-reports", color: "primary" },
    { title: "Monitoring", link: "/pl-monitoring", color: "info" },
    { title: "Lectures", link: "/pl-lectures", color: "secondary" },
    { title: "Rating", link: "/pl-rating", color: "warning" },
    { title: "Classes", link: "/pl-classes", color: "dark" },
  ];

  return (
    <div className="dashboard-wrapper">
      {/* Sidebar Menu */}
      <nav className="sidebar">
        <h2>PL Menu</h2>
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
        <h2 className="mb-4 text-center">Program Leader Dashboard</h2>

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

        {activeSection === "reports" && (
          <section className="dashboard-section">
            <h3>Reports Overview</h3>
            <p>Here you can view submitted reports and feedback from PRL.</p>
          </section>
        )}

        {activeSection === "profile" && (
          <section className="dashboard-section">
            <h3>Profile Settings</h3>
            <p>Manage your profile and program details here.</p>
          </section>
        )}
      </div>
    </div>
  );
};

export default PL;
