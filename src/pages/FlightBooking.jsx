// 🌍 src/pages/FlightBooking.jsx
import React, { useState } from "react";
import { useParams, useLocation, useNavigate } from "react-router-dom";
import flights from "../data/flights";
import "./FlighBooking.css";
import { addFlightBooking } from "../services/api";

// 🎬 Public path video
const flightVideo = "/videos/flightbg.mp4";

// Helper: Convert "2h 15m" into minutes
const durationToMinutes = (duration) => {
  const h = parseInt(duration.split("h")[0]);
  const m = parseInt(duration.split("h")[1]);
  return h * 60 + m;
};

// Helper: Add minutes to base time
const addMinutes = (time, minutes) => {
  const [h, m] = time.split(":").map(Number);
  const date = new Date();
  date.setHours(h, m + minutes);
  return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
};

export default function FlightBooking() {
  const { id } = useParams();
  const location = useLocation();
  const navigate = useNavigate();

  // Find selected flight
  const flight =
    location.state?.flight || flights.find((f) => f.id === parseInt(id));

  // Theme colors for airlines
  const airlineColors = {
    IndiGo: "#4f83ff",
    "Air India": "#ff7043",
    Vistara: "#9c27b0",
    SpiceJet: "#ff9800",
  };

  const themeColor = airlineColors[flight?.airline] || "#FFD700";

  // Takeoff time (random but consistent)
  const takeoffTimes = ["06:30", "08:45", "11:20", "14:10", "17:55", "21:15"];
  const takeoff = takeoffTimes[flight.id % takeoffTimes.length];

  // Calculate landing time from duration
  const landing = addMinutes(takeoff, durationToMinutes(flight.duration));

  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    passengers: "1 Adult",
    travelDate: "",
    seatClass: "Economy",
  });

  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  // Booking handler
  const handleBooking = async (e) => {
    e.preventDefault();

    try {
      const bookingDetails = {
        ...formData,
        flightName: flight.airline,
        route: `${flight.from} → ${flight.to}`,
        amount: Number(String(flight.price).replace(/[^0-9]/g, "")),
        takeoff,
        landing,
      };

      await addFlightBooking(bookingDetails);

      localStorage.setItem("flightBooking", JSON.stringify(bookingDetails));

      navigate("/payment", {
        state: {
          paymentData: {
            type: "flight",
            title: flight.airline,
            price: Number(flight.price.replace(/[^0-9]/g, "")),
            details: {
              route: `${flight.from} → ${flight.to}`,
              ...bookingDetails
            }
          }
        }
      });
      
    } catch (err) {
      console.error("❌ Booking error:", err);
      alert("Booking failed!");
    }
  };

  if (!flight)
    return <h2 className="text-light text-center mt-5">⚠️ Flight not found!</h2>;

  return (
    <div className="flight-booking-page" style={{ "--theme": themeColor }}>
      {/* Background */}
      <video className="flight-bg-video" autoPlay loop muted playsInline>
        <source src={flightVideo} type="video/mp4" />
      </video>
      <div className="flight-overlay"></div>

      <div className="booking-card-container">
        {/* LEFT — Flight Info */}
        <div className="flight-info-card">
          {/* Airline Logo */}
          <img src={flight.image} alt={flight.airline} className="airline-logo" />

          <h2 className="airline-name" style={{ color: themeColor }}>
            {flight.airline}
          </h2>

          {/* Route */}
          <p className="flight-route">
            {flight.from} <span className="plane-icon">✈️</span> {flight.to}
          </p>

          {/* Times */}
          <div className="time-box">
            <div>
              <h3>{takeoff}</h3>
              <p>Takeoff</p>
            </div>
            <div className="time-line"></div>
            <div>
              <h3>{landing}</h3>
              <p>Landing</p>
            </div>
          </div>

          {/* Price + Duration */}
          <p className="price-duration">
            <strong>{flight.price}</strong> • {flight.duration}
          </p>

          {/* Stops */}
          <div className="stops-box">
            <h4>Stops:</h4>
            {flight.stops?.map((s, i) => (
              <p key={i}>
                {s.city} ({s.airport}) — Delay {s.delay}
              </p>
            ))}
          </div>

          <div className="glow-line"></div>
        </div>

        {/* RIGHT — Booking Form */}
        <div className="booking-form-card">
          <h3>Confirm Your Booking</h3>

          <form onSubmit={handleBooking} className="booking-form">
            <label>👤 Full Name</label>
            <input
              type="text"
              name="fullName"
              required
              value={formData.fullName}
              onChange={handleChange}
            />

            <label>📧 Email</label>
            <input
              type="email"
              name="email"
              required
              value={formData.email}
              onChange={handleChange}
            />

            <label>👥 Passengers</label>
            <select name="passengers" onChange={handleChange}>
              <option>1 Adult</option>
              <option>2 Adults</option>
              <option>Family (4)</option>
            </select>

            <label>💺 Class</label>
            <select name="seatClass" onChange={handleChange}>
              <option>Economy</option>
              <option>Premium Economy</option>
              <option>Business</option>
            </select>

            <label>📅 Travel Date</label>
            <input
              type="date"
              name="travelDate"
              required
              value={formData.travelDate}
              onChange={handleChange}
            />

            <button
              type="submit"
              className="confirm-btn"
              style={{ background: themeColor }}
            >
              ✈️ Confirm & Pay
            </button>

            <button type="button" className="back-btn" onClick={() => navigate(-1)}>
              ⬅ Back to Flights
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
