import React, { useState } from "react";
import { Link } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import attractions from "../data/attractionsData.js";
import "./Attractions.css";

export default function Attractions() {
  const [search, setSearch] = useState("");

  const filteredAttractions = attractions.filter(
    (attr) =>
      attr.name.toLowerCase().includes(search.toLowerCase()) ||
      attr.location.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="attractions-page">
      {/* 🌍 Title */}
      <h1 className="page-title">Discover Attractions</h1>

      {/* 🔍 Search Bar */}
      <div className="search-container">
        <input
          type="text"
          className="search-input"
          placeholder="Search attractions (e.g., Paris, Taj Mahal)..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      {/* 🎴 Attraction Cards */}
      <div className="attractions-grid">
        {filteredAttractions.length > 0 ? (
          filteredAttractions.map((attraction) => (
            <div className="attraction-card" key={attraction.id}>
              <img
                src={attraction.image}
                alt={attraction.name}
                className="attraction-img"
              />
              <div className="attraction-info">
                <h3>{attraction.name}</h3>
                <h6>{attraction.location}</h6>
                <p>{attraction.description}</p>
              </div>
              <div className="card-footer">
                <Link to={`/attractions/${attraction.id}`} className="explore-btn">
                  Explore ✨
                </Link>
              </div>
            </div>
          ))
        ) : (
          <h4 className="no-results">No attractions found 😢</h4>
        )}
      </div>
    </div>
  );
}
