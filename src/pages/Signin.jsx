import React, { useState, useEffect, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { UserContext } from "../context/UserContext";
import "./Signin.css";
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
      navbar.style.transition = "opacity 0.6s ease";
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
      setTimeout(() => navigate("/home"), 2800);
    } else {
      alert("Invalid credentials ❌");
    }
  };

  return (
    <div className="signin-page">
      <video autoPlay loop muted playsInline preload="auto" className="signin-bg-video">
        <source src={oceanVideo} type="video/mp4" />
      </video>

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

      {showWelcome && (
        <div className="welcome-overlay">
          <div className="welcome-content">
            <h1>
              <span className="emoji">🌎</span> Welcome to <span>Wanderly</span>
            </h1>
            <p>
              Thanks for journeying with us, traveler <span className="emoji">✈️</span>
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
