// src/pages/FlightBooking.jsx
import React, { useState } from "react";
import { useParams, useLocation, useNavigate } from "react-router-dom";
import flights from "../data/flights";
import "./FlightBooking.css";
import { addFlightBooking } from "../services/api";

const flightVideo = "/videos/flightbg.mp4";

// Convert "2h 15m" to minutes
const durationToMinutes = (duration) => {
  if (!duration || typeof duration !== "string") return 0;
  const hours = parseInt(duration.match(/(\d+)h/)?.[1] || 0);
  const mins = parseInt(duration.match(/(\d+)m/)?.[1] || 0);
  return hours * 60 + mins;
};

// Add minutes to time
const addMinutes = (time, minutes) => {
  if (!time) return "";
  const [h, m] = time.split(":").map(Number);
  const d = new Date();
  d.setHours(h, m + minutes);
  return d.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
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

  if (!flight) {
    return <h2 className="text-light text-center mt-5">⚠️ Flight not found!</h2>;
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
    return Number(String(flight.price).replace(/[^0-9]/g, "")) || 0;
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
            details: bookingDetails,
          },
        },
      });
    } catch (err) {
      alert("Booking failed!");
    }
  };

  return (
    <div className="flight-booking-page" style={{ "--theme": themeColor }}>
      {/* Background Video */}
      <video className="flight-bg-video" autoPlay loop muted playsInline>
        <source src={flightVideo} type="video/mp4" />
      </video>

      <div className="flight-overlay"></div>

      <div className="booking-card-container">
        <div className="flight-info-card">
          <img src={flight.image} alt={flight.airline} className="airline-logo" />

          <h2 className="airline-name">{flight.airline}</h2>

          <p className="flight-route">
            {flight.from} <span className="plane-icon">✈️</span> {flight.to}
          </p>

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

          <p className="price-duration">
            <strong>{flight.price}</strong> • {flight.duration}
          </p>

          <div className="stops-box">
            <h4>Stops:</h4>
            {flight.stops?.length ? (
              flight.stops.map((s, i) => <p key={i}>{s.city} ({s.airport})</p>)
            ) : (
              <p>Direct</p>
            )}
          </div>

          <div className="glow-line" />
        </div>

        {/* Booking Form */}
        <div className="booking-form-card">
          <h3>Confirm Your Booking</h3>

          <form onSubmit={handleBooking} className="booking-form">
            <label htmlFor="fullName">👤 Full Name</label>
            <input
              id="fullName"
              type="text"
              name="fullName"
              placeholder="Enter your full name"
              required
              value={formData.fullName}
              onChange={handleChange}
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

            <button type="submit" className="confirm-btn">
              ✈️ Confirm & Pay
            </button>

            <button type="button" className="back-btn" onClick={() => navigate(-1)}>
              ⬅ Back to Flights
            </button>
          </form>
        </div>
      </div>

      {/* ☁️ Cloud Helper (CSS only) */}
      <CloudHelper />
    </div>
  );
}

/* ☁️ CLOUD COMPONENT */
const CloudHelper = () => {
  return (
    <div className="flight-cloud-helper" aria-hidden="true">
      <div className="cloud">
        <div className="puff p1" />
        <div className="puff p2" />
        <div className="puff p3" />
        <div className="cloud-face">
          <div className="cloud-eye" />
          <div className="cloud-eye" />
          <div className="cloud-mouth" />
        </div>
      </div>

      <div className="cloud-speech">
        Hello traveller! ✈️<br />Ready to book your flight? 💜
      </div>
    </div>
  );
};
