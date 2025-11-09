// 🌍 src/pages/FlightBooking.jsx
import React, { useState } from "react";
import { useParams, useLocation, useNavigate } from "react-router-dom";
import flights from "../data/flights";
import "./FlighBooking.css";
import { addFlightBooking } from "../services/api";

// 🎬 Use public path instead of importing from assets
const flightVideo = "/videos/flightbg.mp4";

export default function FlightBooking() {
  const { id } = useParams();
  const location = useLocation();
  const navigate = useNavigate();

  // 🛫 Find flight info
  const flight =
    location.state?.flight || flights.find((f) => f.id === parseInt(id));

  const airlineColors = {
    IndiGo: "#4f83ff",
    "Air India": "#ff7043",
    Vistara: "#9c27b0",
    SpiceJet: "#ff9800",
    GoAir: "#00acc1",
    "Akasa Air": "#ff6f61",
    "Alliance Air": "#ab47bc",
    "AirAsia India": "#e53935",
    TruJet: "#26a69a",
    "Star Air": "#3949ab",
  };
  const themeColor = airlineColors[flight?.airline] || "#FFD700";

  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    passengers: "1 Adult",
    travelDate: "",
    seatClass: "Economy",
  });

  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  // 💳 Handle booking
  const handleBooking = async (e) => {
    e.preventDefault();
    if (!flight) return;

    try {
      const bookingDetails = {
        ...formData,
        flightName: flight.airline,
        route: `${flight.from} → ${flight.to}`,
        amount: Number(String(flight.price).replace(/[^0-9]/g, "")),
      };

      await addFlightBooking(bookingDetails);
      localStorage.setItem("flightBooking", JSON.stringify(bookingDetails));

      navigate(`/payment/${flight.id}`, { state: { bookingDetails, flight } });
    } catch (error) {
      console.error("❌ Booking failed:", error);
      alert("Booking failed! Please try again later.");
    }
  };

  if (!flight)
    return (
      <h2 className="text-center text-light mt-5">
        ⚠️ Flight not found. Please go back and try again.
      </h2>
    );

  return (
    <div className="flight-booking-page" style={{ "--theme": themeColor }}>
      {/* 🎬 Background Video */}
      <video
        className="flight-bg-video"
        autoPlay
        loop
        muted
        playsInline
        preload="auto"
        onLoadedData={() => console.log("✅ Flight video loaded successfully")}
        onError={(e) => console.error("❌ Flight video load error:", e)}
      >
        <source src={flightVideo} type="video/mp4" />
        Your browser does not support the video tag.
      </video>

      {/* Overlay for contrast */}
      <div className="flight-overlay"></div>

      <div className="booking-card-container">
        {/* 🛩️ Flight Overview */}
        <div className="flight-info-card">
          <h2 style={{ color: themeColor }}>{flight.airline}</h2>
          <p className="route">
            {flight.from} ✈️ {flight.to}
          </p>
          <p className="details">
            <strong>₹{flight.price}</strong> | {flight.duration}
          </p>
          <div className="glow-line"></div>
        </div>

        {/* 🧾 Booking Form */}
        <div className="booking-form-card">
          <h3>Confirm Your Booking</h3>
          <form onSubmit={handleBooking} className="booking-form">
            <label>👤 Full Name</label>
            <input
              type="text"
              name="fullName"
              value={formData.fullName}
              onChange={handleChange}
              placeholder="Enter your name"
              required
            />

            <label>📧 Email</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Enter your email"
              required
            />

            <label>👥 Passengers</label>
            <select
              name="passengers"
              value={formData.passengers}
              onChange={handleChange}
            >
              <option>1 Adult</option>
              <option>2 Adults</option>
              <option>1 Adult + 1 Child</option>
              <option>Family (4)</option>
            </select>

            <label>💺 Class</label>
            <select
              name="seatClass"
              value={formData.seatClass}
              onChange={handleChange}
            >
              <option>Economy</option>
              <option>Premium Economy</option>
              <option>Business</option>
              <option>First Class</option>
            </select>

            <label>📅 Travel Date</label>
            <input
              type="date"
              name="travelDate"
              value={formData.travelDate}
              onChange={handleChange}
              required
            />

            <button
              type="submit"
              className="confirm-btn"
              style={{
                background: themeColor,
                boxShadow: `0 0 15px ${themeColor}88`,
              }}
            >
              ✅ Confirm & Proceed to Payment
            </button>

            <button
              type="button"
              onClick={() => navigate(-1)}
              className="back-btn"
            >
              ⬅ Back to Flights
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
