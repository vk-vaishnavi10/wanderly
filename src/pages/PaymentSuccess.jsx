// src/pages/PaymentSuccess.jsx
import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import "./PaymentSuccess.css";

export default function PaymentSuccess() {
  const location = useLocation();
  const navigate = useNavigate();

  const paymentData = location.state?.paymentData;

  if (!paymentData) {
    return (
      <div className="ps-error">
        ⚠️ No payment data found. Please try again.
      </div>
    );
  }

  const cleanAmount = (v) =>
    Number(String(v || 0).replace(/[^0-9]/g, "")) || 0;
  const amount = cleanAmount(paymentData.price);

  const details = paymentData.details || {};
  const route =
    details.route ||
    details.pickup ||
    details.pickupLocation ||
    "";

  const generateTicket = () => {
    const content = `
WANDERLY — E-TICKET
------------------------------------
Booking: ${paymentData.title}
Amount Paid: ₹${amount}
Status: SUCCESS
------------------------------------
Thank you for choosing Wanderly 💛
    `;

    const blob = new Blob([content], { type: "text/plain" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = "Wanderly_Ticket.txt";
    link.click();
  };

  return (
    <div className="ps-container">

      {/* Background aura lights */}
      <div className="ps-bg-circle c1"></div>
      <div className="ps-bg-circle c2"></div>
      <div className="ps-bg-circle c3"></div>

      {/* Animated icons */}
      {[..."✈️🚗🎒🗺️🏨🌍"].map((icon, i) => (
        <div
          key={i}
          className="ps-floating-icon"
          style={{
            left: `${Math.random() * 90}%`,
            top: `${Math.random() * 85}%`,
            animationDelay: `${i * 0.5}s`,
          }}
        >
          {icon}
        </div>
      ))}

      {/* Glass Card */}
      <div className="ps-card">
        <h2 className="ps-title">Payment Successful 🎉</h2>
        <p className="ps-sub">Your booking is now confirmed!</p>

        <div className="ps-receipt-box">
          <h3>{paymentData.title}</h3>

          {route && (
            <p className="ps-route">🗺 {route}</p>
          )}

          <p className="ps-amount">💰 Paid: <b>₹{amount}</b></p>
          <p className="ps-status">Status: <span>SUCCESS</span></p>
        </div>

        {/* Buttons */}
        <div className="ps-btn-group">
          <button className="ps-btn download" onClick={generateTicket}>
            🎟 Download Ticket
          </button>

          <button className="ps-btn home" onClick={() => navigate("/home")}>
            🏠 Go Home
          </button>

          <button className="ps-btn again" onClick={() => navigate(-1)}>
            🔁 Book Again
          </button>
        </div>
      </div>
    </div>
  );
}
