import React from "react";

const Classes = () => {
  const classesData = [
    { className: "SE1A", course: "Software Engineering", lecturer: "Dr. Maphupu", venue: "Room 101" },
    { className: "MD1B", course: "Multimedia Design", lecturer: "Mrs. Ts'along", venue: "Room 102" },
  ];

  return (
    <div>
      <h2 className="mb-4 text-center">Classes</h2>
      <div className="card shadow-sm p-3">
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
            {classesData.map((cls, index) => (
              <tr key={index}>
                <td>{cls.className}</td>
                <td>{cls.course}</td>
                <td>{cls.lecturer}</td>
                <td>{cls.venue}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Classes;
