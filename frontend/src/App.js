import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import 'bootstrap/dist/css/bootstrap.min.css';

import Header from "./Header";
import ErrorBoundary from "./ErrorBoundary";


import Login from "./Login";
import Registration from "./Registration";

import Student from "./Student";
import StudentMonitoring from "./StudentMonitoring";
import StudentRating from "./StudentRating";

import Lecturer from "./Lecturer";

import PRL from "./PRL";
import PRLCourses from "./PRLCourses";
import PRLReports from "./PRLReports";
import PRLMonitoring from "./PRLMonitoring";
import PRLRating from "./PRLRating";
import PRLClasses from "./PRLClasses";

import PL from "./PL";
import PLCourses from "./PLCourses";
import PLReports from "./PLReports";
import PLMonitoring from "./PLMonitoring";
import PLLectures from "./PLLectures";
import PLRating from "./PLRating";
import PLClasses from "./PLClasses";

function App() {
  return (
    <Router>
      <Header /> {/* Navbar always visible */}
      <div className="container mt-4">
        <ErrorBoundary>
          <Routes>
            {/* Auth Routes */}
            <Route path="/login" element={<Login />} />
            <Route path="/registration" element={<Registration />} />

            {/* Student Routes */}
            <Route path="/student" element={<Student />} />
            <Route path="/student-monitoring" element={<StudentMonitoring />} />
            <Route path="/student-rating" element={<StudentRating />} />

            {/* Lecturer Routes */}
            <Route path="/lecturer" element={<Lecturer />} />

            {/* PRL Routes */}
            <Route path="/prl" element={<PRL />} />
            <Route path="/prl-courses" element={<PRLCourses />} />
            <Route path="/prl-reports" element={<PRLReports />} />
            <Route path="/prl-monitoring" element={<PRLMonitoring />} />
            <Route path="/prl-rating" element={<PRLRating />} />
            <Route path="/prl-classes" element={<PRLClasses />} />

            {/* PL Routes */}
            <Route path="/pl" element={<PL />} />
            <Route path="/pl-courses" element={<PLCourses />} />
            <Route path="/pl-reports" element={<PLReports />} />
            <Route path="/pl-monitoring" element={<PLMonitoring />} />
            <Route path="/pl-lectures" element={<PLLectures />} />
            <Route path="/pl-rating" element={<PLRating />} />
            <Route path="/pl-classes" element={<PLClasses />} />

            {/* Default / catch-all route */}
            <Route path="*" element={<Registration />} />
          </Routes>
        </ErrorBoundary>
      </div>
    </Router>
  );
}

export default App;
