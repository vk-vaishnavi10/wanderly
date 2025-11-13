// ✅ src/pages/PaymentSuccess.jsx
import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import "./Payment.css";

export default function PaymentSuccess() {
  const location = useLocation();
  const navigate = useNavigate();

  // original data passed from Payment.jsx
  const paymentData = location.state?.paymentData;

  if (!paymentData) {
    return (
      <div className="text-center text-warning mt-5">
        ⚠️ No payment info found.
      </div>
    );
  }

  const amount =
    typeof paymentData.price === "string"
      ? Number(paymentData.price.replace(/[₹,]/g, ""))
      : Number(paymentData.price);

  const pickup =
    paymentData.details?.pickup ||
    paymentData.details?.pickupLocation ||
    "";

  const drop =
    paymentData.details?.drop ||
    paymentData.details?.dropLocation ||
    "";

  const pax =
    paymentData.details?.pax || paymentData.details?.guests || "";

  return (
    <div className="payment-page text-light" style={{ minHeight: "85vh" }}>
      <div className="payment-card">
        <h2 style={{ color: "#00ffcc" }}>✅ Payment Successful!</h2>

        <div className="summary-box text-center">
          <h3 style={{ color: "#ffd86b" }}>{paymentData.title}</h3>

          <p style={{ color: "#dcdcf7", fontSize: "1rem" }}>
            {paymentData.type === "flight" && (
              <>✈ Flight Booking Successful!<br /></>
            )}

            {paymentData.type === "hotel" && (
              <>🏨 Your hotel stay is confirmed!<br /></>
            )}

            {paymentData.type === "package" && (
              <>🎁 Your travel package is booked!<br /></>
            )}

            {paymentData.type === "dining" && (
              <>
                🍽 Table Reserved <br />
                Guests: {pax} <br />
              </>
            )}

            {(paymentData.type === "transport" ||
              paymentData.type === "car" ||
              paymentData.type === "cab") && (
              <>
                🚗 Ride booked successfully! <br />
                {pickup && drop && (
                  <>
                    🗺 {pickup} → {drop} <br />
                  </>
                )}
              </>
            )}

            <strong style={{ fontSize: "1.3rem" }}>💰 Paid: ₹{amount}</strong>
          </p>
        </div>

        {/* BUTTONS */}
        <div style={{ marginTop: "20px" }}>
          <button
            className="pay-btn"
            style={{
              backgroundColor: "#00ccff",
              border: "none",
              fontWeight: "bold",
            }}
            onClick={() => navigate("/")}
          >
            🏠 Back to Home
          </button>

          <button
            className="pay-btn"
            style={{
              marginTop: "10px",
              backgroundColor: "#ffd86b",
              border: "none",
            }}
            onClick={() => navigate(-1)}
          >
            🔙 Book Again
          </button>
        </div>
      </div>
    </div>
  );
}
