// src/pages/FlightBooking.jsx
import React, { useState } from "react";
import { useParams, useLocation, useNavigate } from "react-router-dom";
import flights from "../data/flights";
import "./FlightBooking.css";
import { addFlightBooking } from "../services/api";

const flightVideo = "/videos/flightbg.mp4";

// Convert "2h 15m" or "2h" or "45m" to minutes
const durationToMinutes = (duration) => {
  if (!duration || typeof duration !== "string") return 0;
  const hoursMatch = duration.match(/(\d+)\s*h/);
  const minsMatch = duration.match(/(\d+)\s*m/);
  const hours = hoursMatch ? parseInt(hoursMatch[1], 10) : 0;
  const mins = minsMatch ? parseInt(minsMatch[1], 10) : 0;
  return hours * 60 + mins;
};

// Add minutes to time "HH:MM"
const addMinutes = (time, minutes) => {
  if (!time) return "";
  const [hStr, mStr] = time.split(":");
  const h = Number(hStr || 0);
  const m = Number(mStr || 0);
  const date = new Date();
  date.setHours(h, m + minutes);
  return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
};

export default function FlightBooking() {
  const { id } = useParams();
  const location = useLocation();
  const navigate = useNavigate();

  const flight =
    location.state?.flight || flights.find((f) => f.id === parseInt(id));

  const airlineColors = {
    IndiGo: "#4f83ff",
    "Air India": "#ff7043",
    Vistara: "#9c27b0",
    SpiceJet: "#ff9800",
  };
  const themeColor = airlineColors[flight?.airline] || "#ff7a18";

  // guard
  if (!flight) {
    return (
      <h2 className="text-light text-center mt-5">
        ⚠️ Flight not found!
      </h2>
    );
  }

  const takeoffTimes = ["06:30", "08:45", "11:20", "14:10", "17:55", "21:15"];
  const takeoff = takeoffTimes[flight.id % takeoffTimes.length];
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

  const cleanPrice = () => {
    if (!flight) return 0;
    if (typeof flight.price === "string") {
      return Number(String(flight.price).replace(/[^0-9]/g, "")) || 0;
    }
    return Number(flight.price) || 0;
  };

  const handleBooking = async (e) => {
    e.preventDefault();
    try {
      const amount = cleanPrice();
      const bookingDetails = {
        ...formData,
        flightName: flight.airline,
        route: `${flight.from} → ${flight.to}`,
        amount,
        takeoff,
        landing,
      };

      await addFlightBooking?.(bookingDetails);

      localStorage.setItem("flightBooking", JSON.stringify(bookingDetails));

      navigate("/payment", {
        state: {
          paymentData: {
            type: "flight",
            title: flight.airline,
            price: amount,
            details: {
              route: `${flight.from} → ${flight.to}`,
              ...bookingDetails,
            },
          },
        },
      });
    } catch (err) {
      console.error("❌ Booking failed:", err);
      alert("Booking failed!");
    }
  };

  return (
    <div
      className="flight-booking-page"
      style={{ "--theme": themeColor }}
    >
      {/* 🎥 Background video */}
      <video
        className="flight-bg-video"
        autoPlay
        loop
        muted
        playsInline
        preload="auto"
      >
        <source src={flightVideo} type="video/mp4" />
      </video>

      {/* soft overlay */}
      <div className="flight-overlay" aria-hidden="true"></div>

      {/* main booking content */}
      <div className="booking-card-container">
        {/* left info card */}
        <div className="flight-info-card">
          <img
            src={flight.image}
            alt={flight.airline}
            className="airline-logo"
          />

          <h2 className="airline-name" style={{ color: themeColor }}>
            {flight.airline}
          </h2>

          <p className="flight-route">
            {flight.from} <span className="plane-icon">✈️</span>{" "}
            {flight.to}
          </p>

          <div className="time-box">
            <div>
              <h3>{takeoff}</h3>
              <p>Takeoff</p>
            </div>

            <div className="time-line" aria-hidden="true"></div>

            <div>
              <h3>{landing}</h3>
              <p>Landing</p>
            </div>
          </div>

          <p className="price-duration">
            <strong>{flight.price}</strong> • {flight.duration}
          </p>

          <div className="stops-box">
            <h4>Stops:</h4>
            {flight.stops?.length ? (
              flight.stops.map((s, i) => (
                <p key={i}>
                  {s.city} ({s.airport}) — Delay {s.delay}
                </p>
              ))
            ) : (
              <p>Direct</p>
            )}
          </div>

          <div className="glow-line" aria-hidden="true" />
        </div>

        {/* right booking form */}
        <div
          className="booking-form-card"
          role="region"
          aria-label="booking form"
        >
          <h3>Confirm Your Booking</h3>

          <form
            onSubmit={handleBooking}
            className="booking-form"
            autoComplete="on"
          >
            <label htmlFor="fullName">👤 Full Name</label>
            <input
              id="fullName"
              type="text"
              name="fullName"
              placeholder="Enter your full name"
              required
              value={formData.fullName}
              onChange={handleChange}
              autoComplete="name"
            />

            <label htmlFor="email">📧 Email</label>
            <input
              id="email"
              type="email"
              name="email"
              placeholder="Enter your email"
              required
              value={formData.email}
              onChange={handleChange}
              autoComplete="email"
            />

            <label htmlFor="passengers">👥 Passengers</label>
            <select
              id="passengers"
              name="passengers"
              value={formData.passengers}
              onChange={handleChange}
            >
              <option>1 Adult</option>
              <option>2 Adults</option>
              <option>Family (4)</option>
            </select>

            <label htmlFor="seatClass">💺 Class</label>
            <select
              id="seatClass"
              name="seatClass"
              value={formData.seatClass}
              onChange={handleChange}
            >
              <option>Economy</option>
              <option>Premium Economy</option>
              <option>Business</option>
            </select>

            <label htmlFor="travelDate">📅 Travel Date</label>
            <input
              id="travelDate"
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

            <button
              type="button"
              className="back-btn"
              onClick={() => navigate(-1)}
            >
              ⬅ Back to Flights
            </button>
          </form>
        </div>
      </div>

      {/* 🌈 Neon chubby welcome cat */}
      <NeonBookingCat />
    </div>
  );
}

/* 🐱 Neon chubby black cat component (pure CSS drawing) */
const NeonBookingCat = () => {
  return (
    <div className="neon-cat-container" aria-hidden="true">
      {/* glowing ribbon the cat is "pulling" */}
      <div className="cat-ribbon" />

      {/* cat body */}
      <div className="neon-cat">
        <div className="cat-head">
          <div className="cat-ear ear-left" />
          <div className="cat-ear ear-right" />
          <div className="cat-face">
            <span className="cat-eye eye-left" />
            <span className="cat-eye eye-right" />
            <span className="cat-blush blush-left" />
            <span className="cat-blush blush-right" />
            <span className="cat-mouth" />
          </div>
        </div>

        <div className="cat-body">
          <div className="cat-belly" />
          <div className="cat-paws">
            <span className="cat-paw paw-left" />
            <span className="cat-paw paw-right paw-wave" />
          </div>
          <div className="cat-tail" />
        </div>

        <div className="cat-glow-orb" />
      </div>

      {/* speech bubble */}
      <div className="cat-speech-bubble">
        <span className="line-1">Hello traveller! ✈️</span>
        <span className="line-2">Welcome to your flight booking 💜</span>
      </div>
    </div>
  );
};
