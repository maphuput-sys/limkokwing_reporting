import React from "react";

const Courses = () => {
  const courses = [
    { name: "Software Engineering", code: "SE101", lecturer: "Dr. Maphupu" },
    { name: "Multimedia Design", code: "MD102", lecturer: "Mrs. Ts'along" },
  ];

  return (
    <div>
      <h2 className="mb-4 text-center">Courses</h2>
      <div className="card shadow-sm p-3">
        <table className="table table-hover table-bordered">
          <thead className="table-dark">
            <tr>
              <th>Course Name</th>
              <th>Course Code</th>
              <th>Lecturer</th>
            </tr>
          </thead>
          <tbody>
            {courses.map((course, index) => (
              <tr key={index}>
                <td>{course.name}</td>
                <td>{course.code}</td>
                <td>{course.lecturer}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Courses;
