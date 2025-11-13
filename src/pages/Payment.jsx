// ✅ src/pages/Payment.jsx
import React, { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import "./Payment.css";
import qrImg from "../images/qr.png";
import { addPayment } from "../services/api";

export default function Payment() {
  const navigate = useNavigate();
  const location = useLocation();

  // 🌟 ALL booking data comes from here
  const paymentData = location.state?.paymentData;

  const [method, setMethod] = useState("card");
  const [bank, setBank] = useState("");
  const [step, setStep] = useState(1);

  // 🔹 OTP State
  const [phone, setPhone] = useState("");
  const [otp, setOtp] = useState("");
  const [generatedOtp, setGeneratedOtp] = useState("");
  const [otpSent, setOtpSent] = useState(false);

  // 🚨 If no data came
  if (!paymentData) {
    return (
      <div className="text-center text-warning mt-5">
        ⚠️ No booking data found. Please go back.
      </div>
    );
  }

  // -----------------------
  // 💰 UNIVERSAL AMOUNT PARSER
  // -----------------------
  const amount =
    typeof paymentData.price === "string"
      ? Number(String(paymentData.price).replace(/[₹,]/g, ""))
      : paymentData.price;

  // -----------------------
  // 💳 FINAL PAYMENT HANDLER
  // -----------------------
  const handlePayment = async () => {
    try {
      const payload = {
        userName: paymentData.details?.fullName || paymentData.details?.userName || "Guest",
        email: paymentData.details?.email || "unknown@example.com",
        bookingType: paymentData.type,
        title: paymentData.title,
        amount: amount,
        status: "SUCCESS",
      };

      console.log("💸 Sending universal payment:", payload);
      await addPayment(payload);

      navigate("/payment/success", { state: { paymentData } });
    } catch (err) {
      alert("❌ Payment failed!");
    }
  };

  // -----------------------
  // 📱 OTP
  // -----------------------
  const handleSendOtp = () => {
    const otpVal = Math.floor(100000 + Math.random() * 900000).toString();
    setGeneratedOtp(otpVal);
    setOtpSent(true);
    alert(`📩 OTP sent! (Mock: ${otpVal})`);
  };

  const handleVerifyOtp = () => {
    if (otp === generatedOtp) {
      alert("🎉 OTP Verified!");
      handlePayment();
    } else {
      alert("❌ Invalid OTP!");
    }
  };

  return (
    <div className="payment-page text-light">
      <div className="payment-card">
        <h2>💳 Payment</h2>

        {/* -----------------------
            BOOKING SUMMARY
        ------------------------ */}
        <div className="summary-box">
          <h4>{paymentData.title}</h4>

          {paymentData.type === "flight" && (
            <p>
              ✈ {paymentData.details?.route || "Flight Booking"} <br />
              💰 ₹{amount}
            </p>
          )}

          {paymentData.type === "hotel" && (
            <p>
              🏨 {paymentData.details?.location} <br /> 💰 {paymentData.price}
            </p>
          )}

          {paymentData.type === "dining" && (
            <p>
              🍽 {paymentData.details?.pax} Guests <br /> 💰 {paymentData.price}
            </p>
          )}

          {paymentData.type === "package" && (
            <p>
              🎁 {paymentData.duration} <br /> 💰 {paymentData.price}
            </p>
          )}

          {paymentData.type === "event" && (
            <p>
              🎟 Event Ticket <br /> 💰 ₹{amount}
            </p>
          )}

          {paymentData.type === "transport" && (
            <p>
              🚗 {paymentData.details?.carType || "Transport"} <br />
              🗺 {paymentData.details?.pickup} →{" "}
              {paymentData.details?.drop} <br /> 💰 {paymentData.price}
            </p>
          )}
        </div>

        {/* -----------------------
            PAYMENT METHOD
        ------------------------ */}
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

        {/* -----------------------
            PAYMENT FORMS
        ------------------------ */}
        <div className="payment-form">
          {/* Card */}
          {method === "card" && (
            <>
              <input type="text" placeholder="Card Number" required />
              <input type="text" placeholder="Card Holder Name" required />
              <div className="card-row">
                <input type="text" placeholder="MM/YY" required />
                <input type="password" placeholder="CVV" required />
              </div>
              <button className="pay-btn" onClick={handlePayment}>
                Pay ₹{amount}
              </button>
            </>
          )}

          {/* UPI */}
          {method === "upi" && (
            <>
              <img src={qrImg} className="upi-qr" alt="QR" />
              <button className="pay-btn" onClick={handlePayment}>
                Pay ₹{amount}
              </button>
            </>
          )}

          {/* Net Banking */}
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
                    className="pay-btn"
                    disabled={!bank}
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
                  <button className="pay-btn" onClick={handleSendOtp}>
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
                  <button className="pay-btn" onClick={handleVerifyOtp}>
                    Verify & Pay ₹{amount}
                  </button>
                </>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}
