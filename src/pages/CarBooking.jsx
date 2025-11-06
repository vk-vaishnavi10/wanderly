import React, { useState, useEffect } from "react";
import Swal from "sweetalert2";
import { useParams, useNavigate } from "react-router-dom";
import { addTransportBooking } from "../services/api";
import "./CarBooking.css";

// 🚘 Car Images
import sedanImg from "../images/sedan.webp";
import suvImg from "../images/suv.png";
import luxuryImg from "../images/luxurycar.webp";

export default function CarBooking() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    pickupLocation: "",
    dropLocation: "",
    bookingDate: "",
    carType: "",
  });

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
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

    if (!pickupLocation || !dropLocation || !bookingDate || !carType) {
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
        carType,
      };

      await addTransportBooking(payload);

      Swal.fire({
        title: "✅ Booking Confirmed!",
        text: `Your ${carType} car has been successfully booked!`,
        icon: "success",
        confirmButtonColor: "#ffce7a",
        background: "#15102b",
        color: "#ffffff",
      }).then(() => navigate("/transport"));
    } catch (error) {
      Swal.fire("❌ Error", "Unable to save booking. Try again!", "error");
    }
  };

  return (
    <div className="car-booking">
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
              Selected Car Type: <strong>{formData.carType}</strong>
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
          <select
            name="carType"
            value={formData.carType}
            onChange={handleChange}
            required
          >
            <option value="">Select Car</option>
            <option value="Sedan">Sedan</option>
            <option value="SUV">SUV</option>
            <option value="Luxury">Luxury</option>
          </select>

          <button type="submit">Confirm Booking ✨</button>
        </form>
      </div>
    </div>
  );
}
