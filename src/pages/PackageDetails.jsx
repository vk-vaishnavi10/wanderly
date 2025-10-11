// src/pages/PackageDetails.jsx
import React, { useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { addPackageBooking, addPackagePayment } from "../services/api.js";
import kashmirImg from "../images/kashmirparadise.jpg";
import sinImg from "../images/sin.avif";
import keralaImg from "../images/kerala.jpg";


// 📦 package data
const packagesData = [
  {
    id: 1,
    title: "Goa Beach Escape 🌴",
    description: "Flight + 3 Nights at 5⭐ Resort + Cab Transfers",
    price: "₹22,000/person",
    duration: "3 Nights / 4 Days",
    image:
      "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=800&q=80",
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
    title: "Jaipur Royal Getaway 🏰",
    description: "Flight + 2 Nights Heritage Hotel + Cab",
    price: "₹18,500/person",
    duration: "2 Nights / 3 Days",
    image:
      "https://images.unsplash.com/photo-1548013146-72479768bada?auto=format&fit=crop&w=800&q=80",
    inclusions: ["Flights", "Breakfast", "City Tour"],
  },
  {
    id: 4,
    title: "Hyderabad Heritage Tour 🕌",
    description: "Flight + 2 Nights in Hyderabad + City Cab",
    price: "₹15,000/person",
    duration: "2 Nights / 3 Days",
    image:
      "https://images.unsplash.com/photo-1603262110263-fb0112e7cc33?auto=format&fit=crop&w=800&q=80",
    inclusions: ["Flights", "Hotel Stay", "Charminar & Golconda Tour"],
  },
  {
    id: 5,
    title: "Kerala Backwaters Cruise 🚤",
    description: "Flight + 3 Nights in Houseboat + Cab",
    price: "₹28,000/person",
    duration: "3 Nights / 4 Days",
    image:
      keralaImg,
    inclusions: ["Flights", "Houseboat Stay", "Meals"],
  },
  {
    id: 6,
    title: "Maldives Luxury Escape 🌊",
    description: "Flight + 4 Nights Overwater Villa + Cab",
    price: "₹85,000/person",
    duration: "4 Nights / 5 Days",
    image:
      "https://images.unsplash.com/photo-1500375592092-40eb2168fd21?auto=format&fit=crop&w=800&q=80",
    inclusions: ["Flights", "Luxury Villa", "Private Cabana"],
  },
  {
    id: 7,
    title: "Singapore Family Fun 🎡",
    description: "Flight + 3 Nights Hotel + Universal Studios",
    price: "₹60,000/person",
    duration: "3 Nights / 4 Days",
    image:sinImg,
      
    inclusions: ["Flights", "Hotel", "Universal Studio Tickets"],
  },
  {
    id: 8,
    title: "Dubai Desert Adventure 🏜️",
    description: "Flight + 3 Nights in Dubai + Desert Safari",
    price: "₹55,000/person",
    duration: "3 Nights / 4 Days",
    image:
      "https://images.unsplash.com/photo-1509043759401-136742328bb3?auto=format&fit=crop&w=800&q=80",
    inclusions: ["Flights", "Hotel", "Desert Safari"],
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

    // Booking object matching backend entity fields
    const bookingPayload = {
      userName: formData.userName,
      email: formData.email,
      packageName: pkg.title,
      amount: amount,
      status: "CONFIRMED",
    };

    try {
      console.log("🟡 Sending booking:", bookingPayload);

      // Save booking in backend
      await addPackageBooking(bookingPayload);

      console.log("✅ Booking saved!");

      // Save payment in backend
      const paymentPayload = {
        userName: formData.userName,
        email: formData.email,
        packageName: pkg.title,
        amount: amount,
        status: "SUCCESS",
      };

      await addPackagePayment(paymentPayload);

      console.log("💰 Payment saved!");

      alert(`✅ Booking confirmed and payment saved for ${pkg.title}`);
      navigate("/packages");
    } catch (err) {
      console.error("❌ Booking or Payment failed:", err);
      alert("❌ Something went wrong while saving booking or payment.");
    }
  };

  return (
    <div
      className="container py-5"
      style={{ backgroundColor: "black", minHeight: "100vh" }}
    >
      <div
        className="card mx-auto shadow-lg border-0"
        style={{
          maxWidth: "800px",
          backgroundColor: "#111",
          color: "yellow",
        }}
      >
        <img
          src={pkg.image}
          alt={pkg.title}
          className="card-img-top"
          style={{ height: "300px", objectFit: "cover" }}
        />
        <div className="card-body">
          <h2>{pkg.title}</h2>
          <h5>{pkg.price}</h5>
          <p>{pkg.description}</p>
          <p>{pkg.duration}</p>
          <ul>
            {pkg.inclusions.map((item, idx) => (
              <li key={idx}>✅ {item}</li>
            ))}
          </ul>

          <h4 className="mt-4">📝 Book This Package</h4>
          <form className="mt-3" onSubmit={handleBooking}>
            <div className="mb-3">
              <label className="form-label">Full Name</label>
              <input
                name="userName"
                type="text"
                className="form-control"
                placeholder="Your name"
                value={formData.userName}
                onChange={handleChange}
              />
            </div>

            <div className="mb-3">
              <label className="form-label">Email</label>
              <input
                name="email"
                type="email"
                className="form-control"
                placeholder="Your email"
                value={formData.email}
                onChange={handleChange}
              />
            </div>

            <div className="mb-3">
              <label className="form-label">Phone</label>
              <input
                name="phone"
                type="tel"
                className="form-control"
                placeholder="Your phone number"
                value={formData.phone}
                onChange={handleChange}
              />
            </div>

            <div className="mb-3">
              <label className="form-label">Travel Date</label>
              <input
                name="date"
                type="date"
                className="form-control"
                value={formData.date}
                onChange={handleChange}
              />
            </div>

            <button
              type="submit"
              className="btn btn-warning fw-bold text-dark w-100"
            >
              💳 Confirm Booking & Pay
            </button>
          </form>
        </div>
      </div>

      <div className="text-center mt-4">
        <Link
          to="/packages"
          className="btn btn-outline-warning fw-bold text-light"
        >
          ← Back to Packages
        </Link>
      </div>
    </div>
  );
}
