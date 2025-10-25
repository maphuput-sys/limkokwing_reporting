import React from "react";

const PRLMonitoring = () => {
  const dummyData = [
    { date: "2025-10-01", course: "Software Engineering", studentsPresent: 25, totalStudents: 30, venue: "Room 101" },
    { date: "2025-10-02", course: "Multimedia Design", studentsPresent: 28, totalStudents: 30, venue: "Room 102" },
  ];

  return (
    <div>
      <h2 className="mb-4 text-center">Monitoring</h2>
      <div className="card shadow p-3">
        <table className="table table-striped table-bordered">
          <thead className="table-dark">
            <tr>
              <th>Date</th>
              <th>Course</th>
              <th>Students Present</th>
              <th>Total Students</th>
              <th>Venue</th>
            </tr>
          </thead>
          <tbody>
            {dummyData.map((row, index) => (
              <tr key={index}>
                <td>{row.date}</td>
                <td>{row.course}</td>
                <td>{row.studentsPresent}</td>
                <td>{row.totalStudents}</td>
                <td>{row.venue}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default PRLMonitoring;
