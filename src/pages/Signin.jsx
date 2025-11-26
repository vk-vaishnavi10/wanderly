// 🌍 src/pages/Signin.jsx
import React, { useState, useEffect, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { UserContext } from "../context/UserContext";
import "./Signin.css";
import girl from "../assets/signin.png"; // <-- your chibi girl

const oceanVideo = "/videos/introbg.mp4";

export default function Signin() {
  const [wanderId, setWanderId] = useState("");
  const [password, setPassword] = useState("");
  const [showWelcome, setShowWelcome] = useState(false);
  const { login } = useContext(UserContext);
  const navigate = useNavigate();

  useEffect(() => {
    const navbar = document.querySelector(".vertical-navbar");
    if (navbar) {
      navbar.style.opacity = "0";
      navbar.style.pointerEvents = "none";
    }
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
      (savedUser.wanderId === wanderId.trim() ||
        savedUser.email === wanderId.trim() ||
        savedUser.phone === wanderId.trim()) &&
      savedUser.password === password.trim()
    ) {
      login(savedUser);
      setShowWelcome(true);
      setTimeout(() => navigate("/home"), 2500);
    } else {
      alert("Invalid credentials ❌");
    }
  };

  return (
    <div className="signin-page">
      <video autoPlay loop muted playsInline preload="auto" className="signin-bg-video">
        <source src={oceanVideo} type="video/mp4" />
      </video>

      {/* LEFT FORM CARD */}
      <div className="signin-overlay">
        <div className="signin-card">
          <h2 className="signin-title">
            <span className="emoji">🔐</span> Sign In
          </h2>

          <form onSubmit={handleSubmit}>
            <input
              type="text"
              className="signin-input"
              placeholder="Enter Wander ID / Email / Phone"
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

      {/* CHIBI GIRL + SPEECH BUBBLE */}
      <div className="signin-girl-wrapper">
        <img src={girl} alt="helper" className="signin-girl" />

        <div className="signin-bubble">
          ✨ Hey traveller, sign in to your account!
        </div>
      </div>

    </div>
  );
}
