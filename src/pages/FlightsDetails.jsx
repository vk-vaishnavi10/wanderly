// ✅ src/pages/FlightDetails.jsx
import React from "react";
import { useParams, useNavigate } from "react-router-dom";
import flights from "../data/flights";
import "./FlightsDetails.css";

export default function FlightsDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const flight = flights.find((f) => f.id === parseInt(id));

  if (!flight) {
    return (
      <div className="text-center text-light mt-5">
        ❌ Flight not found. Please go back and try again.
      </div>
    );
  }

  return (
    <div className="container text-light py-5">
      <h2 className="text-center mb-4" style={{ color: "#FFD700" }}>✈️ Flight Details</h2>

      <div className="flight-card p-4 bg-dark border border-warning rounded shadow-lg mx-auto" style={{ maxWidth: "800px" }}>
        <div className="text-center mb-3">
          <img
            src={flight.image}
            alt={flight.airline}
            style={{ width: "100%", maxHeight: "300px", objectFit: "cover", borderRadius: "10px" }}
          />
        </div>

        <h3 style={{ color: "#FFD700" }}>{flight.airline}</h3>
        <p>✈️ <strong>{flight.from}</strong> → <strong>{flight.to}</strong></p>
        <p>💰 <strong>{flight.price}</strong></p>
        <p>🕓 Duration: {flight.duration}</p>

        {flight.stops && flight.stops.length > 0 && (
          <div className="mb-3">
            <h5 style={{ color: "#FFD700" }}>🛫 Stops</h5>
            <ul>
              {flight.stops.map((stop, index) => (
                <li key={index}>
                  {stop.city} ({stop.airport}) — Delay: {stop.delay}
                </li>
              ))}
            </ul>
          </div>
        )}

        <div className="text-center mt-4">
          <button
            className="btn btn-warning fw-bold px-4"
            onClick={() => navigate(`/flights/book/${flight.id}`, { state: { flight } })}

          >
            🪑 Proceed to Booking (Choose Seats)
          </button>
        </div>
      </div>
    </div>
  );
}
