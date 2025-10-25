import React, { useEffect, useState } from "react";
import axios from "axios";

const API_BASE_URL = "http://localhost:5000/api";

const PLMonitoring = () => {
  const [monitoringData, setMonitoringData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMonitoringData = async () => {
      try {
        const response = await axios.get(`${API_BASE_URL}/monitoring`);
        setMonitoringData(response.data);
      } catch (error) {
        console.error("Error fetching monitoring data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchMonitoringData();
  }, []);

  return (
    <div className="container mt-5">
      <h2 className="mb-4 text-center fw-bold">📋 Lecturer Monitoring Table</h2>

      <div className="card shadow-lg border-0">
        <div className="card-body">
          {loading ? (
            <div className="text-center py-3">
              <div className="spinner-border text-primary" role="status"></div>
              <p className="mt-2">Loading monitoring records...</p>
            </div>
          ) : (
            <div className="table-responsive">
              <table className="table table-hover table-striped align-middle text-center">
                <thead className="table-dark">
                  <tr>
                    <th scope="col">Date</th>
                    <th scope="col">Course</th>
                    <th scope="col">Students Present</th>
                    <th scope="col">Total Students</th>
                    <th scope="col">Venue</th>
                  </tr>
                </thead>
                <tbody>
                  {monitoringData.length > 0 ? (
                    monitoringData.map((row, index) => (
                      <tr key={index}>
                        <td>{row.date}</td>
                        <td>{row.course_name}</td>
                        <td>{row.students_present}</td>
                        <td>{row.total_students}</td>
                        <td>{row.venue}</td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="5" className="text-muted py-4">
                        No monitoring records available.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default PLMonitoring;
