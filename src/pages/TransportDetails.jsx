import React, { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Swal from "sweetalert2";
import { addTransportBooking } from "../services/api";
import "./Transport.css";

export default function TransportDetails() {
  const navigate = useNavigate();
  const { id } = useParams();

  // ✅ Form Data
  const [form, setForm] = useState({
    email: "",
    pickup: "",
    drop: "",
    bookingDate: "",
    carType: "",
  });

  // ✅ Handle Input Changes
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // ✅ Handle Booking
  const handleBooking = async () => {
    if (!form.email || !form.pickup || !form.drop || !form.bookingDate || !form.carType) {
      Swal.fire("⚠️ Missing Info", "Please fill all the fields before booking!", "warning");
      return;
    }

    try {
      // ✅ Payload for backend
      const payload = {
        user: { id: 1 },                      // demo user
        transport: { id: parseInt(id) },      // car or cab id
        seats: 1,
        bookingDate: form.bookingDate,        // use "datetime-local" field
        pickupLocation: form.pickup,
        dropLocation: form.drop,
        carType: form.carType,
      };
      

      console.log("📤 Sending transport booking:", payload);
      await addTransportBooking(payload);

      // ✅ Success Message
      Swal.fire({
        title: "🚗 Booking Confirmed!",
        text: `Your ${form.carType} has been booked successfully!`,
        icon: "success",
        confirmButtonColor: "#f5c518",
        background: "#111",
        color: "#fff",
      }).then(() => navigate("/transport"));
    } catch (error) {
      console.error("❌ Booking failed:", error.response?.data || error.message);
      Swal.fire("❌ Error", "Unable to confirm your booking. Try again!", "error");
    }
  };

  return (
    <div className="container text-light py-5 transport-booking-page">
      <div className="card bg-dark border-warning shadow-lg p-4 mx-auto" style={{ maxWidth: "500px" }}>
        <h2 className="text-warning text-center mb-4">🚖 Confirm Your Ride</h2>

        <div className="mb-3">
          <label className="form-label text-warning">Email</label>
          <input
            type="email"
            name="email"
            placeholder="Enter your email"
            className="form-control bg-dark text-light border-warning"
            value={form.email}
            onChange={handleChange}
          />
        </div>

        <div className="mb-3">
          <label className="form-label text-warning">Pickup Location</label>
          <input
            type="text"
            name="pickup"
            placeholder="Enter pickup location"
            className="form-control bg-dark text-light border-warning"
            value={form.pickup}
            onChange={handleChange}
          />
        </div>

        <div className="mb-3">
          <label className="form-label text-warning">Drop Location</label>
          <input
            type="text"
            name="drop"
            placeholder="Enter drop location"
            className="form-control bg-dark text-light border-warning"
            value={form.drop}
            onChange={handleChange}
          />
        </div>

        <div className="mb-3">
          <label className="form-label text-warning">Booking Date</label>
          <input
            type="datetime-local"
            name="bookingDate"
            className="form-control bg-dark text-light border-warning"
            value={form.bookingDate}
            onChange={handleChange}
          />
        </div>

        <div className="mb-4">
          <label className="form-label text-warning">Car Type</label>
          <select
            name="carType"
            className="form-select bg-dark text-light border-warning"
            value={form.carType}
            onChange={handleChange}
          >
            <option value="">Select Car</option>
            <option value="Sedan">Sedan</option>
            <option value="SUV">SUV</option>
            <option value="Luxury">Luxury</option>
          </select>
        </div>

        <button className="btn btn-warning w-100 fw-bold" onClick={handleBooking}>
          Confirm Booking 🚀
        </button>
      </div>
    </div>
  );
}
