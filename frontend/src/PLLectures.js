import React from "react";

const Lectures = () => {
  const lecturesData = [
    { course: "Software Engineering", lecturer: "Dr. Maphupu", date: "2025-10-01", topic: "OOP Concepts", time: "09:00-11:00" },
    { course: "Multimedia Design", lecturer: "Mrs. Ts'along", date: "2025-10-02", topic: "Photoshop Basics", time: "11:00-13:00" },
  ];

  return (
    <div>
      <h2 className="mb-4 text-center">Lectures</h2>
      <div className="row">
        {lecturesData.map((lecture, index) => (
          <div className="col-md-6 mb-3" key={index}>
            <div className="card shadow-sm p-3">
              <h5 className="card-title">{lecture.course}</h5>
              <p><strong>Lecturer:</strong> {lecture.lecturer}</p>
              <p><strong>Date:</strong> {lecture.date}</p>
              <p><strong>Topic:</strong> {lecture.topic}</p>
              <p><strong>Time:</strong> {lecture.time}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Lectures;
