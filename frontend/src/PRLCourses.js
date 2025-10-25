import React, { useEffect, useState } from "react";
import axios from "axios";

const API_BASE_URL = "https://limkokwing-reporting3.onrender.com/api"; // your backend URL

const PRLCourses = ({ plId }) => {
  const [courses, setCourses] = useState([]);

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const res = await axios.get(`${API_BASE_URL}/courses`, {
          params: { pl_id: plId },
        });
        setCourses(res.data);
      } catch (err) {
        console.error("❌ Failed to fetch courses:", err);
      }
    };
    fetchCourses();
  }, [plId]);

  return (
    <div>
      <h2 className="mb-4 text-center">Courses</h2>
      <div className="card shadow-sm p-3">
        <table className="table table-hover table-bordered">
          <thead className="table-dark">
            <tr>
              <th>Course Name</th>
              <th>Code</th>
              <th>Lecturer</th>
              <th>Venue</th>
            </tr>
          </thead>
          <tbody>
            {courses.map((course, index) => (
              <tr key={index}>
                <td>{course.course_name}</td>
                <td>{course.course_code}</td>
                <td>{course.lecturer}</td>
                <td>{course.venue || "—"}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default PRLCourses;
