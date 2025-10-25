import React, { useEffect, useState } from "react";
import axios from "axios";
import "./App.css";

const API_BASE_URL = "https://limkokwing-reporting3.onrender.com/api/reports";

const PRLReports = () => {
  const [reports, setReports] = useState([]);
  const [feedbacks, setFeedbacks] = useState({});

  useEffect(() => {
    fetchReports();
  }, []);

  // ✅ Fetch reports with feedback
  const fetchReports = async () => {
    try {
      const res = await axios.get(`${API_BASE_URL}/with-feedback`);
      setReports(res.data);
    } catch (err) {
      console.error("Error fetching reports:", err);
      alert("❌ Failed to fetch reports");
    }
  };

  // ✅ Handle input typing for feedback
  const handleFeedbackChange = (reportId, value) => {
    setFeedbacks((prev) => ({ ...prev, [reportId]: value }));
  };

  // ✅ Submit new feedback
  const handleFeedbackSubmit = async (reportId) => {
    const feedbackText = feedbacks[reportId];
    if (!feedbackText) return alert("Please enter feedback before submitting");

    try {
      await axios.post(`${API_BASE_URL}/feedback`, {
        report_id: reportId,
        prl_name: localStorage.getItem("prlName") || "PRL Admin",
        feedback_text: feedbackText,
      });

      alert("✅ Feedback submitted successfully");
      setFeedbacks((prev) => ({ ...prev, [reportId]: "" }));
      fetchReports();
    } catch (err) {
      console.error("Error submitting feedback:", err);
      alert("❌ Failed to submit feedback");
    }
  };

  // ✅ Delete existing feedback
  const handleDeleteFeedback = async (feedbackId) => {
    if (!window.confirm("Are you sure you want to delete this feedback?")) return;

    try {
      await axios.delete(`${API_BASE_URL}/feedback/${feedbackId}`);
      alert("🗑 Feedback deleted successfully");
      fetchReports();
    } catch (err) {
      console.error("Error deleting feedback:", err);
      alert("❌ Failed to delete feedback");
    }
  };

  return (
    <div className="container mt-4">
      <h2 className="text-center mb-4">Lecturer Reports & Feedback</h2>

      <div className="row">
        {reports.length === 0 ? (
          <p className="text-center">No reports found.</p>
        ) : (
          reports.map((report) => (
            <div className="col-md-6 mb-4" key={report.report_id}>
              <div className="card shadow-sm p-3 border-0 rounded-3">
                <div className="card-body">
                  <h5 className="card-title">{report.course_name}</h5>
                  <p><strong>Lecturer:</strong> {report.lecturer_name}</p>
                  <p><strong>Class:</strong> {report.class_name}</p>
                  <p><strong>Week:</strong> {report.week_of_reporting}</p>
                  <p><strong>Topic:</strong> {report.topic_taught}</p>
                  <p><strong>Report:</strong> {report.report_text}</p>

                  {/* ✅ If feedback exists, show it with delete option */}
                  {report.feedback_text ? (
                    <div className="bg-light p-2 mt-3 rounded position-relative">
                      <p><strong>PRL Feedback:</strong> {report.feedback_text}</p>
                      <small className="text-muted">
                        By: {report.prl_name} on{" "}
                        {new Date(report.feedback_date).toLocaleDateString()}
                      </small>

                      <button
                        className="btn btn-danger btn-sm mt-2"
                        onClick={() => handleDeleteFeedback(report.feedback_id)}
                      >
                        🗑 Delete Feedback
                      </button>
                    </div>
                  ) : (
                    // ✅ Show feedback form when none exists
                    <div className="mt-3">
                      <textarea
                        className="form-control mb-2"
                        placeholder="Enter feedback..."
                        value={feedbacks[report.report_id] || ""}
                        onChange={(e) =>
                          handleFeedbackChange(report.report_id, e.target.value)
                        }
                      />
                      <button
                        className="btn btn-primary btn-sm"
                        onClick={() => handleFeedbackSubmit(report.report_id)}
                      >
                        Submit Feedback
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default PRLReports;
