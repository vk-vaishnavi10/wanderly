// src/pages/Register.jsx
import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./Register.css";
import { registerUser, sendOtp, verifyOtp } from "../services/api"; // ✅ API calls

export default function Register() {
  const [form, setForm] = useState({
    fullName: "",
    email: "",
    phone: "",
    password: "",
  });

  const [otp, setOtp] = useState("");
  const [otpSent, setOtpSent] = useState(false);
  const [mockOtp, setMockOtp] = useState(""); // 🌸 NEW: display mock OTP
  const [loading, setLoading] = useState(false);
  const [strength, setStrength] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  // ✅ Handle input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });

    // Password strength detector
    if (name === "password") {
      if (value.length < 8) setStrength("Weak 😐");
      else if (/[A-Z]/.test(value) && /\d/.test(value) && /[@$!%*?&]/.test(value))
        setStrength("Strong 💪");
      else setStrength("Medium 🙂");
    }
  };

  // ✅ Handle Register (Send OTP)
  const handleRegister = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const res = await sendOtp(form.phone); // Backend mock OTP API
      setOtpSent(true);

      // 🌸 Show message and mock OTP if available
      alert(res.data.message);
      if (res.data.otp) {
        setMockOtp(res.data.otp); // show OTP on screen for testing
        console.log("🧾 Mock OTP:", res.data.otp);
      }
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.error || "❌ Failed to send OTP. Try again.");
    }
    setLoading(false);
  };

  // ✅ Handle OTP Verification
  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await verifyOtp(form.phone, otp);
      await registerUser(form);
      alert("🎉 Registration successful!");
      navigate("/signin");
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.error || "❌ Invalid OTP or registration failed.");
    }
    setLoading(false);
  };

  return (
    <div className="register-container">
      <div className="register-card">
        <h2 className="register-title glow">📝 Register</h2>

        {error && <p className="error-msg">{error}</p>}

        {/* -------------------- STEP 1: USER INFO FORM -------------------- */}
        {!otpSent ? (
          <form onSubmit={handleRegister}>
            <input
              type="text"
              name="fullName"
              placeholder="Full Name"
              className="register-input"
              value={form.fullName}
              onChange={handleChange}
              required
            />
            <input
              type="email"
              name="email"
              placeholder="Email"
              className="register-input"
              value={form.email}
              onChange={handleChange}
              required
            />
            <input
              type="tel"
              name="phone"
              placeholder="Phone Number"
              className="register-input"
              value={form.phone}
              onChange={handleChange}
              required
              pattern="[0-9]{10}"
              title="Enter a valid 10-digit phone number"
            />
      <input
  type="password"
  name="password"
  placeholder="Password"
  className="register-input"
  value={form.password}
  onChange={handleChange}
  required
  minLength="4"
  title="Password must be at least 4 characters"
/>


            <p className="password-hint">
              ⚡ Password must have 8+ chars, 1 uppercase, 1 number & 1 special symbol.
            </p>
            {form.password && (
              <p className={`strength ${strength.toLowerCase()}`}>Strength: {strength}</p>
            )}

            <button type="submit" className="register-btn" disabled={loading}>
              {loading ? "Sending OTP..." : "Send OTP"}
            </button>
          </form>
        ) : (
          /* -------------------- STEP 2: OTP VERIFICATION -------------------- */
          <form onSubmit={handleVerifyOtp}>
            <p className="otp-text">Enter the 6-digit OTP sent to your phone:</p>
            <input
              type="text"
              maxLength="6"
              placeholder="Enter OTP"
              className="register-input otp-input"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              required
            />

            {/* 🌸 Show Mock OTP (for testing only) */}
            {mockOtp && (
              <p className="mock-otp-display">
                🔐 <strong>Mock OTP (for testing): {mockOtp}</strong>
              </p>
            )}

            <button type="submit" className="register-btn" disabled={loading}>
              {loading ? "Verifying..." : "Verify OTP"}
            </button>
          </form>
        )}

        <p className="register-footer">
          Already have an account? <Link to="/signin">Sign In</Link>
        </p>
      </div>
    </div>
  );
}
