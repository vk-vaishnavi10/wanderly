// src/pages/PaymentSuccess.jsx
import React, { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { addPayment } from "../services/api.js";
import "./Payment.css";

export default function PaymentSuccess() {
  const location = useLocation();
  const navigate = useNavigate();
  const flight = location.state?.flight;

  useEffect(() => {
    const savePayment = async () => {
      if (!flight) return;
      try {
        await addPayment({
          userName: "Vaishnavi",
          email: "vaishnavi@example.com",
          flightName: flight.airline || "Unknown Airline",
          route: `${flight.fromCity || flight.from} → ${flight.toCity || flight.to}`,
          amount: parseFloat(flight.price?.toString().replace(/[₹,]/g, "") || 0),
          status: "SUCCESS",
        });
        console.log("✅ Payment saved successfully in database!");
      } catch (err) {
        console.error("❌ Error saving payment:", err);
      }
    };
    savePayment();
  }, [flight]);

  return (
    <div className="payment-page text-light">
      <div className="payment-card">
        <h2 style={{ color: "#00ffcc" }}>✅ Payment Successful!</h2>
        {flight && (
          <p>
            <strong>{flight.airline}</strong>: {flight.fromCity || flight.from} →{" "}
            {flight.toCity || flight.to}
            <br />
            💰 <strong>₹{flight.price}</strong> | ⏱ {flight.duration || "N/A"}
          </p>
        )}
        <button
          onClick={() => navigate("/flights")}
          className="pay-btn"
          style={{ backgroundColor: "#00ccff", border: "none" }}
        >
          ✈️ Back to Flights
        </button>
      </div>
    </div>
  );
}
