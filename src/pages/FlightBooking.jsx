// ✅ src/pages/FlightBooking.jsx
import React, { useMemo, useState } from "react";
import { useParams, useLocation, useNavigate } from "react-router-dom";
import flights from "../data/flights";
import "./FlighBooking.css"; // (file name kept exactly as you had)
import { addFlightBooking } from "../services/api";

export default function FlightBooking() {
  const { id } = useParams();
  const location = useLocation();
  const navigate = useNavigate();

  const flight = location.state?.flight || flights.find((f) => f.id === parseInt(id));

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

  // Build a seat map A–F rows, 1–10 columns => 60 seats
  const seatMap = useMemo(() => {
    const rows = ["A", "B", "C", "D", "E", "F"];
    const cols = Array.from({ length: 10 }, (_, i) => i + 1);
    return rows.flatMap((r) => cols.map((c) => `${r}${c}`));
  }, []);

  // Example: seats that are already booked (you can fetch from backend later)
  const blocked = useMemo(() => new Set(["B3", "B4", "C7", "E2", "F10"]), []);

  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    passengers: "1 Adult",
    travelDate: "",
    selectedSeat: "",
  });

  const handleChange = (e) => setFormData((s) => ({ ...s, [e.target.name]: e.target.value }));

  const handleBooking = async (e) => {
    e.preventDefault();
    if (!flight) return;
    if (!formData.selectedSeat) {
      alert("Please select a seat.");
      return;
    }

    try {
      const formattedDate = new Date(formData.travelDate).toISOString().split("T")[0];

      const bookingDetails = {
        fullName: formData.fullName,
        email: formData.email,
        passengers: formData.passengers,
        travelDate: formattedDate,
        seat: formData.selectedSeat || "Auto-Assigned",
        flightName: flight.airline,
        route: `${flight.from} → ${flight.to}`,
        amount: flight.price,
        status: "CONFIRMED",
      };

      await addFlightBooking(bookingDetails);

      localStorage.setItem("flightBooking", JSON.stringify({ ...bookingDetails, flight }));

      navigate(`/payment/${flight.id}`, { state: { bookingDetails, flight } });
    } catch (error) {
      console.error("❌ Booking failed:", error);
      alert("Something went wrong while saving your booking. Try again!");
    }
  };

  if (!flight) {
    return <h2 className="text-center text-light mt-5">⚠️ Flight not found! Please go back and try again.</h2>;
  }

  return (
    <div className="flight-booking">
      <div className="booking-container">
        {/* ✈️ Flight Info */}
        <div className="flight-summary" style={{ color: themeColor }}>
          <h2>{flight.airline} ✈️</h2>
          <p>{flight.from} → {flight.to}</p>
          <p><strong>₹{flight.price}</strong> | {flight.duration}</p>
        </div>

        {/* 💺 Seat Selection */}
        <div className="seat-selection">
          <h4 style={{ color: themeColor, textAlign: "center" }}>Choose Your Seat</h4>

          <div className="legend">
            <span className="legend-box available" /> Available
            <span className="legend-box selected" /> Selected
            <span className="legend-box blocked" /> Booked
          </div>

          <div className="seat-grid">
            {seatMap.map((seat) => {
              const isBlocked = blocked.has(seat);
              const isSelected = formData.selectedSeat === seat;
              return (
                <button
                  type="button"
                  key={seat}
                  className={`seat ${isBlocked ? "blocked" : ""} ${isSelected ? "selected" : ""}`}
                  disabled={isBlocked}
                  onClick={() => setFormData((s) => ({ ...s, selectedSeat: seat }))}
                  aria-label={`Seat ${seat}${isBlocked ? " (booked)" : isSelected ? " (selected)" : ""}`}
                >
                  {seat}
                </button>
              );
            })}
          </div>

          {formData.selectedSeat && (
            <p className="text-center mt-2">
              ✅ Selected Seat: <strong>{formData.selectedSeat}</strong>
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
            <select name="passengers" value={formData.passengers} onChange={handleChange}>
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
              style={{ background: themeColor, color: "#fff", boxShadow: `0 0 15px ${themeColor}88` }}
            >
              ✅ Confirm Booking & Continue to Payment
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
