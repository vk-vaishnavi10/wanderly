import React, { useState, useEffect } from "react";
import Swal from "sweetalert2";
import { useParams, useNavigate } from "react-router-dom";

import "./CarBooking.css";

// 🚘 Car Images
import sedanImg from "../images/sedan.webp";
import suvImg from "../images/suv.png";
import luxuryImg from "../images/luxurycar.webp";

export default function CarBooking() {
  const { id } = useParams();
  const navigate = useNavigate();

  // Map ID → Car Type
  const carMap = {
    1: "Sedan",
    2: "SUV",
    3: "Luxury",
  };

  const preSelectedCar = carMap[id] || "";

  const [formData, setFormData] = useState({
    pickupLocation: "",
    dropLocation: "",
    bookingDate: "",
    carType: preSelectedCar,
  });

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const getCarImage = () => {
    switch (formData.carType) {
      case "Sedan":
        return sedanImg;
      case "SUV":
        return suvImg;
      case "Luxury":
        return luxuryImg;
      default:
        return null;
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const { pickupLocation, dropLocation, bookingDate, carType } = formData;

    if (!pickupLocation || !dropLocation || !bookingDate) {
      Swal.fire("⚠️ Fill all fields!", "", "warning");
      return;
    }

    Swal.fire({
      title: "🚘 Booking Confirmed!",
      text: `Your ${carType} car is booked successfully!`,
      icon: "success",
      confirmButtonColor: "#ffce7a",
      background: "#15102b",
      color: "#ffffff",
    }).then(() =>
      navigate("/payment", {
        state: {
          paymentData: {
            type: "car",
            title: carType,
            price: 1500,
            details: formData,
          },
        },
      })
    );
  };

  return (
    <div className="car-booking">
      {/* 🌥️ CUTE CHUBBY CLOUD MASCOT (ᵔᴥᵔ) */}
      <div className="cloud-mascot">
        <div className="cloud-body">
          <div className="cloud-eye eye1"></div>
          <div className="cloud-eye eye2"></div>
          <div className="cloud-mouth"></div>
        </div>
        <div className="cloud-speech">
          Hello traveller! 💙<br />
          Ready to book your ride?
        </div>
      </div>

      <div className="car-booking-card">
        <h2>🚘 Car Booking</h2>
        <p>Book your perfect ride with comfort, class, and style ✨</p>

        {getCarImage() && (
          <div className="car-preview">
            <img
              src={getCarImage()}
              alt={formData.carType}
              className="selected-car-image"
            />
            <p className="car-preview-text">
              Selected Car: <strong>{formData.carType}</strong>
            </p>
          </div>
        )}

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

          <label>Car Type</label>
          <select name="carType" value={formData.carType} disabled>
            <option>{formData.carType}</option>
          </select>

          <button type="submit">Confirm Booking ✨</button>
        </form>

        {/* Back Button */}
        <button className="back-btn" onClick={() => navigate("/transport")}>
          ← Back to Transport
        </button>
      </div>
    </div>
  );
}
