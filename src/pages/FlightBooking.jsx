// src/pages/FlightBooking.jsx
import React, { useState } from "react";
import { useParams, useLocation, useNavigate } from "react-router-dom";
import flights from "../data/flights";
import "./FlighBooking.css";
import { addFlightBooking } from "../services/api"; // ✅ API function

export default function FlightBooking() {
  const { id } = useParams();
  const location = useLocation();
  const navigate = useNavigate();

  // ✅ Get flight details (from route or static list)
  const flight =
    location.state?.flight || flights.find((f) => f.id === parseInt(id));

  // 🎨 Airline color mapping
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

  // 🧾 Form data state
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    passengers: "1 Adult",
    travelDate: "",
  });

  // 📥 Handle input changes
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // ✅ Handle form submission
  const handleBooking = async (e) => {
    e.preventDefault();
    if (!flight) return;

    try {
      // 🕓 Format date for backend (yyyy-MM-dd)
      const formattedDate = new Date(formData.travelDate)
        .toISOString()
        .split("T")[0];

      // ✅ Booking object (matches backend entity)
      const bookingDetails = {
        fullName: formData.fullName,
        email: formData.email,
        passengers: formData.passengers,
        travelDate: formattedDate,
        flightName: flight.airline,
        route: `${flight.from} → ${flight.to}`,
        amount: flight.price,
        status: "CONFIRMED",
      };

      console.log("📦 Sending booking data:", bookingDetails);

      // 💾 Save booking to backend
      await addFlightBooking(bookingDetails);

      console.log("✅ Booking saved successfully in backend!");

      // 💽 Save to localStorage for Payment page
      localStorage.setItem(
        "flightBooking",
        JSON.stringify({ ...bookingDetails, flight })
      );

      // 🔀 Redirect to payment page
      navigate(`/payment/${flight.id}`, { state: { bookingDetails, flight } });
    } catch (error) {
      console.error("❌ Booking failed:", error);
      alert("Something went wrong while saving your booking. Try again!");
    }
  };

  if (!flight)
    return (
      <h2 className="text-center text-light mt-5">
        ⚠️ Flight not found! Please go back and try again.
      </h2>
    );

  // 🖥️ UI
  return (
    <div className="flight-booking">
      <div className="booking-container">
        {/* ✈️ Flight Info */}
        <div className="flight-summary" style={{ color: themeColor }}>
          <h2>{flight.airline} ✈️</h2>
          <p>
            {flight.from} → {flight.to}
          </p>
          <p>
            <strong>₹{flight.price}</strong> | {flight.duration}
          </p>
        </div>

        {/* 📝 Booking Form */}
        <div className="booking-card shadow-lg">
          <form className="booking-form" onSubmit={handleBooking}>
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
              className="confirm-btn w-100 mt-4"
              style={{
                background: themeColor,
                color: "#fff",
                boxShadow: `0 0 15px ${themeColor}88`,
              }}
            >
              ✅ Confirm Booking
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
