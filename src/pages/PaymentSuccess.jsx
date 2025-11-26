// src/pages/PaymentSuccess.jsx
import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import "./PaymentSuccess.css";

export default function PaymentSuccess() {
  const location = useLocation();
  const navigate = useNavigate();

  const paymentData = location.state?.paymentData;

  const [open, setOpen] = useState(false);

  // If no data → redirect style page
  if (!paymentData) {
    return (
      <div className="blob-error">
        ⚠️ No booking data found. Please book again.
      </div>
    );
  }

  const cleanAmount = (v) =>
    Number(String(v || 0).replace(/[^0-9]/g, "")) || 0;

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

  // Envelope animation trigger
  useEffect(() => {
    const t = setTimeout(() => setOpen(true), 600);
    return () => clearTimeout(t);
  }, []);

  return (
    <div className="payment-success-blobpage">

      {/* Floating Coffee Dust */}
      {[...Array(25)].map((_, i) => (
        <div
          key={i}
          className="blob-coffee-dust"
          style={{
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
            animationDelay: `${Math.random() * 5}s`,
            animationDuration: `${5 + Math.random() * 8}s`,
          }}
        />
      ))}

      {/* Magical Portal Rings */}
      <div className="blob-portal-ring ring1"></div>
      <div className="blob-portal-ring ring2"></div>
      <div className="blob-portal-ring ring3"></div>

      {/* Envelope */}
      <div className={`blob-envelope ${open ? "open" : ""}`}>
        <div className="blob-envelope-flap"></div>

        {/* FLOATING BLOB CARD */}
        <div className="blob-card">
          <div className="receipt-eyebrow">WANDERLY – RECEIPT</div>

          <h2 className="receipt-title">Payment Successful!</h2>
          <p className="receipt-sub">{paymentData.title}</p>

          <div className="receipt-details">
            {paymentData.type === "flight" && (
              <div>✈ Flight Confirmed</div>
            )}
            {paymentData.type === "hotel" && (
              <div>🏨 Stay Confirmed</div>
            )}
            {paymentData.type === "package" && (
              <div>🎁 Package Booked</div>
            )}
            {paymentData.type === "dining" && (
              <div>🍽 Guests: {pax}</div>
            )}
            {(paymentData.type === "transport" ||
              paymentData.type === "car" ||
              paymentData.type === "cab") && (
              <div>
                🚗 Ride Confirmed 
                {pickup && drop && (
                  <div className="route">
                    🗺 {pickup} → {drop}
                  </div>
                )}
              </div>
            )}

            <div className="paid-amount">💰 Paid: ₹{amount}</div>
          </div>

          <div className="blob-buttons">
            <button onClick={() => navigate("/home")} className="blob-btn home">
              🏠 Home
            </button>
            <button onClick={() => navigate(-1)} className="blob-btn again">
              🔁 Book Again
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
