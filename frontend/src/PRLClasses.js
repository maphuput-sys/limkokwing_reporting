import React, { useState, useEffect } from "react";
import axios from "axios";

const API_BASE_URL = "https://limkokwing-reporting3.onrender.com/api";

const PRLClasses = ({ plId }) => {
  const [assignments, setAssignments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAssignedClasses = async () => {
      try {
        setLoading(true);
        const res = await axios.get(`${API_BASE_URL}/classes/assigned-by-pl/${plId}`);
        setAssignments(res.data);
      } catch (err) {
        console.error("❌ Error fetching assigned classes:", err);
        alert("Failed to load assigned classes.");
      } finally {
        setLoading(false);
      }
    };

    fetchAssignedClasses();
  }, [plId]);

  return (
    <div className="container mt-4">
      <h2 className="mb-4 text-center">📚 Classes Assigned by Your PL</h2>

      <div className="card shadow-sm p-3">
        <h5 className="mb-3">📋 Assigned Classes</h5>

        {loading ? (
          <p className="text-center">Loading assigned classes...</p>
        ) : assignments.length === 0 ? (
          <p className="text-center">No classes assigned to you yet.</p>
        ) : (
          <table className="table table-striped table-bordered">
            <thead className="table-dark">
              <tr>
                <th>Class Name</th>
                <th>Course</th>
                <th>Lecturer</th>
                <th>Venue</th>
              </tr>
            </thead>
            <tbody>
              {assignments.map((a) => (
                <tr key={a.id}>
                  <td>{a.class_name}</td>
                  <td>{a.course_name}</td>
                  <td>{a.lecturer_name}</td>
                  <td>{a.venue}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default PRLClasses;
