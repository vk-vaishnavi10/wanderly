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

  // Clean amount again (safety)
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

  // Open envelope after a short delay
  useEffect(() => {
    const t = setTimeout(() => setOpenEnvelope(true), 600);
    return () => clearTimeout(t);
  }, []);

  // Simple confetti pieces
  const confettiPieces = Array.from({ length: 60 });

  return (
    <div className="payment-success-page">
      {/* Confetti */}
      <div className="confetti-container">
        {confettiPieces.map((_, i) => (
          <span key={i} className="confetti-piece" />
        ))}
      </div>

      {/* Envelope + card */}
      <div className={`envelope ${openEnvelope ? "open" : ""}`}>
        <div className="envelope-body" />
        <div className="envelope-flap" />

        <div className="success-card glow">
          <div>✨ Wanderly Booking</div>
          <div className="title">Payment Successful!</div>

          <div className="details">
            <div>{paymentData.title}</div>

            {paymentData.type === "flight" && (
              <div>✈ Flight Booking Confirmed</div>
            )}
            {paymentData.type === "hotel" && (
              <div>🏨 Hotel Stay Confirmed</div>
            )}
            {paymentData.type === "package" && (
              <div>🎁 Package Booked</div>
            )}
            {paymentData.type === "dining" && (
              <div>🍽 Table Reserved — Guests: {pax}</div>
            )}
            {(paymentData.type === "transport" ||
              paymentData.type === "car" ||
              paymentData.type === "cab") && (
              <div>
                🚗 Ride Confirmed
                {pickup && drop && (
                  <>
                    <br />
                    🗺 {pickup} → {drop}
                  </>
                )}
              </div>
            )}

            <div style={{ marginTop: "8px" }}>💰 Paid: ₹{amount}</div>
          </div>

          <div className="buttons">
            <button
              className="btn home-btn"
              onClick={() => navigate("/home")}
            >
              🏠 Back to Home
            </button>
            <button
              className="btn repeat-btn"
              onClick={() => navigate(-1)}
            >
              🔁 Book Again
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
