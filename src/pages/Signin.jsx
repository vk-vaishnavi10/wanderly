import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./Signin.css";

export default function Signin() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();

    if (email && password) {
      // ✅ Save fake user to localStorage (temporary login)
      localStorage.setItem("user", JSON.stringify({ email }));

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
