// src/components/ChatBox/SeatPicker.jsx
import React, { useState } from "react";
import "./ChatBox.css";

/**
 * Lightweight SeatPicker overlay.
 * Props:
 *  - onClose()
 *  - onSelect(seatLabel)
 */
export default function SeatPicker({ onClose, onSelect }) {
  // create rows A-F and seats 1..6
  const rows = ["A", "B", "C", "D", "E", "F"];
  const seatsPerRow = 6;
  const [selected, setSelected] = useState(null);

  const handleChoose = () => {
    if (!selected) return alert("Choose a seat");
    onSelect?.(selected);
  };

  return (
    <div style={backdrop}>
      <div style={card}>
        <h4>Select a seat</h4>
        <div style={{ display: "grid", gap: 8 }}>
          {rows.map((r) => (
            <div key={r} style={{ display: "flex", gap: 8 }}>
              {Array.from({ length: seatsPerRow }).map((_, i) => {
                const label = `${r}${i + 1}`;
                const isSelected = selected === label;
                return (
                  <button
                    key={label}
                    onClick={() => setSelected(label)}
                    style={{
                      minWidth: 44,
                      height: 36,
                      borderRadius: 6,
                      border: isSelected ? "2px solid #ffd76b" : "1px solid rgba(255,255,255,0.06)",
                      background: isSelected ? "linear-gradient(90deg,#ffd76b,#9b5de5)" : "rgba(255,255,255,0.03)",
                      color: isSelected ? "#001" : "#fff",
                      cursor: "pointer",
                    }}
                  >
                    {label}
                  </button>
                );
              })}
            </div>
          ))}
        </div>

        <div style={{ display: "flex", gap: 8, justifyContent: "flex-end", marginTop: 12 }}>
          <button className="reset-btn" onClick={onClose}>Close</button>
          <button className="dest-cta" onClick={() => { handleChoose(); onClose(); }}>Select</button>
        </div>
      </div>
    </div>
  );
}

const backdrop = {
  position: "fixed",
  inset: 0,
  display: "grid",
  placeItems: "center",
  background: "rgba(0,0,0,0.55)",
  zIndex: 12000,
};

const card = {
  width: "min(760px, 96%)",
  padding: 18,
  background: "#0e0b1a",
  color: "#fff",
  borderRadius: 12,
  border: "1px solid rgba(155,93,229,0.18)",
};
