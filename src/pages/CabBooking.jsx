// src/pages/CabBooking.jsx
import React, { useState, useEffect } from "react";
import Swal from "sweetalert2";
import { useParams, useNavigate } from "react-router-dom";

import "./CabBooking.css";

export default function CabBooking() {
  const { id } = useParams();
  const navigate = useNavigate();

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
    cabType: preSelectedCab,
  });

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);

  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!formData.pickupLocation || !formData.dropLocation || !formData.bookingDate) {
      Swal.fire("⚠️ Please fill all fields!", "", "warning");
      return;
    }

    Swal.fire({
      title: "🚖 Cab Booked!",
      text: `Your ${formData.cabType} cab is reserved!`,
      icon: "success",
      confirmButtonColor: "#ffe29f",
      background: "#15102b",
      color: "#ffffff",
    }).then(() =>
      navigate("/payment", {
        state: {
          paymentData: {
            type: "cab",
            title: formData.cabType,
            price: 800,
            details: formData,
          },
        },
      })
    );
  };

  return (
    <div className="cab-booking">

      {/* ☁ Floating Cloud Mascot */}
      <CloudMascot />

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

        {/* 🔙 Back Button */}
        <button className="back-transport-btn" onClick={() => navigate("/transport")}>
          ← Back to Transport
        </button>
      </div>
    </div>
  );
}

/* ☁ CLOUD MASCOT COMPONENT */
const CloudMascot = () => {
  return (
    <div className="cab-cloud-mascot">
      <div className="cloud">
        <div className="puff p1"></div>
        <div className="puff p2"></div>
        <div className="puff p3"></div>

        <div className="cloud-face">
          <div className="cloud-eye e1"></div>
          <div className="cloud-eye e2"></div>
          <div className="cloud-mouth"></div>
        </div>
      </div>

      <div className="cloud-speech">
        Hello traveller! ☁💙 <br />
        Need a cab today?
      </div>
    </div>
  );
};
