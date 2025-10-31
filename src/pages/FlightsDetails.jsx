// ✅ src/pages/FlightDetails.jsx
import React from "react";
import { useParams, useNavigate } from "react-router-dom";
import flights from "../data/flights";
import "./FlightsDetails.css";

export default function FlightDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const flight = flights.find((f) => f.id === parseInt(id));

  if (!flight) {
    return (
      <div
        className="text-center text-light"
        style={{
          paddingTop: "8rem",
          minHeight: "100vh",
          backgroundColor: "#000",
        }}
      >
        ❌ Flight not found. Please go back and try again.
      </div>
    );
  }

  return (
    <div
      className="flight-details-page text-light"
      style={{
        backgroundColor: "#000",
        minHeight: "100vh",
        paddingTop: "8rem", // ⬅️ Keeps content below navbar
        paddingBottom: "4rem",
      }}
    >
      <div className="container">
        <h2
          className="text-center mb-4 fw-bold"
          style={{
            color: "#FFD700",
            textShadow: "0 0 10px rgba(255,215,0,0.6)",
          }}
        >
          ✈️ Flight Details
        </h2>

        <div
          className="flight-card p-4 mx-auto"
          style={{
            background: "#111",
            border: "2px solid #FFD700",
            borderRadius: "15px",
            boxShadow: "0 0 25px rgba(255, 215, 0, 0.2)",
            maxWidth: "850px",
            textAlign: "center",
          }}
        >
          {/* Flight Image */}
          <div className="text-center mb-4">
            <img
              src={flight.image}
              alt={flight.airline}
              style={{
                width: "100%",
                maxHeight: "350px",
                objectFit: "cover",
                borderRadius: "10px",
                border: "1px solid #FFD70055",
              }}
            />
          </div>

          {/* Flight Info */}
          <h3
            style={{
              color: "#FFD700",
              fontWeight: "700",
              textShadow: "0 0 10px rgba(255,215,0,0.4)",
            }}
          >
            {flight.airline}
          </h3>
          <p style={{ fontSize: "1.1rem" }}>
            ✈️ <strong>{flight.from}</strong> →{" "}
            <strong>{flight.to}</strong>
          </p>
          <p style={{ fontSize: "1.1rem" }}>
            💰 <strong>{flight.price}</strong>
          </p>
          <p style={{ fontSize: "1.1rem" }}>
            🕓 Duration: {flight.duration}
          </p>

          {/* Stops */}
          {flight.stops && flight.stops.length > 0 && (
            <div
              className="mt-4 p-3 rounded"
              style={{
                backgroundColor: "#1a1a1a",
                border: "1px solid #FFD70044",
              }}
            >
              <h5
                style={{
                  color: "#FFD700",
                  textShadow: "0 0 8px rgba(255,215,0,0.4)",
                }}
              >
                🛫 Stops
              </h5>
              <ul
                style={{
                  listStyle: "none",
                  paddingLeft: 0,
                  marginTop: "10px",
                }}
              >
                {flight.stops.map((stop, index) => (
                  <li
                    key={index}
                    style={{
                      marginBottom: "8px",
                      fontSize: "1rem",
                      color: "#ccc",
                    }}
                  >
                    • <strong>{stop.city}</strong> ({stop.airport}) — Delay:{" "}
                    {stop.delay}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Proceed to Booking Button */}
          <div className="text-center mt-5">
            <button
              className="btn fw-bold px-5 py-2"
              style={{
                backgroundColor: "#FFD700",
                color: "#000",
                borderRadius: "30px",
                fontSize: "1.1rem",
                boxShadow: "0 0 20px rgba(255,215,0,0.4)",
                transition: "all 0.3s ease",
              }}
              onClick={() =>
                navigate(`/flights/book/${flight.id}`, { state: { flight } })
              }
              onMouseEnter={(e) =>
                (e.target.style.boxShadow = "0 0 30px rgba(255,215,0,0.8)")
              }
              onMouseLeave={(e) =>
                (e.target.style.boxShadow = "0 0 20px rgba(255,215,0,0.4)")
              }
            >
              🪑 Proceed to Booking (Choose Seats)
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
