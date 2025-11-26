// ✅ src/pages/PaymentSuccess.jsx
import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import "./PaymentSuccess.css";

export default function PaymentSuccess() {
  const location = useLocation();
  const navigate = useNavigate();
  const paymentData = location.state?.paymentData;

  const [openEnvelope, setOpenEnvelope] = useState(false);

  if (!paymentData) {
    return (
      <div className="text-center text-warning mt-5">
        ⚠️ No payment info found.
      </div>
    );
  }

  const cleanAmount = (value) =>
    Number(String(value ?? 0).replace(/[^\d]/g, "")) || 0;
  const amount = cleanAmount(paymentData.price);

  const pickup =
    paymentData.details?.pickup ||
    paymentData.details?.pickupLocation ||
    "";

  const drop =
    paymentData.details?.drop ||
    paymentData.details?.dropLocation ||
    "";

  const pax =
    paymentData.details?.pax ||
    paymentData.details?.guests ||
    "";

  // Reveal animation
  useEffect(() => {
    const t = setTimeout(() => setOpenEnvelope(true), 800);
    return () => clearTimeout(t);
  }, []);

  const confettiPieces = Array.from({ length: 70 });

  return (
    <div className="payment-success-page">

      {/* ✨ Floating Coffee Dust */}
      {[...Array(20)].map((_, i) => (
        <div
          key={i}
          className="coffee-dust"
          style={{
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
            animationDelay: `${Math.random() * 6}s`,
            animationDuration: `${5 + Math.random() * 6}s`,
          }}
        />
      ))}

      {/* 🎉 Confetti */}
      <div className="confetti-container">
        {confettiPieces.map((_, i) => (
          <span key={i} className="confetti-piece" />
        ))}
      </div>

      {/* ✉ Luxury Envelope */}
      <div className={`envelope-shell ${openEnvelope ? "open" : ""}`}>
        <div className="envelope-body"></div>
        <div className="envelope-flap"></div>

        {/* ✨ Success Card */}
        <div className="success-card">
          <div className="card-eyebrow">Wanderly – Receipt</div>

          <div className="title">Payment Successful!</div>

          <div className="details">
            <div className="service-name">{paymentData.title}</div>

            {paymentData.type === "flight" && <div>✈ Flight Booking Confirmed</div>}
            {paymentData.type === "hotel" && <div>🏨 Hotel Stay Confirmed</div>}
            {paymentData.type === "package" && <div>🎁 Package Booked</div>}
            {paymentData.type === "dining" && <div>🍽 Guests: {pax}</div>}
            {(paymentData.type === "transport" ||
              paymentData.type === "car" ||
              paymentData.type === "cab") && (
              <div>
                🚗 Ride Confirmed
                {pickup && drop && (
                  <>
                    <br />🗺 {pickup} → {drop}
                  </>
                )}
              </div>
            )}

            <div className="amount">💰 Paid: ₹{amount}</div>
          </div>

          <div className="buttons">
            <button className="btn home-btn" onClick={() => navigate("/home")}>
              🏠 Home
            </button>
            <button className="btn repeat-btn" onClick={() => navigate(-1)}>
              🔁 Book Again
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
