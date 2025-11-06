// 🌍 src/pages/Packing.jsx
import React, { useState, useEffect } from "react";
import confetti from "canvas-confetti";
import "./Packing.css";

export default function Packing() {
  const [tripType, setTripType] = useState("");
  const [aiList, setAiList] = useState([]);
  const [customItem, setCustomItem] = useState("");
  const [items, setItems] = useState([]);

  // 🧠 Smart Suggestions
  const suggestions = {
    Beach: ["Sunscreen", "Swimsuit", "Hat", "Flip-flops"],
    Trek: ["Hiking boots", "Raincoat", "Energy bars", "Torch"],
    Winter: ["Jacket", "Gloves", "Thermal wear", "Beanie"],
    Business: ["Formal suit", "Laptop", "Notepad", "Charger"],
  };

  const handleAiSuggest = () => {
    if (tripType.trim() === "") return;
    const list = suggestions[tripType] || ["Essentials"];
    setAiList(list);
    setItems(list.map((name) => ({ name, packed: false, weight: 0.5 })));
  };

  const addCustomItem = () => {
    if (!customItem.trim()) return;
    setItems([...items, { name: customItem, packed: false, weight: 0.5 }]);
    setCustomItem("");
  };

  const togglePacked = (index) => {
    const updated = [...items];
    updated[index].packed = !updated[index].packed;
    setItems(updated);
  };

  // 🎉 Confetti + Sound when all packed
  useEffect(() => {
    if (items.length > 0 && items.every((i) => i.packed)) {
      confetti({
        particleCount: 150,
        spread: 80,
        origin: { y: 0.7 },
        colors: ["#9b5de5", "#00e1ff", "#f15bb5", "#ffd700"],
      });
      const sound = new Audio("/sounds/confetti.mp3");
      sound.volume = 0.2;
      sound.play().catch(() => {});
    }
  }, [items]);

  // ⚖️ Weight Tracker
  const totalWeight = items.reduce(
    (sum, i) => sum + (i.packed ? i.weight : 0),
    0
  );
  const weightLimit = 7;
  const withinLimit = totalWeight <= weightLimit;
  const percentage = Math.min((totalWeight / weightLimit) * 100, 100);

  return (
    <section className="packing-page">
      {/* 🌌 Background elements */}
      <div className="floating-icon">🎒</div>
      <div className="floating-icon">✈️</div>
      <div className="floating-icon">☀️</div>
      <div className="floating-icon">🕶️</div>
      <div className="sparkle sparkle1"></div>
      <div className="sparkle sparkle2"></div>
      <div className="sparkle sparkle3"></div>

      <h1 className="packing-title">🧳 Wanderly Packing Dashboard</h1>
      <p className="packing-subtitle">
        Let Wanderly help you pack smart, light, and right ✨
      </p>

      <div className="packing-grid">
        {/* 🧠 Plan */}
        <div className="packing-card">
          <h2>🧠 Plan Your Packing</h2>
          <p>Select trip type or let Wanderly AI help you 🪄</p>
          <select
            value={tripType}
            onChange={(e) => setTripType(e.target.value)}
          >
            <option value="">Select Trip Type</option>
            <option value="Beach">🏖️ Beach</option>
            <option value="Trek">⛰️ Trek</option>
            <option value="Winter">❄️ Winter</option>
            <option value="Business">💼 Business</option>
          </select>
          <button onClick={handleAiSuggest} className="btn-glow">
            ✨ Ask Wanderly
          </button>

          {aiList.length > 0 && (
            <ul className="ai-suggestions">
              {aiList.map((item, i) => (
                <li key={i} style={{ animationDelay: `${i * 0.15}s` }} className="fade-in">
                  🌟 {item}
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* 📋 Checklist */}
        <div className="packing-card">
          <h2>📋 Your Packing Checklist</h2>
          <div className="add-item">
            <input
              type="text"
              placeholder="Add custom item..."
              value={customItem}
              onChange={(e) => setCustomItem(e.target.value)}
            />
            <button onClick={addCustomItem} className="btn-add">Add</button>
          </div>

          <ul className="packing-list">
            {items.map((item, i) => (
              <li
                key={i}
                onClick={() => togglePacked(i)}
                className={item.packed ? "packed" : ""}
              >
                {item.packed ? "✅" : "⬜"} {item.name}
              </li>
            ))}
            {items.length === 0 && (
              <p className="empty-text">Start adding your essentials ✨</p>
            )}
          </ul>
        </div>

        {/* ⚖️ Weight Tracker */}
        <div className="packing-card weight-card">
          <h2>⚖️ Weight Tracker</h2>
          <div className="weight-ring">
            <svg width="120" height="120">
              <circle
                cx="60"
                cy="60"
                r="50"
                stroke="#222"
                strokeWidth="10"
                fill="none"
              />
              <circle
                cx="60"
                cy="60"
                r="50"
                stroke="#00e1ff"
                strokeWidth="10"
                fill="none"
                strokeDasharray={`${(percentage * 3.14)}, 314`}
                strokeLinecap="round"
              />
            </svg>
            <p>{totalWeight.toFixed(1)} kg</p>
          </div>
          <p
            className={`weight-status ${
              withinLimit ? "within" : "over-limit"
            }`}
          >
            {withinLimit ? "✅ Within carry-on limit" : "⚠️ Overweight bag!"}
          </p>
        </div>
      </div>
    </section>
  );
}

