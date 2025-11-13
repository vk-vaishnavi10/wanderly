// ✅ src/pages/PaymentSuccess.jsx
import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import "./Payment.css";

export default function PaymentSuccess() {
  const navigate = useNavigate();
  const { state } = useLocation();

  const paymentData = state?.paymentData;

  if (!paymentData) {
    return (
      <div className="payment-page text-light text-center mt-5">
        <h2 className="text-warning">⚠️ No Payment Details Found</h2>
        <button className="pay-btn mt-3" onClick={() => navigate("/")}>
          Go Home 🏠
        </button>
      </div>
    );
  }

  return (
    <div className="payment-page text-light">
      <div
        className="payment-card"
        style={{
          padding: "2.5rem",
          maxWidth: "500px",
          animation: "fadeInUp 0.9s ease",
        }}
      >
        {/* 🌟 Success Icon */}
        <div
          style={{
            fontSize: "4rem",
            marginBottom: "1rem",
            textShadow: "0 0 20px #00ffcc",
          }}
        >
          ✅
        </div>

        <h2
          style={{
            background: "linear-gradient(90deg, #00ffcc, #6EC1E4, #9B5DE5)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            fontWeight: "800",
            marginBottom: "1rem",
            fontSize: "2rem",
          }}
        >
          Payment Successful!
        </h2>

        {/* 🎉 Summary Box */}
        <div
          style={{
            background: "rgba(20, 15, 40, 0.8)",
            borderRadius: "12px",
            border: "2px solid #6EC1E4",
            padding: "1rem",
            marginBottom: "1.5rem",
            boxShadow: "0 0 20px rgba(110,193,228,0.4)",
          }}
        >
          <h4
            style={{
              color: "#9B5DE5",
              fontWeight: "bold",
              marginBottom: "0.3rem",
            }}
          >
            {paymentData.title}
          </h4>

          {/* 🎟 Universal Payment Summary */}
          <p style={{ lineHeight: "1.6", color: "#dcdcf7" }}>
            {paymentData.type === "flight" && (
              <>
                ✈️ Route: {paymentData.details.route} <br />
                🛫 Airline: {paymentData.title} <br />
              </>
            )}

            {paymentData.type === "hotel" && (
              <>
                🏨 Location: {paymentData.details.location} <br />
                👤 Guests: {paymentData.details.guests} <br />
              </>
            )}

            {paymentData.type === "dining" && (
              <>
                🍽 Pax: {paymentData.details.pax} <br />
                🕓 {paymentData.details.dateTime} <br />
              </>
            )}

            {paymentData.type === "package" && (
              <>
                🎁 Package Date: {paymentData.details.date} <br />
                📧 Email: {paymentData.details.email} <br />
              </>
            )}

            {paymentData.type === "event" && (
              <>
                🎟 Event Ticket Confirmed <br />
                📅 Enjoy the show! <br />
              </>
            )}

            {paymentData.type === "transport" && (
              <>
                🚖 {paymentData.details.carType} <br />
                📍 {paymentData.details.pickup} →{" "}
                {paymentData.details.drop} <br />
              </>
            )}

            💰 <strong style={{ color: "#00ffcc" }}>
              Amount Paid: ₹
              {String(paymentData.price).replace(/[₹,]/g, "")}
            </strong>
          </p>
        </div>

        {/* 🎯 Back Button */}
        <button
          onClick={() => navigate("/")}
          className="pay-btn"
          style={{
            marginTop: "0.5rem",
            fontSize: "1rem",
            padding: "0.9rem",
            borderRadius: "50px",
          }}
        >
          🏠 Back to Home
        </button>
      </div>
    </div>
  );
}
