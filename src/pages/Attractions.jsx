import React, { useState } from "react";
import { Link } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import attractions from "../data/attractionsData.js";
import "./Attractions.css"; // ✅ Add this CSS file for styling

export default function Attractions() {
  const [search, setSearch] = useState("");

  // 🔍 Filter attractions by name or location
  const filteredAttractions = attractions.filter(
    (attr) =>
      attr.name.toLowerCase().includes(search.toLowerCase()) ||
      attr.location.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="attractions-page">
      {/* 🌍 Title */}
      <h1 className="text-center mb-4">Discover Attractions</h1>

      {/* 🔎 Search Bar */}
      <div className="row justify-content-center mb-5">
        <div className="col-md-6">
          <input
            type="text"
            className="form-control form-control-lg"
            placeholder="Search attractions (e.g., Paris, Taj Mahal)..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </div>

      {/* 🎴 Results Section */}
      <div className="row g-4">
        {filteredAttractions.length > 0 ? (
          filteredAttractions.map((attraction) => (
            <div className="col-md-4" key={attraction.id}>
              <div className="card h-100 shadow-lg border-0 attraction-card">
                <img
                  src={attraction.image}
                  className="card-img-top"
                  alt={attraction.name}
                />
                <div className="card-body">
                  <h4 className="card-title">{attraction.name}</h4>
                  <h6 className="card-subtitle mb-2 text-muted">
                    {attraction.location}
                  </h6>
                  <p className="card-text">{attraction.description}</p>
                </div>
                <div className="card-footer text-center border-0">
                  <Link
                    to={`/attractions/${attraction.id}`}
                    className="btn btn-warning text-dark fw-bold explore-btn"
                  >
                    Explore
                  </Link>
                </div>
              </div>
            </div>
          ))
        ) : (
          <h4 className="text-center text-light">No attractions found 😢</h4>
        )}
      </div>
    </div>
  );
}
