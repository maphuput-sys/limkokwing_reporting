import React, { useState, useEffect } from "react";
import axios from "axios";

const PLReports = () => {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchReports();
  }, []);

  const fetchReports = async () => {
    try {
      const response = await axios.get("http://localhost:5000/api/prl-reports"); // backend endpoint
      setReports(response.data);
    } catch (error) {
      console.error("Error fetching reports:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h2 className="mb-4 text-center">Program Leader Reports</h2>
      {loading ? (
        <p className="text-center">Loading reports...</p>
      ) : reports.length === 0 ? (
        <p className="text-center">No reports found.</p>
      ) : (
        <div className="row">
          {reports.map((report, index) => (
            <div className="col-md-6 mb-3" key={index}>
              <div className="card shadow-sm p-3">
                <h5 className="card-title">{report.course}</h5>
                <p><strong>Lecturer:</strong> {report.lecturer}</p>
                <p><strong>Week:</strong> {report.week}</p>
                <p><strong>Topic:</strong> {report.topic}</p>
                <p><strong>Feedback:</strong> {report.feedback}</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default PLReports;
