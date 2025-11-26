// src/pages/DiningDetails.jsx

import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Swal from "sweetalert2";

import "./DiningDetails.css"; 
import CatMouseMascot from "../Components/CatMouseMascot";
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

  if (!restaurant) {
    return <h2 className="text-center text-warning mt-5">⚠️ Restaurant not found!</h2>;
  }

  const handleBooking = () => {
    if (!reservation.dateTime || reservation.pax < 1) {
      Swal.fire("⚠️ Please fill all fields correctly.", "", "warning");
      return;
    }

    Swal.fire({
      title: "🍽️ Reservation Confirmed!",
      text: `Table booked at ${restaurant.name}!`,
      icon: "success",
      background: "#0b0018",
      color: "#fff",
      confirmButtonColor: "#ffd47f",
    }).then(() =>
      navigate("/payment", {
        state: {
          paymentData: {
            type: "dining",
            title: restaurant.name,
            price: 1000, // you can change this later
            details: {
              restaurantName: restaurant.name,
              location: restaurant.location,
              pax: reservation.pax,
              dateTime: reservation.dateTime,
            },
          },
        },
      })
    );
  }

  return (
    <div className="dining-details container py-5">

      {/* ⭐ CSS MASCOT */}
      <CatMouseMascot />

      <div className="dining-hero-card mb-5">
        <img src={restaurant.img} className="dining-hero-img" alt="Dining" />

        <div className="dining-hero-info">
          <h2>{restaurant.name}</h2>
          <p className="text-muted">{restaurant.cuisine}</p>
          <p>{restaurant.desc}</p>
          <p>📍 {restaurant.location}</p>
          <p className="price-range">💰 {restaurant.priceRange}</p>
          <p className="rating">{restaurant.rating}</p>
        </div>
      </div>

      <div className="reservation-card p-4 rounded-4">
        <h3>🕓 Reserve Your Table</h3>

        <label className="form-label">🗓 Select Date & Time</label>
        <input
          type="datetime-local"
          className="form-control"
          value={reservation.dateTime}
          onChange={(e) => setReservation({ ...reservation, dateTime: e.target.value })}
        />

        <label className="form-label mt-3">👥 Number of Guests</label>
        <input
          type="number"
          min="1"
          className="form-control"
          value={reservation.pax}
          onChange={(e) => setReservation({ ...reservation, pax: e.target.value })}
        />

        <button className="confirm-btn w-100 mt-4" onClick={handleBooking}>
          🍷 Confirm Reservation
        </button>
      </div>

    </div>
  );
}
