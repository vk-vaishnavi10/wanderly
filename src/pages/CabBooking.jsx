import React, { useState } from "react";
import Swal from "sweetalert2";
import { useParams, useNavigate } from "react-router-dom";
import { addTransportBooking } from "../services/api";
import "./CabBooking.css";

export default function CabBooking() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    pickupLocation: "",
    dropLocation: "",
    bookingDate: "",
    cabType: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const { pickupLocation, dropLocation, bookingDate, cabType } = formData;

    if (!pickupLocation || !dropLocation || !bookingDate || !cabType) {
      Swal.fire("⚠️ Missing Info", "Please fill all the fields!", "warning");
      return;
    }

    try {
      const payload = {
        user: { id: 1 },
        transport: { id: parseInt(id) },
        seats: 1,
        bookingDate: bookingDate + "T00:00:00",
        pickupLocation,
        dropLocation,
        cabType,
      };

      console.log("📤 Sending cab booking:", payload);
      await addTransportBooking(payload);

      Swal.fire({
        title: "🚕 Cab Booked!",
        text: `Your ${cabType} cab has been successfully reserved!`,
        icon: "success",
        confirmButtonColor: "#f5c518",
        background: "#111",
        color: "#fff",
      }).then(() => navigate("/transport"));
    } catch (error) {
      console.error("❌ Cab booking failed:", error.response?.data || error.message);
      Swal.fire("❌ Error", "Unable to save booking. Try again!", "error");
    }
  };

  return (
    <div className="cab-booking">
      <div className="cab-booking-card">
        <h2>🚕 Cab Booking</h2>
        <p>Quick, reliable, and comfortable rides to your destination!</p>

        <form onSubmit={handleSubmit}>
          <label>Pickup Location</label>
          <input
            type="text"
            name="pickupLocation"
            value={formData.pickupLocation}
            onChange={handleChange}
            placeholder="Enter pickup location"
            required
          />

          <label>Drop Location</label>
          <input
            type="text"
            name="dropLocation"
            value={formData.dropLocation}
            onChange={handleChange}
            placeholder="Enter drop location"
            required
          />

          <label>Booking Date</label>
          <input
            type="date"
            name="bookingDate"
            value={formData.bookingDate}
            onChange={handleChange}
            required
          />

          <label>Cab Type</label>
          <select
            name="cabType"
            value={formData.cabType}
            onChange={handleChange}
            required
          >
            <option value="">Select Cab</option>
            <option value="Airport">Airport Cab</option>
            <option value="Local">Local Ride</option>
            <option value="Outstation">Outstation</option>
          </select>

          <button type="submit">Confirm Booking 🚕</button>
        </form>
      </div>
    </div>
  );
}
