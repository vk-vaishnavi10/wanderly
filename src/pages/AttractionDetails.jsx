import React from "react";
import { useParams, Link } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import attractions from "../data/attractionsData.js";
import "./Attractions.css";

export default function AttractionDetails() {
  const { id } = useParams();
  const attraction = attractions.find((a) => a.id.toString() === id);

  if (!attraction) {
    return (
      <div className="attraction-details-page text-center">
        <h2>Attraction Not Found 😢</h2>
        <Link to="/attractions" className="back-btn">
          ⬅️ Back to Attractions
        </Link>
      </div>
    );
  }

  return (
    <div className="attraction-details-page">
      <div className="details-card">
        <img src={attraction.image} alt={attraction.name} className="details-img" />
        <div className="details-body">
          <h2>{attraction.name}</h2>
          <h5>{attraction.location}</h5>
          <p>{attraction.description}</p>
        </div>
        <div className="details-footer">
          <Link to="/attractions" className="back-btn">
            ⬅️ Back to Attractions
          </Link>
        </div>
      </div>
    </div>
  );
}
