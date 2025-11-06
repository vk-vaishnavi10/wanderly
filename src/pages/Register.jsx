import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./Register.css";
import forestVideo from "../assets/videos/travel-intro.mp4";

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
    if (!form.phone) return alert("Enter phone number first!");
    setOtpSent(true);
    alert("Mock OTP sent: 1234 ✅");
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (form.otp !== "1234") return alert("Invalid OTP");

    const wanderId = "WAND-" + Math.floor(100000 + Math.random() * 900000);
    const newUser = { ...form, wanderId };
    localStorage.setItem("registeredUser", JSON.stringify(newUser));

    alert(`✅ Registered Successfully! Your Wander ID: ${wanderId}`);
    setTimeout(() => navigate("/signin"), 1000);
  };

  return (
    <div className="register-page">
      {/* 🎥 Background Video */}
      <video autoPlay loop muted playsInline className="register-bg-video">
        <source src={forestVideo} type="video/mp4" />
      </video>

      {/* 🌈 Cinematic Overlay (flush-left) */}
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
              onChange={handleChange}
              required
            />
            <input
              type="email"
              name="email"
              placeholder="Email"
              onChange={handleChange}
              required
            />
            <input
              type="password"
              name="password"
              placeholder="Password"
              onChange={handleChange}
              required
            />
            <input
              type="tel"
              name="phone"
              placeholder="Phone Number"
              onChange={handleChange}
              required
            />

            <div className="otp-row">
              <input
                type="text"
                name="otp"
                placeholder="Enter OTP"
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
    </div>
  );
}

