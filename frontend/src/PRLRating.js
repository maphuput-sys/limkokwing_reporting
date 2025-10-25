import React, { useState, useEffect } from "react";
import axios from "axios";

const API_BASE_URL = "https://limkokwing-reporting3.onrender.com/api";

const PRLRating = () => {
  const [ratings, setRatings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchRatings = async () => {
      try {
        const response = await axios.get(`${API_BASE_URL}/all/ratings`);
        setRatings(response.data);
      } catch (err) {
        console.error("❌ Error fetching ratings:", err);
        setError("Failed to load ratings.");
      } finally {
        setLoading(false);
      }
    };
    fetchRatings();
  }, []);

  const totalRatings = ratings.length;
  const averageRating =
    totalRatings > 0
      ? ratings.reduce((sum, r) => sum + r.rating, 0) / totalRatings
      : 0;

  const cardStyle = {
    flex: "1 1 200px",
    padding: "20px",
    borderRadius: "12px",
    boxShadow: "0 4px 10px rgba(0,0,0,0.1)",
    backgroundColor: "#fff",
    textAlign: "center",
    minWidth: "180px",
  };

  if (loading) return <p className="text-center mt-5">Loading ratings...</p>;
  if (error) return <p className="text-danger text-center mt-5">{error}</p>;

  return (
    <div>
      <h2 className="mb-4 text-center">📊 Lecturer Ratings Overview (PRL View)</h2>

      <div
        style={{
          display: "flex",
          gap: "20px",
          justifyContent: "center",
          flexWrap: "wrap",
          marginBottom: "30px",
        }}
      >
        <div style={cardStyle}>
          <h4>Total Ratings</h4>
          <p style={{ fontSize: "1.5rem", fontWeight: "bold" }}>{totalRatings}</p>
        </div>
        <div style={cardStyle}>
          <h4>Average Rating</h4>
          <p style={{ fontSize: "1.5rem", fontWeight: "bold" }}>
            {averageRating.toFixed(1)} / 5
          </p>
          <div style={{ fontSize: "1.3rem" }}>
            {"⭐".repeat(Math.round(averageRating))}
            {"☆".repeat(5 - Math.round(averageRating))}
          </div>
        </div>
      </div>

      <div className="row">
        {ratings.map((item, index) => (
          <div className="col-md-6 mb-3" key={index}>
            <div className="card shadow-sm p-3 text-center">
              <h5 className="card-title">{item.lecturer_name}</h5>
              <p>
                <strong>Course:</strong> {item.course_name || "N/A"}
              </p>
              <p>
                <strong>Student:</strong> {item.student_name}
              </p>
              <p>
                <strong>Feedback:</strong>{" "}
                {item.feedback ? item.feedback : "No feedback"}
              </p>
              <div className="mt-2">
                {"⭐".repeat(item.rating)}
                {"☆".repeat(5 - item.rating)}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default PRLRating;
