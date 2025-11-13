import React, { useState, useEffect } from "react";
import Swal from "sweetalert2";
import { useParams, useNavigate } from "react-router-dom";

import "./CabBooking.css";

export default function CabBooking() {
  const { id } = useParams();
  const navigate = useNavigate();

  // ⭐ Map Transport ID → Cab Type
  const cabMap = {
    1: "Airport",
    2: "Local",
    3: "Outstation",
  };

  const preSelectedCab = cabMap[id] || "";

  const [formData, setFormData] = useState({
    pickupLocation: "",
    dropLocation: "",
    bookingDate: "",
    cabType: preSelectedCab, // ⭐ AUTO-FILL
  });

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const { pickupLocation, dropLocation, bookingDate, cabType } = formData;

    if (!pickupLocation || !dropLocation || !bookingDate) {
      Swal.fire("⚠️ Please fill all fields!", "", "warning");
      return;
    }

    try {
      Swal.fire({
        title: "🚖 Cab Booked!",
        text: `Your ${cabType} cab is reserved!`,
        icon: "success",
        confirmButtonColor: "#ffe29f",
        background: "#15102b",
        color: "#ffffff",
      }).then(() =>
        navigate("/payment", {
          state: {
            paymentData: {
              type: "cab",
              title: cabType,
              price: 800,
              details: formData,
            },
          },
        })
      );
    } catch (error) {
      Swal.fire("❌ Error", "Cab booking failed!", "error");
    }
  };

  return (
    <div className="cab-booking">
      <div className="cab-booking-card">
        <h2>🚖 Cab Booking</h2>
        <p>Book your comfortable, quick, and safe ride with Wanderly ✨</p>

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
          <select name="cabType" value={formData.cabType} disabled>
            <option>{formData.cabType}</option>
          </select>

          <button type="submit">Confirm Booking ✨</button>
        </form>
      </div>
    </div>
  );
}
