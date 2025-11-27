// src/pages/PaymentSuccess.jsx
import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import "./PaymentSuccess.css";
import pigeon from "../assets/pigeon.png";

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
Route: ${route || "N/A"}
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

      {/* Floating icons (soft ambience) */}
      {[..."✈️🚗🎒🗺️🏨🌍"].map((icon, i) => (
        <div
          key={i}
          className="ps-floating-icon"
          style={{
            left: `${10 + Math.random() * 70}%`,
            top: `${10 + Math.random() * 70}%`,
            animationDelay: `${i * 0.6}s`,
          }}
        >
          {icon}
        </div>
      ))}

      {/* HERO LAYOUT */}
      <div className="ps-hero">
        {/* Left – Pigeon illustration */}
        <div className="ps-hero-left">
          <div className="ps-pigeon-wrapper">
            <img
              src={pigeon}
              alt="Wanderly payment success pigeon"
              className="ps-pigeon-img"
            />
            <div className="ps-pigeon-shadow" />
          </div>
          <p className="ps-hero-caption">
            Your e-ticket is on its way to you ✉️
          </p>
        </div>

        {/* Right – Glass Card */}
        <div className="ps-card">
          <span className="ps-chip">Booking confirmed</span>

          <h2 className="ps-title">Thank you! Payment Successful 🎉</h2>
          <p className="ps-sub">
            We’ve locked in your trip. A copy of your ticket has been generated
            for you.
          </p>

          <div className="ps-divider" />

          <div className="ps-receipt-box">
            <h3 className="ps-trip-title">{paymentData.title}</h3>

            {route && <p className="ps-route">🗺 {route}</p>}

            <p className="ps-amount">
              💰 Paid: <b>₹{amount}</b>
            </p>

            <p className="ps-status">
              Status: <span>SUCCESS</span>
            </p>
          </div>

          {/* Buttons */}
          <div className="ps-btn-group">
            <button className="ps-btn download" onClick={generateTicket}>
              🎟 Download Ticket
            </button>

            <button
              className="ps-btn home"
              onClick={() => navigate("/home")}
            >
              🏠 Go Home
            </button>

            <button className="ps-btn again" onClick={() => navigate(-1)}>
              🔁 Book Again
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
