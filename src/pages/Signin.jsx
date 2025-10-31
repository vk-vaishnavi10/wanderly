// src/pages/Signin.jsx
import React, { useState, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { UserContext } from "../context/UserContext"; // ✅ import context
import "./Signin.css";

export default function Signin() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { login } = useContext(UserContext); // ✅ access login() from context
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();

    if (email && password) {
      // ✅ Mock user data (for now)
      const userData = {
        fullName: "Kavanoor Vaishnavi",
        email: email,
        phone: "9390681891",
      };

      // ✅ Save in global context (auto-updates navbar)
      login(userData);

      // ✅ Redirect to Home
      navigate("/");
    } else {
      alert("Please enter email and password");
    }
  };

  return (
    <div className="signin-container">
      <div className="signin-card">
        <h2 className="signin-title">🔒 Sign In</h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <input
              type="email"
              className="form-control"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div className="mb-3">
            <input
              type="password"
              className="form-control"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <button type="submit" className="signin-btn">
            Sign In
          </button>
        </form>
        <p className="mt-3 text-light">
          Don’t have an account?{" "}
          <Link to="/register" className="text-warning fw-bold">
            Register
          </Link>
        </p>
      </div>
    </div>
  );
}
