import React, { useState } from "react";

const Rating = () => {
  const [ratings, setRatings] = useState([
    { course: "Software Engineering", lecturer: "Dr. Maphupu", rating: 4 },
    { course: "Multimedia", lecturer: "Mrs. Ts'along", rating: 3 },
  ]);

  const handleChange = (index, value) => {
    const newRatings = [...ratings];
    newRatings[index].rating = value;
    setRatings(newRatings);
  };

  return (
    <div>
      <h2 className="mb-4 text-center">Rating</h2>
      <div className="row">
        {ratings.map((item, index) => (
          <div className="col-md-6 mb-3" key={index}>
            <div className="card shadow-sm p-3 text-center">
              <h5 className="card-title">{item.course}</h5>
              <p><strong>Lecturer:</strong> {item.lecturer}</p>
              <div>
                <label>Rating: </label>
                <select
                  className="form-select mt-1"
                  value={item.rating}
                  onChange={(e) => handleChange(index, parseInt(e.target.value))}
                >
                  <option value={1}>1</option>
                  <option value={2}>2</option>
                  <option value={3}>3</option>
                  <option value={4}>4</option>
                  <option value={5}>5</option>
                </select>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Rating;
