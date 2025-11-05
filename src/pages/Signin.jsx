// src/pages/Signin.jsx
import React, { useState, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { UserContext } from "../context/UserContext";
import "./Signin.css";

export default function Signin() {
  const [wanderId, setWanderId] = useState("");
  const [password, setPassword] = useState("");
  const { login } = useContext(UserContext);
  const navigate = useNavigate();

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
      alert("Invalid Wander ID or Password");
    }
  };

  return (
    <div className="signin-container">
      <div className="signin-card">
        <h2 className="signin-title">🔐 Sign In</h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <input
              type="text"
              className="form-control"
              placeholder="Enter Wander ID"
              value={wanderId}
              onChange={(e) => setWanderId(e.target.value)}
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
