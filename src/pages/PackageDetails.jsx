// src/pages/PackageDetails.jsx
import React, { useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
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
    image:
      "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1200&q=80",
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

  const handleBooking = (e) => {
    e.preventDefault();

    if (!formData.userName || !formData.email || !formData.date) {
      Swal.fire("⚠️ Please fill all required fields!", "", "warning");
      return;
    }

    const amount = Number(
      String(pkg.price).replace(/[₹,]/g, "").split("/")[0]
    );

    Swal.fire({
      title: `🎉 Booking Confirmed for ${pkg.title}!`,
      icon: "success",
      background: "#111",
      color: "#fff",
      confirmButtonColor: "#f5c518",
    }).then(() => {
      navigate("/payment", {
        state: {
          paymentData: {
            type: "package",
            title: pkg.title,
            price: amount,
            duration: pkg.duration,
            details: formData,
          },
        },
      });
    });
  };

  return (
    <div className="package-details-page">
      {/* ☁️ MANY CLOUD MASCOTS */}
      <CloudMascots />

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

/* ☁️ MANY CLOUD MASCOTS WITH FACES + BUBBLES */
const CloudMascots = () => {
  const bubbles = [
    "Hi traveller! ✨ Book your package 💜",
    "Ready for a snowy escape? ❄️",
    "Adventure is calling! 🌍",
    "Let’s lock your dream trip ✈️",
    "Memories are waiting, book now 💫",
  ];

  return (
    <div className="pkg-cloud-layer" aria-hidden="true">
      {bubbles.map((text, idx) => (
        <div key={idx} className={`pkg-cloud-mascot m${idx + 1}`}>
          <div className="pkg-cloud">
            <div className="puff p1" />
            <div className="puff p2" />
            <div className="puff p3" />
            <div className="pkg-cloud-face">
              <div className="pkg-cloud-eye e1" />
              <div className="pkg-cloud-eye e2" />
              <div className="pkg-cloud-mouth" />
            </div>
          </div>

          <div className="pkg-cloud-bubble">{text}</div>
        </div>
      ))}
    </div>
  );
};
