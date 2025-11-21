// src/Components/EnvelopePopup.jsx
import React from "react";
import "./envelopePopup.css";

export default function EnvelopePopup({
  hotel,
  booking,
  setBooking,
  onClose,
  onConfirm,
}) {
  if (!hotel) return null;

  return (
    <div className="envelope-overlay" onClick={onClose}>
      <div
        className="envelope-popup-card"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Envelope flap */}
        <div className="envelope-top-flap"></div>

        {/* Main Content */}
        <div className="envelope-layout">
          {/* LEFT SIDE DETAILS */}
          <div className="details-section">
            <h3 className="hotel-title-popup">{hotel.name}</h3>
            <p className="hotel-location-popup">📍 {hotel.location}</p>
            <p className="hotel-desc-popup">{hotel.desc}</p>
            <p className="hotel-price-popup">💰 {hotel.price}</p>
            <p className="hotel-rating-popup">
              {"⭐".repeat(hotel.rating)}{" "}
              <span className="rating-text">Premium stay</span>
            </p>

            {/* FORM */}
            <div className="envelope-form">
              <div className="form-group-popup">
                <label className="form-label-popup">🗓 Check-in Date</label>
                <input
                  type="date"
                  value={booking.checkIn}
                  onChange={(e) =>
                    setBooking({ ...booking, checkIn: e.target.value })
                  }
                />
              </div>

              <div className="form-group-popup">
                <label className="form-label-popup">🌙 Nights</label>
                <input
                  type="number"
                  min="1"
                  value={booking.nights}
                  onChange={(e) =>
                    setBooking({ ...booking, nights: e.target.value })
                  }
                />
              </div>

              <div className="form-group-popup">
                <label className="form-label-popup">👥 Guests</label>
                <input
                  type="number"
                  min="1"
                  value={booking.guests}
                  onChange={(e) =>
                    setBooking({ ...booking, guests: e.target.value })
                  }
                />
              </div>
            </div>

            {/* BUTTONS */}
            <div className="envelope-actions">
              <button className="btn-confirm" onClick={onConfirm}>
                Confirm Stay ✨
              </button>
              <button className="btn-cancel" onClick={onClose}>
                Close ❌
              </button>
            </div>
          </div>

          {/* BOTTOM IMAGE */}
          <div className="image-section">
            <div className="hotel-image-wrapper-bottom">
              <img
                src={hotel.image}
                alt={hotel.name}
                className="hotel-image-popup-bottom"
              />
            </div>
          </div>
        </div>

        {/* FLOATING CAT – RIGHT SIDE */}
        <div className="popup-cat-floating">
          <div className="cat-ear ear-left"></div>
          <div className="cat-ear ear-right"></div>

          <div className="cat-face">
            <div className="eye eye-left"></div>
            <div className="eye eye-right"></div>
            <div className="mouth"></div>
          </div>

          <div className="cat-body"></div>
          <div className="cat-tail"></div>
        </div>
      </div>
    </div>
  );
}

