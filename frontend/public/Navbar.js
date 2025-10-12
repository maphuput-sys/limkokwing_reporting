import React from "react";
import "./App.css";

const Navbar = () => {
  const role = localStorage.getItem("role") || "guest";

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    localStorage.removeItem("userId");
    window.location.href = "/";
  };

  return (
    <nav className="navbar">
      <h3>LUCT Reporting System</h3>
      <div className="navbar-links">
        {role !== "guest" && <span>Logged in as: {role.toUpperCase()}</span>}
        <button onClick={handleLogout} className="logout-btn">
          Logout
        </button>
      </div>
    </nav>
  );
};

export default Navbar;
