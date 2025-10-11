import React from "react";
import { useParams, Link } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import attractions from "../data/attractionsData.js"; // ✅ Import shared data

export default function AttractionDetails() {
  const { id } = useParams();
  const attraction = attractions.find((a) => a.id === id);

  if (!attraction) {
    return (
      <div className="container py-5 text-center text-light">
        <h2>Attraction Not Found 😢</h2>
        <Link to="/attractions" className="btn btn-warning mt-3 fw-bold">
          Back to Attractions
        </Link>
      </div>
    );
  }

  return (
    <div
      className="container py-5"
      style={{ backgroundColor: "black", minHeight: "100vh" }}
    >
      <div
        className="card mx-auto shadow-lg border-0"
        style={{ maxWidth: "800px", backgroundColor: "#111", color: "yellow" }}
      >
        <img
          src={attraction.image}
          alt={attraction.name}
          className="card-img-top"
          style={{ height: "400px", objectFit: "cover" }}
        />
        <div className="card-body">
          <h2 className="card-title">{attraction.name}</h2>
          <h5 className="text-muted">{attraction.location}</h5>
          <p className="mt-3">{attraction.description}</p>
        </div>
        <div
          className="card-footer text-center border-0"
          style={{ backgroundColor: "#222" }}
        >
          <Link to="/attractions" className="btn btn-warning fw-bold text-dark">
            Back to Attractions
          </Link>
        </div>
      </div>
    </div>
  );
}
