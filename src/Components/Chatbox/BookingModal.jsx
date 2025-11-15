// src/components/ChatBox/BookingModal.jsx
import React, { useState } from "react";
import "./ChatBox.css";

/**
 * Small modal used by ChatBox to simulate booking flow.
 * Props:
 *  - data: { title, price, type }
 *  - onClose()
 *  - onConfirm(payload)
 */
export default function BookingModal({ data = {}, onClose, onConfirm }) {
  const [form, setForm] = useState({
    checkIn: "",
    nights: 1,
    guests: 1,
  });

  const confirm = () => {
    const payload = {
      ...form,
      title: data.title || "Booking",
      price: data.price || "N/A",
      type: data.type || "stay",
    };
    onConfirm?.(payload);
  };

  return (
    <div className="chatbox-modal-backdrop" style={backdropStyle}>
      <div className="chatbox-modal" style={modalStyle}>
        <h3 style={{ marginTop: 0 }}>{data.title || "Booking"}</h3>
        <p style={{ margin: "6px 0 12px" }}>{data.price || "Price on request"}</p>

        <label>Check-in</label>
        <input
          type="date"
          value={form.checkIn}
          onChange={(e) => setForm({ ...form, checkIn: e.target.value })}
        />

        <div style={{ display: "flex", gap: 8, marginTop: 8 }}>
          <div style={{ flex: 1 }}>
            <label>Nights</label>
            <input
              type="number"
              min="1"
              value={form.nights}
              onChange={(e) => setForm({ ...form, nights: e.target.value })}
            />
          </div>
          <div style={{ flex: 1 }}>
            <label>Guests</label>
            <input
              type="number"
              min="1"
              value={form.guests}
              onChange={(e) => setForm({ ...form, guests: e.target.value })}
            />
          </div>
        </div>

        <div style={{ display: "flex", gap: 8, marginTop: 12, justifyContent: "flex-end" }}>
          <button className="reset-btn" onClick={onClose}>Cancel</button>
          <button
            className="dest-cta"
            onClick={() => {
              confirm();
              onClose();
            }}
          >
            Confirm
          </button>
        </div>
      </div>
    </div>
  );
}

const backdropStyle = {
  position: "fixed",
  inset: 0,
  background: "rgba(0,0,0,0.5)",
  display: "grid",
  placeItems: "center",
  zIndex: 12000,
};

const modalStyle = {
  width: "min(560px, 92%)",
  background: "#0e0b1a",
  color: "#fff",
  padding: "18px",
  borderRadius: "12px",
  border: "1px solid rgba(155,93,229,0.18)",
};
