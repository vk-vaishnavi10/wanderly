// ✅ src/pages/FlightBooking.jsx
import React, { useMemo, useState } from "react";
import { useParams, useLocation, useNavigate } from "react-router-dom";
import flights from "../data/flights";
import "./FlighBooking.css";
import { addFlightBooking } from "../services/api";

export default function FlightBooking() {
  const { id } = useParams();
  const location = useLocation();
  const navigate = useNavigate();

  // 🛫 Get flight info
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

  // 🪑 Seat map generation
  const seatMap = useMemo(() => {
    const rows = ["A", "B", "C", "D", "E", "F"];
    const cols = Array.from({ length: 10 }, (_, i) => i + 1);
    return rows.flatMap((r) => cols.map((c) => `${r}${c}`));
  }, []);

  // 🚫 Example of blocked seats
  const blocked = useMemo(() => new Set(["B3", "B4", "C7", "E2", "F10"]), []);

  // 📋 Booking state
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    passengers: "1 Adult",
    travelDate: "",
  });
  const [selectedSeats, setSelectedSeats] = useState([]);

  // 🎯 Determine seat limit
  const seatLimit = (() => {
    const p = formData.passengers;
    if (p === "1 Adult") return 1;
    if (p === "2 Adults") return 2;
    if (p === "1 Adult + 1 Child") return 2;
    if (p === "Family (4)") return 4;
    return 1;
  })();

  // 💺 Handle seat click
  const handleSeatClick = (seatId) => {
    if (blocked.has(seatId)) return;

    setSelectedSeats((prev) => {
      if (prev.includes(seatId)) {
        return prev.filter((s) => s !== seatId);
      } else {
        if (prev.length >= seatLimit) {
          alert(`You can only select ${seatLimit} seat(s).`);
          return prev;
        }
        return [...prev, seatId];
      }
    });
  };

  // 🧾 Handle form input
  const handleChange = (e) =>
    setFormData((s) => ({ ...s, [e.target.name]: e.target.value }));

  // 💳 Handle booking
  const handleBooking = async (e) => {
    e.preventDefault();
    if (!flight) return;

    if (selectedSeats.length === 0) {
      alert("Please select at least one seat.");
      return;
    }

    if (selectedSeats.length !== seatLimit) {
      alert(`Please select ${seatLimit} seat(s) before continuing.`);
      return;
    }

    try {
      const formattedDate = new Date(formData.travelDate)
        .toISOString()
        .split("T")[0];

      // ✅ booking data structure
      const bookingDetails = {
        fullName: formData.fullName,
        email: formData.email,
        passengers: formData.passengers,
        travelDate: formattedDate,
        seat: selectedSeats.join(", "), // backend-safe singular key
        seats: selectedSeats.join(", "), // redundant, avoids schema mismatch
        flightName: flight.airline,
        route: `${flight.from} → ${flight.to}`,
        amount: flight.price,
        status: "CONFIRMED",
      };

      console.log("📦 Sending booking data:", bookingDetails);

      // ✅ Try both possible backend paths
      try {
        await addFlightBooking(bookingDetails);
        console.log("✅ Booking saved to backend!");
      } catch (err) {
        console.warn("⚠️ Primary booking API failed, falling back to /flightBookings...");
        await fetch("http://localhost:8081/api/flightBookings", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(bookingDetails),
        });
        console.log("✅ Fallback API worked!");
      }

      // 💾 Save to localStorage
      localStorage.setItem(
        "flightBooking",
        JSON.stringify({ ...bookingDetails, flight })
      );

      // 🔀 Redirect to payment
      navigate(`/payment/${flight.id}`, {
        state: { bookingDetails, flight },
      });
    } catch (error) {
      console.error("❌ Booking failed:", error);
      alert("Server rejected your booking (400 Bad Request). Please verify backend fields.");
    }
  };

  if (!flight)
    return (
      <h2 className="text-center text-light mt-5">
        ⚠️ Flight not found! Please go back and try again.
      </h2>
    );

  return (
    <div
      className="flight-booking"
      style={{
        minHeight: "100vh",
        backgroundImage:
          "url(https://images.unsplash.com/photo-1504196606672-aef5c9cefc92?auto=format&fit=crop&w=1650&q=80)",
        backgroundSize: "cover",
        backgroundPosition: "center",
        paddingTop: "100px",
      }}
    >
      <div className="booking-container">
        {/* ✈️ Flight Summary */}
        <div className="flight-summary text-center" style={{ color: themeColor }}>
          <h2>{flight.airline} ✈️</h2>
          <p>{flight.from} → {flight.to}</p>
          <p><strong>₹{flight.price}</strong> | {flight.duration}</p>
        </div>

        {/* 💺 Seat Selection */}
        <div className="seat-selection text-center">
          <h4 style={{ color: themeColor }}>Choose Your Seat</h4>

          <div className="legend mb-3">
            <span className="legend-box available" /> Available
            <span className="legend-box selected" /> Selected
            <span className="legend-box blocked" /> Booked
          </div>

          <div className="seat-grid">
            {seatMap.map((seat) => {
              const isBlocked = blocked.has(seat);
              const isSelected = selectedSeats.includes(seat);
              return (
                <button
                  type="button"
                  key={seat}
                  className={`seat ${isBlocked ? "blocked" : ""} ${
                    isSelected ? "selected" : ""
                  }`}
                  disabled={isBlocked}
                  onClick={() => handleSeatClick(seat)}
                >
                  {seat}
                </button>
              );
            })}
          </div>

          {selectedSeats.length > 0 && (
            <p className="text-center mt-3" style={{ color: themeColor }}>
              ✅ Selected Seats: <strong>{selectedSeats.join(", ")}</strong>
            </p>
          )}
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
                fontWeight: "bold",
                boxShadow: `0 0 15px ${themeColor}88`,
              }}
            >
              ✅ Confirm Booking & Continue to Payment
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
