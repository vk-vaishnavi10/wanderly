// src/pages/PackageDetails.jsx
import React, { useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { addPackageBooking, addPackagePayment } from "../services/api.js";
import "./PackageDetails.css";

import kashmirImg from "../images/kashmirparadise.jpg";
import sinImg from "../images/sin.avif";
import keralaImg from "../images/kerala.jpg";

const packagesData = [
  {
    id: 1,
    title: "Goa Beach Escape 🌴",
    description: "Flight + 3 Nights at 5⭐ Resort + Cab Transfers",
    price: "₹22,000/person",
    duration: "3 Nights / 4 Days",
    image: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=800&q=80",
    inclusions: ["Roundtrip Flights", "Breakfast", "Airport Pickup"],
  },
  {
    id: 2,
    title: "Kashmir Paradise ❄️",
    description: "Flight + 4 Nights in Srinagar & Gulmarg + Cab",
    price: "₹35,000/person",
    duration: "4 Nights / 5 Days",
    image: kashmirImg,
    inclusions: ["Flights", "Deluxe Hotels", "Sightseeing Tours"],
  },
  {
    id: 3,
    title: "Kerala Backwaters Cruise 🚤",
    description: "Flight + 3 Nights in Houseboat + Cab",
    price: "₹28,000/person",
    duration: "3 Nights / 4 Days",
    image: keralaImg,
    inclusions: ["Flights", "Houseboat Stay", "Meals"],
  },
  {
    id: 4,
    title: "Singapore Family Fun 🎡",
    description: "Flight + 3 Nights Hotel + Universal Studios",
    price: "₹60,000/person",
    duration: "3 Nights / 4 Days",
    image: sinImg,
    inclusions: ["Flights", "Hotel", "Universal Studio Tickets"],
  },
];

export default function PackageDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const pkg = packagesData.find((p) => p.id.toString() === id);

  const [formData, setFormData] = useState({
    userName: "",
    email: "",
    phone: "",
    date: "",
  });

  if (!pkg) {
    return (
      <div className="container text-center py-5 text-light">
        <h2>Package Not Found 😢</h2>
        <Link to="/packages" className="btn btn-warning mt-3 fw-bold">
          Back to Packages
        </Link>
      </div>
    );
  }

  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const parsePriceNumber = (priceStr) =>
    Number(priceStr.replace(/[₹,]/g, "").split("/")[0]);

  const handleBooking = async (e) => {
    e.preventDefault();

    if (!formData.userName || !formData.email || !formData.date) {
      alert("⚠️ Please fill all required fields!");
      return;
    }

    const amount = parsePriceNumber(pkg.price);

    const bookingPayload = {
      userName: formData.userName,
      email: formData.email,
      packageName: pkg.title,
      amount: amount,
      status: "CONFIRMED",
    };

    try {
      await addPackageBooking(bookingPayload);
      await addPackagePayment({
        ...bookingPayload,
        status: "SUCCESS",
      });

      alert(`✅ Booking confirmed for ${pkg.title}`);
      navigate("/payment", {
        state: {
          paymentData: {
            type: "package",
            title: pkg.title,
            price: pkg.price,
            details: formData
          }
        }
      });
      
    } catch (err) {
      console.error("❌ Error:", err);
      alert("Something went wrong during booking.");
    }
  };

  return (
    <div className="package-details-page">
      <div className="aurora-bg"></div>
      <div className="container py-5">
        <div className="card package-card mx-auto shadow-lg">
          <img src={pkg.image} alt={pkg.title} className="card-img-top" />
          <div className="card-body text-center">
            <h2 className="package-title">🌍 {pkg.title}</h2>
            <h4 className="package-price">{pkg.price}</h4>
            <p className="package-description">{pkg.description}</p>
            <p className="package-duration">🕓 {pkg.duration}</p>
            <ul className="inclusions-list">
              {pkg.inclusions.map((item, idx) => (
                <li key={idx}>✨ {item}</li>
              ))}
            </ul>

            <h4 className="book-title">🧾 Book This Package</h4>
            <form className="booking-form" onSubmit={handleBooking}>
              <input
                name="userName"
                type="text"
                placeholder="Full Name"
                value={formData.userName}
                onChange={handleChange}
              />
              <input
                name="email"
                type="email"
                placeholder="Email"
                value={formData.email}
                onChange={handleChange}
              />
              <input
                name="phone"
                type="tel"
                placeholder="Phone Number"
                value={formData.phone}
                onChange={handleChange}
              />
              <input
                name="date"
                type="date"
                value={formData.date}
                onChange={handleChange}
              />
              <button type="submit">💳 Confirm Booking & Pay</button>
            </form>
          </div>
        </div>

        <div className="text-center mt-4">
          <Link to="/packages" className="back-btn">
            ← Back to Packages
          </Link>
        </div>
      </div>
    </div>
  );
}
