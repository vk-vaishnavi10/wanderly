// ✅ src/pages/Payment.jsx
import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import "./Payment.css";
import qrImg from "../images/qr.png";
import { addPayment } from "../services/api";

export default function Payment() {
  const navigate = useNavigate();
  const location = useLocation();

  const paymentData = location.state?.paymentData;

  if (!paymentData) {
    return (
      <div className="text-center text-warning mt-5">
        ⚠️ No booking data found. Please book again.
      </div>
    );
  }

  /* ======================================================
      PRICE — Safely Clean Numbers (₹ symbols removed)
  ====================================================== */
  const cleanNumber = (v) => Number(String(v || "0").replace(/[^0-9]/g, ""));
  const amount = cleanNumber(paymentData?.price);

  /* ======================================================
     STATES
  ====================================================== */
  const [method, setMethod] = useState("card");
  const [bank, setBank] = useState("");
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);

  const [phone, setPhone] = useState("");
  const [otp, setOtp] = useState("");
  const [generatedOtp, setGeneratedOtp] = useState("");
  const [otpSent, setOtpSent] = useState(false);

  /* ======================================================
      NORMALIZE DETAILS (Fixes undefined → clean data)
  ====================================================== */
  const details = paymentData.details || {};

  const pickup =
    details.pickup ||
    details.pickupLocation ||
    details.from ||
    details.departureCity ||
    details.source ||
    "";

  const drop =
    details.drop ||
    details.dropLocation ||
    details.to ||
    details.arrivalCity ||
    details.destination ||
    "";

  const pax =
    details.pax ||
    details.guests ||
    details.persons ||
    details.travelers ||
    "";

  // ✈ Smart route extraction (works for flights, cabs, cars, packages, transport)
  const routeDisplay =
    details.route ||
    details.flightRoute ||
    details.path ||
    (pickup && drop ? `${pickup} → ${drop}` : "");

  /* ======================================================
      MAIN PAYMENT HANDLER
  ====================================================== */
  const handlePayment = async (e) => {
    if (e) e.preventDefault();
    setLoading(true);

    try {
      const payload = {
        userName:
          details.userName ||
          details.fullName ||
          details.name ||
          "Guest",

        email: details.email || "unknown@example.com",

        flightName: paymentData.title || paymentData.name || "Trip",

        route: routeDisplay || "",

        amount: amount,

        status: "SUCCESS",
      };

      console.log("💸 Sending Payment Payload:", payload);

      await addPayment(payload);

      navigate("/payment/success", {
        state: { paymentData },
      });
    } catch (err) {
      console.error("❌ Payment error:", err);
      alert("Payment failed. Try again.");
    } finally {
      setLoading(false);
    }
  };

  /* ======================================================
      OTP MOCK
  ====================================================== */
  const handleSendOtp = () => {
    if (!phone) return alert("Enter phone number first.");

    const code = Math.floor(100000 + Math.random() * 900000).toString();
    setGeneratedOtp(code);
    setOtpSent(true);
    alert(`📩 OTP (mock): ${code}`);
  };

  const handleVerifyOtp = () => {
    if (otp === generatedOtp) {
      alert("✅ OTP Verified");
      handlePayment();
    } else {
      alert("❌ Incorrect OTP");
    }
  };

  /* ======================================================
      UI LAYOUT
  ====================================================== */
  return (
    <div className="payment-page">
      <div className="payment-portal-shell">
        <div className="portal-circle portal-circle-1" />
        <div className="portal-circle portal-circle-2" />
        <div className="portal-circle portal-circle-3" />

        {[...Array(18)].map((_, i) => (
          <div
            key={i}
            className="coffee-dust"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 5}s`,
              animationDuration: `${5 + Math.random() * 5}s`,
            }}
          />
        ))}

        <div className="payment-card portal-card">
          <div className="payment-eyebrow">
            WANDERLY • SECURE PAYMENT
          </div>

          <h2 className="payment-title">Confirm your trip</h2>
          <p className="payment-sub">
            Warm, encrypted and easy – finish your booking in a single step.
          </p>

          {/* SUMMARY */}
          <div className="summary-box">
            <h4>{paymentData.title}</h4>

            <p className="summary-text">
              {/* ====== FLIGHT ====== */}
              {paymentData.type === "flight" && routeDisplay && (
                <>
                  ✈ {routeDisplay} <br />
                </>
              )}

              {/* ====== HOTEL ====== */}
              {paymentData.type === "hotel" && details.location && (
                <>
                  🏨 {details.location} <br />
                </>
              )}

              {/* ====== PACKAGE ====== */}
              {paymentData.type === "package" && paymentData.duration && (
                <>
                  🎁 {paymentData.duration} <br />
                </>
              )}

              {/* ====== DINING ====== */}
              {paymentData.type === "dining" && pax && (
                <>
                  🍽 Guests: {pax} <br />
                </>
              )}

              {/* ====== TRANSPORT / CABS / CAR ====== */}
              {(paymentData.type === "transport" ||
                paymentData.type === "car" ||
                paymentData.type === "cab") && (
                <>
                  🚗 {details.carType || details.cabType} <br />
                  {routeDisplay && (
                    <>
                      🗺 {routeDisplay} <br />
                    </>
                  )}
                </>
              )}

              <strong className="summary-amount">💰 ₹{amount}</strong>
            </p>
          </div>

          {/* PAYMENT METHODS */}
          <div className="payment-methods">
            <label>
              <input
                type="radio"
                value="card"
                checked={method === "card"}
                onChange={() => setMethod("card")}
              />
              💳 Card
            </label>

            <label>
              <input
                type="radio"
                value="upi"
                checked={method === "upi"}
                onChange={() => setMethod("upi")}
              />
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
              />
              🏦 Net Banking
            </label>
          </div>

          {/* MAIN PAYMENT FORM */}
          <form className="payment-form" onSubmit={handlePayment}>
            {/* CARD */}
            {method === "card" && (
              <>
                <input type="text" placeholder="Card Number" required />
                <input type="text" placeholder="Card Holder Name" required />
                <div className="card-row">
                  <input type="text" placeholder="MM/YY" required />
                  <input type="password" placeholder="CVV" required />
                </div>

                <button type="submit" className="pay-btn" disabled={loading}>
                  {loading ? "Processing..." : `Pay ₹${amount}`}
                </button>
              </>
            )}

            {/* UPI */}
            {method === "upi" && (
              <>
                <p className="upi-note">Scan to pay securely from any UPI app.</p>
                <img src={qrImg} className="upi-qr" alt="upi qr" />
                <button
                  type="button"
                  className="pay-btn"
                  onClick={handlePayment}
                  disabled={loading}
                >
                  {loading ? "Processing..." : `Pay ₹${amount}`}
                </button>
              </>
            )}

            {/* NET BANKING */}
            {method === "netbanking" && (
              <>
                {step === 1 && (
                  <>
                    <select
                      value={bank}
                      onChange={(e) => setBank(e.target.value)}
                    >
                      <option value="">Select Bank</option>
                      <option>SBI</option>
                      <option>HDFC</option>
                      <option>ICICI</option>
                      <option>Axis Bank</option>
                    </select>

                    <button
                      type="button"
                      className="pay-btn"
                      disabled={!bank || loading}
                      onClick={() => setStep(2)}
                    >
                      Continue
                    </button>
                  </>
                )}

                {step === 2 && (
                  <>
                    <input
                      type="text"
                      placeholder="Phone Number"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                    />
                    <button
                      type="button"
                      className="pay-btn"
                      onClick={handleSendOtp}
                    >
                      Send OTP
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
                    />
                    <button
                      type="button"
                      className="pay-btn"
                      onClick={handleVerifyOtp}
                      disabled={loading}
                    >
                      Verify & Pay ₹{amount}
                    </button>
                  </>
                )}
              </>
            )}
          </form>
        </div>
      </div>
    </div>
  );
}
