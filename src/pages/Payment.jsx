// ✅ src/pages/Payment.jsx
import React, { useEffect, useState } from "react";
import { useNavigate, useLocation, useParams } from "react-router-dom";
import "./Payment.css";
import qrImg from "../images/qr.png";
import { getFlightById, addPayment } from "../services/api";

export default function Payment() {
  const { id } = useParams();
  const [method, setMethod] = useState("card");
  const [bank, setBank] = useState("");
  const [step, setStep] = useState(1);
  const [flight, setFlight] = useState(null);
  const [loading, setLoading] = useState(true);
  const [bookingDetails, setBookingDetails] = useState(null);
  const navigate = useNavigate();
  const location = useLocation();

  // 🧩 Mock OTP States
  const [phone, setPhone] = useState("");
  const [otp, setOtp] = useState("");
  const [generatedOtp, setGeneratedOtp] = useState("");
  const [otpSent, setOtpSent] = useState(false);

  // ✅ Load flight + booking details
  useEffect(() => {
    const flightData = location.state?.flight || location.state?.bookingDetails?.flight;
    const bookingData =
      location.state?.bookingDetails || JSON.parse(localStorage.getItem("flightBooking"));

    if (bookingData) setBookingDetails(bookingData);

    if (flightData) {
      setFlight(flightData);
      setLoading(false);
    } else if (id) {
      getFlightById(id)
        .then((res) => setFlight(res.data))
        .catch((err) => console.error("❌ Fetch failed:", err))
        .finally(() => setLoading(false));
    } else {
      setLoading(false);
    }
  }, [id, location.state]);

  // ✅ Handle Payment Submission
  const handlePayment = async (e) => {
    e.preventDefault();
    if (!flight) {
      alert("Flight details are missing!");
      return;
    }

    try {
      // 🔹 Clean numeric amount
      const numericAmount = parseFloat(flight.price?.toString().replace(/[₹,]/g, ""));

      // 🔹 Prepare JSON payload
      const paymentData = {
        userName: bookingDetails?.fullName?.trim() || "Guest",
        email: bookingDetails?.email?.trim() || "unknown@example.com",
        flightName: flight.airline || flight.flightName || "Unknown Flight",
        route: `${flight.fromCity || flight.from} → ${flight.toCity || flight.to}`,
        amount: numericAmount || 0,
        status: "SUCCESS",
      };

      console.log("🟡 Sending paymentData:", paymentData);

      // ✅ Send to backend
      const res = await addPayment(paymentData);
      console.log("✅ Payment saved:", res.data);

      // ✅ Clear temp data and redirect
      localStorage.removeItem("flightBooking");
      navigate("/payment/success", { state: { flight, bookingDetails } });
    } catch (err) {
      console.error("❌ Payment failed:", err.response?.data || err.message);
      alert("Something went wrong while processing payment!");
    }
  };

  // 🔹 Mock OTP Sender
  const handleSendOtp = () => {
    if (!phone) {
      alert("Please enter your phone number first!");
      return;
    }
    const otpValue = Math.floor(100000 + Math.random() * 900000).toString(); // random 6-digit OTP
    setGeneratedOtp(otpValue);
    setOtpSent(true);
    alert(`📱 OTP sent successfully! (Mock OTP: ${otpValue})`);
  };

  // 🔹 OTP Verifier
  const handleVerifyOtp = () => {
    if (otp === generatedOtp) {
      alert("✅ OTP Verified Successfully!");
      handlePayment(new Event("submit"));
    } else {
      alert("❌ Invalid OTP, please try again!");
    }
  };

  // 🕓 Loader
  if (loading)
    return (
      <div className="payment-page text-center text-light mt-5">
        ⏳ Loading payment details...
      </div>
    );

  // 🧾 UI
  return (
    <div className="payment-page text-light" style={{ minHeight: "90vh" }}>
      <div
        className="payment-card"
        style={{
          background: "#000",
          border: "2px solid #FFD700",
          borderRadius: "12px",
          boxShadow: "0 0 25px rgba(255, 215, 0, 0.3)",
          padding: "2rem",
          margin: "3rem auto",
          maxWidth: "550px",
        }}
      >
        <h2 style={{ color: "#FFD700", textAlign: "center" }}>💳 Payment</h2>
        <hr style={{ borderColor: "#FFD700" }} />

        {flight ? (
          <>
            {/* ✈️ Flight Info */}
            <div className="flight-summary text-center mb-3">
              <p>
                ✈️ <strong>{flight.airline}</strong> —{" "}
                {flight.fromCity || flight.from} → {flight.toCity || flight.to}
              </p>
              <p>
                💰 <strong>₹{flight.price}</strong> | ⏱ Duration:{" "}
                {flight.duration || "N/A"}
              </p>
            </div>

            {/* 🧾 Booking Info */}
            {bookingDetails && (
              <div
                className="booking-info text-light text-center mb-3"
                style={{
                  border: "1px solid #FFD700",
                  borderRadius: "8px",
                  padding: "10px",
                  background: "#111",
                }}
              >
                <p>👤 {bookingDetails.fullName}</p>
                <p>📧 {bookingDetails.email}</p>
                <p>👥 {bookingDetails.passengers}</p>
                <p>📅 {bookingDetails.travelDate}</p>
              </div>
            )}

            {/* 💰 Payment Methods */}
            <div className="payment-methods">
              <label>
                <input
                  type="radio"
                  value="card"
                  checked={method === "card"}
                  onChange={() => setMethod("card")}
                />{" "}
                💳 Debit / Credit Card
              </label>
              <label>
                <input
                  type="radio"
                  value="upi"
                  checked={method === "upi"}
                  onChange={() => setMethod("upi")}
                />{" "}
                📱 UPI
              </label>
              <label>
                <input
                  type="radio"
                  value="netbanking"
                  checked={method === "netbanking"}
                  onChange={() => {
                    setMethod("netbanking");
                    setStep(1);
                  }}
                />{" "}
                🏦 Net Banking
              </label>
            </div>

            {/* 💳 Payment Form */}
            <form onSubmit={handlePayment} className="payment-form mt-3">
              {method === "card" && (
                <>
                  <input type="text" placeholder="Card Number" required />
                  <input type="text" placeholder="Card Holder Name" required />
                  <div className="card-row">
                    <input type="text" placeholder="MM/YY" required />
                    <input type="password" placeholder="CVV" required />
                  </div>
                  <button type="submit" className="pay-btn">
                    ✅ Pay ₹{flight.price}
                  </button>
                </>
              )}

              {method === "upi" && (
                <>
                  <p>Scan QR to pay:</p>
                  <img src={qrImg} alt="UPI QR" className="upi-qr" />
                  <button type="submit" className="pay-btn">
                    ✅ Pay ₹{flight.price}
                  </button>
                </>
              )}

              {method === "netbanking" && (
                <>
                  {step === 1 && (
                    <>
                      <select
                        value={bank}
                        onChange={(e) => setBank(e.target.value)}
                        required
                      >
                        <option value="">Select Bank</option>
                        <option>State Bank of India</option>
                        <option>ICICI Bank</option>
                        <option>HDFC Bank</option>
                        <option>Axis Bank</option>
                      </select>
                      <button
                        type="button"
                        className="pay-btn"
                        onClick={() => setStep(2)}
                        disabled={!bank}
                      >
                        🔐 Proceed to Login
                      </button>
                    </>
                  )}

                  {step === 2 && (
                    <>
                      <input
                        type="text"
                        placeholder="Registered Phone Number"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        required
                      />
                      <button
                        type="button"
                        className="pay-btn"
                        onClick={handleSendOtp}
                      >
                        📲 Send OTP
                      </button>
                    </>
                  )}

                  {otpSent && (
                    <>
                      <input
                        type="text"
                        placeholder="Enter OTP"
                        value={otp}
                        onChange={(e) => setOtp(e.target.value)}
                        required
                      />
                      <button
                        type="button"
                        className="pay-btn"
                        onClick={handleVerifyOtp}
                      >
                        ✅ Verify & Pay ₹{flight.price}
                      </button>
                    </>
                  )}
                </>
              )}
            </form>
          </>
        ) : (
          <p className="text-warning text-center mt-3">
            ⚠️ Flight details not found. Please go back and try again.
          </p>
        )}
      </div>
    </div>
  );
}
