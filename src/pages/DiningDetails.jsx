import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import { addDiningReservation } from "../services/api";
import "./Dining.css";
import stImg from "../images/st.jpeg";

const diningDetails = {
  1: {
    name: "The Royal Feast",
    cuisine: "Multi-Cuisine Luxury",
    img: "https://images.unsplash.com/photo-1550966871-3ed3cdb5ed0c?w=1000",
    desc: "Enjoy fine dining with a royal ambience and exquisite international cuisines.",
    location: "Taj Palace, Mumbai",
    priceRange: "₹2000–₹4000 per person",
    rating: "⭐ 4.8 / 5",
  },
  2: {
    name: "Bean & Brew Café",
    cuisine: "Local Coffee & Pastries",
    img: "https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=1000",
    desc: "A cozy café serving artisanal coffees and freshly baked treats.",
    location: "Brigade Road, Bangalore",
    priceRange: "₹500–₹1200 per person",
    rating: "⭐ 4.6 / 5",
  },
  3: {
    name: "Spice Street",
    cuisine: "Authentic Indian Street Food",
    img: stImg,
    desc: "Indulge in flavorful chaats, kebabs, and sweets in a lively atmosphere.",
    location: "Chandni Chowk, Delhi",
    priceRange: "₹300–₹800 per person",
    rating: "⭐ 4.7 / 5",
  },
};

export default function DiningDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const restaurant = diningDetails[id];

  const [reservation, setReservation] = useState({
    dateTime: "",
    pax: 2,
  });

  const [countdown, setCountdown] = useState(0);

  // 🕒 Countdown animation for confirmation button
  useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [countdown]);

  const handleBooking = async () => {
    if (!reservation.dateTime || reservation.pax < 1) {
      Swal.fire("⚠️ Missing Info", "Please select a valid date & number of guests.", "warning");
      return;
    }

    const chosenDate = new Date(reservation.dateTime);
    if (isNaN(chosenDate.getTime()) || chosenDate < new Date()) {
      Swal.fire("⚠️ Invalid Date", "Please choose a valid future date.", "warning");
      return;
    }

    try {
      const payload = {
        user: { id: 1 },
        dining: { id: parseInt(id) },
        reservationTime: reservation.dateTime,
        pax: parseInt(reservation.pax),
      };

      console.log("📤 Sending Reservation:", payload);
      await addDiningReservation(payload);

      Swal.fire({
        title: "🎉 Reservation Confirmed!",
        text: `Your table at ${restaurant.name} is booked successfully!`,
        icon: "success",
        confirmButtonColor: "#f5c518",
        background: "#111",
        color: "#fff",
      }).then(() => navigate("/dining"));

      setCountdown(5); // start timer after confirmation
      setReservation({ dateTime: "", pax: 2 });
    } catch (error) {
      console.error("❌ Booking failed:", error.response?.data || error.message);
      Swal.fire("❌ Error", "Unable to save reservation. Try again!", "error");
    }
  };

  if (!restaurant) {
    return <h2 className="text-center text-warning mt-5">⚠️ Restaurant not found!</h2>;
  }

  return (
    <div className="container py-5 dining-details text-light">
      {/* 🏙️ Hero Section */}
      <div className="dining-hero-card mb-5">
        <img src={restaurant.img} alt={restaurant.name} className="dining-hero-img" />

        <div className="dining-hero-info">
          <h2>{restaurant.name}</h2>
          <p className="text-muted">{restaurant.cuisine}</p>
          <p>{restaurant.desc}</p>
          <p>📍 {restaurant.location}</p>
          <p className="price-range">💰 {restaurant.priceRange}</p>
          <p className="rating">{restaurant.rating}</p>
        </div>
      </div>

      {/* 🗓 Reservation Form */}
      <div className="card bg-dark border-warning shadow-lg p-4 rounded-4">
        <h3 className="text-warning mb-3">🕓 Reserve Your Table</h3>

        <label className="form-label text-warning mt-2">🗓 Select Date & Time</label>
        <input
          type="datetime-local"
          className="form-control bg-dark text-light border-warning"
          value={reservation.dateTime}
          onChange={(e) =>
            setReservation({ ...reservation, dateTime: e.target.value })
          }
        />

        <label className="form-label text-warning mt-3">👥 Number of Guests</label>
        <input
          type="number"
          className="form-control bg-dark text-light border-warning"
          min="1"
          value={reservation.pax}
          onChange={(e) => setReservation({ ...reservation, pax: e.target.value })}
        />

        <button
          className="btn btn-warning fw-bold w-100 mt-4 py-2 confirm-btn"
          onClick={handleBooking}
        >
          Confirm Reservation 🍷
        </button>

        {countdown > 0 && (
          <p className="countdown text-center mt-3">
            ⏳ Redirecting in {countdown}s...
          </p>
        )}
      </div>
    </div>
  );
}
