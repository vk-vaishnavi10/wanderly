// src/pages/Register.jsx
import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./Register.css";

const forestVideo = "/videos/signupbg.mp4";

// 🐱 Transparent cat illustration
import registerCat from "../assets/cat.png";

export default function Register() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    fullName: "",
    email: "",
    password: "",
    phone: "",
    otp: "",
  });
  const [otpSent, setOtpSent] = useState(false);

  useEffect(() => {
    // 🫧 Hide vertical navbar while on this page
    const navbar = document.querySelector(".vertical-navbar");
    if (navbar) {
      navbar.style.opacity = "0";
      navbar.style.pointerEvents = "none";
      navbar.style.transition = "opacity 0.5s ease";
    }

    return () => {
      if (navbar) {
        navbar.style.opacity = "1";
        navbar.style.pointerEvents = "auto";
      }
    };
  }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const sendOtp = () => {
    if (!form.phone) {
      alert("Enter phone number first!");
      return;
    }

    // 🌟 Generate 4-digit random OTP
    const randomOtp = Math.floor(1000 + Math.random() * 9000).toString();
    setOtpSent(true);

    // Store mock OTP in localStorage so it can be verified
    localStorage.setItem("mockOtp", randomOtp);
    // Clear input so user types it manually
    setForm((prev) => ({ ...prev, otp: "" }));

    alert(`📩 Mock OTP sent: ${randomOtp}`);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const savedOtp = localStorage.getItem("mockOtp");
    if (!savedOtp || form.otp !== savedOtp) {
      alert("❌ Invalid OTP");
      return;
    }

    const wanderId = "WAND-" + Math.floor(100000 + Math.random() * 900000);
    const newUser = { ...form, wanderId };
    localStorage.setItem("registeredUser", JSON.stringify(newUser));

    alert(`✅ Registered Successfully! Your Wander ID: ${wanderId}`);
    setTimeout(() => navigate("/signin"), 1000);
  };

  return (
    <div className="register-page">
      {/* 🎥 Background Video */}
      <video
        autoPlay
        loop
        muted
        playsInline
        preload="auto"
        className="register-bg-video"
      >
        <source src={forestVideo} type="video/mp4" />
        Your browser does not support the video tag.
      </video>

      {/* 🌈 Cinematic Overlay (form area) */}
      <div className="register-overlay">
        <div className="register-card">
          <h1 className="register-title">
            Create Your <span>Wanderly</span> Account
          </h1>

          <form onSubmit={handleSubmit}>
            <input
              type="text"
              name="fullName"
              placeholder="Full Name"
              value={form.fullName}
              onChange={handleChange}
              required
            />
            <input
              type="email"
              name="email"
              placeholder="Email"
              value={form.email}
              onChange={handleChange}
              required
            />
            <input
              type="password"
              name="password"
              placeholder="Password"
              value={form.password}
              onChange={handleChange}
              required
            />
            <input
              type="tel"
              name="phone"
              placeholder="Phone Number"
              value={form.phone}
              onChange={handleChange}
              required
            />

            <div className="otp-row">
              <input
                type="text"
                name="otp"
                placeholder="Enter OTP"
                value={form.otp}
                onChange={handleChange}
                required
              />
              <button
                type="button"
                className="otp-btn"
                onClick={sendOtp}
                disabled={otpSent}
              >
                {otpSent ? "Sent ✅" : "Send OTP"}
              </button>
            </div>

            <button type="submit" className="wander-btn">
              Register ✨
            </button>

            {/* 🌟 Sign-In Redirect */}
            <p className="register-footer">
              Already have a Wanderly account?{" "}
              <Link to="/signin" className="signin-link">
                Sign In
              </Link>
            </p>
          </form>
        </div>
      </div>

      {/* 🐱✨ Cute transparent cat helper */}
      <div className="register-cat-illustration">
        <img
          src={registerCat}
          alt="Wanderly cat assistant"
          className="register-cat-image"
        />
        <div className="register-cat-bubble">
          Hi traveller! I&apos;ll help you
          <br />
          sign up 💜
        </div>
      </div>
    </div>
  );
}
