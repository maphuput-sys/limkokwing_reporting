import React from "react";

const Reports = () => {
  const reports = [
    { lecturer: "Dr. Maphupu", course: "Software Engineering", week: "Week 1", topic: "OOP Concepts", feedback: "Good progress" },
    { lecturer: "Mrs. Ts'along", course: "Multimedia", week: "Week 1", topic: "Photoshop Basics", feedback: "Needs improvement" },
  ];

  return (
    <div>
      <h2 className="mb-4 text-center">Reports</h2>
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
    </div>
  );
};

export default Reports;
