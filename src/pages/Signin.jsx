import React, { useState, useEffect, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { UserContext } from "../context/UserContext";
import "./Signin.css";
import oceanVideo from "../assets/videos/signbg.mp4"; // 🌊 your cinematic background

export default function Signin() {
  const [wanderId, setWanderId] = useState("");
  const [password, setPassword] = useState("");
  const { login } = useContext(UserContext);
  const navigate = useNavigate();

  useEffect(() => {
    // 🫧 Smoothly hide navbar
    const navbar = document.querySelector(".vertical-navbar");
    if (navbar) {
      navbar.style.opacity = "0";
      navbar.style.pointerEvents = "none";
      navbar.style.transition = "opacity 0.6s ease";
    }

    // Restore navbar on leaving page
    return () => {
      if (navbar) {
        navbar.style.opacity = "1";
        navbar.style.pointerEvents = "auto";
      }
    };
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();

    const savedUser = JSON.parse(localStorage.getItem("registeredUser"));
    if (!savedUser) {
      alert("No user found. Please register first.");
      return;
    }

    if (
      savedUser.wanderId === wanderId.trim() &&
      savedUser.password === password.trim()
    ) {
      login(savedUser);
      navigate("/home");
    } else {
      alert("Invalid Wander ID or Password ❌");
    }
  };

  return (
    <div className="signin-page">
      {/* 🌊 Background Video */}
      <video autoPlay loop muted playsInline className="signin-bg-video">
        <source src={oceanVideo} type="video/mp4" />
      </video>

      {/* 💎 Glass Overlay Left Panel */}
      <div className="signin-overlay">
        <div className="signin-card">
          <h2 className="signin-title">🔐 Sign In</h2>

          <form onSubmit={handleSubmit}>
            <input
              type="text"
              className="signin-input"
              placeholder="Enter Wander ID"
              value={wanderId}
              onChange={(e) => setWanderId(e.target.value)}
              required
            />
            <input
              type="password"
              className="signin-input"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />

            <button type="submit" className="signin-btn">
              Sign In
            </button>

            <p className="signin-footer">
              Don’t have an account?{" "}
              <Link to="/register" className="signin-link">
                Register
              </Link>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
}
