import React from "react";
import { Link, useNavigate } from "react-router-dom";
import 'bootstrap/dist/css/bootstrap.min.css';

const Header = () => {
  const navigate = useNavigate();
  const role = localStorage.getItem("role"); 

  const handleLogout = () => {
    localStorage.clear();
    navigate("/login");
  };

  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-primary">
      <div className="container">
        <Link className="navbar-brand" to="/">LUCT Reporting System</Link>
        <button
          className="navbar-toggler"
          type="button"
       data-bs-toggle="collapse"
   data-bs-target="#navbarNav"
    aria-controls="navbarNav"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        <div className="collapse navbar-collapse" id="navbarNav">
          <ul className="navbar-nav ms-auto">

            {/* Guest links */}
            {!role && (
              <>
                <li className="nav-item">
                  <Link className="nav-link" to="/login">Login</Link>
                </li>
                <li className="nav-item">
                  <Link className="nav-link" to="/registration">Register</Link>
                </li>
              </>
            )}

            {/* Always show Register link for logged-in users */}
            {role && (
      <li className="nav-item">
                <Link className="nav-link" to="/registration">Register</Link>
              </li>
            )}

            {/* Student */}
            {role === "student" && (
              <li className="nav-item dropdown">
         <span className="nav-link dropdown-toggle" role="button" data-bs-toggle="dropdown">
                  Student
                </span>
                <ul className="dropdown-menu dropdown-menu-end">
                  <li><Link className="dropdown-item" to="/student">Dashboard</Link></li>
                
            <li><Link className="dropdown-item" to="/student-monitoring">Monitoring</Link></li>
                  <li><Link className="dropdown-item" to="/student-rating">Ratings</Link></li>
          <li><hr className="dropdown-divider"/></li>
                  <li><button className="dropdown-item" onClick={handleLogout}>Logout</button></li>
                </ul>
              </li>
            )}

            {/* Lecturer */}
            {role === "lecturer" && (
              <li className="nav-item dropdown">
                <span className="nav-link dropdown-toggle" role="button" data-bs-toggle="dropdown">
                  Lecturer
                </span>
                <ul className="dropdown-menu dropdown-menu-end">
                  <li><Link className="dropdown-item" to="/lecturer">Dashboard</Link></li>
                  <li><hr className="dropdown-divider"/></li>
                  <li><button className="dropdown-item" onClick={handleLogout}>Logout</button></li>
                </ul>
              </li>
            )}

            {/* PRL */}
            {role === "prl" && (
              <li className="nav-item dropdown">
                <span className="nav-link dropdown-toggle" role="button" data-bs-toggle="dropdown">
                  PRL
                </span>
                <ul className="dropdown-menu dropdown-menu-end">
                  <li><Link className="dropdown-item" to="/prl-courses">Courses</Link></li>
                  <li><Link className="dropdown-item" to="/prl-reports">Reports</Link></li>
                  <li><Link className="dropdown-item" to="/prl-monitoring">Monitoring</Link></li>
                  <li><Link className="dropdown-item" to="/prl-rating">Ratings</Link></li>
                  <li><Link className="dropdown-item" to="/prl-classes">Classes</Link></li>
                  <li><hr className="dropdown-divider"/></li>
                  <li><button className="dropdown-item" onClick={handleLogout}>Logout</button></li>
                </ul>
              </li>
            )}

            {/* PL */}
            {role === "pl" && (
              <li className="nav-item dropdown">
                <span className="nav-link dropdown-toggle" role="button" data-bs-toggle="dropdown">
                  PL
                </span>
                <ul className="dropdown-menu dropdown-menu-end">
                  <li><Link className="dropdown-item" to="/pl-courses">Add / Assign Courses</Link></li>
                  <li><Link className="dropdown-item" to="/pl-reports">View Reports from PRL</Link></li>
                  <li><Link className="dropdown-item" to="/pl-monitoring">Monitoring</Link></li>
                  <li><Link className="dropdown-item" to="/pl-lectures">Lectures</Link></li>
                  <li><Link className="dropdown-item" to="/pl-rating">Rating</Link></li>
                  <li><Link className="dropdown-item" to="/pl-classes">Classes</Link></li>
                  <li><hr className="dropdown-divider"/></li>
                  <li><button className="dropdown-item" onClick={handleLogout}>Logout</button></li>
                </ul>
              </li>
            )}

          </ul>
        </div>
      </div>
    </nav>
  );
};

export default Header;
