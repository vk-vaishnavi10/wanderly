// src/components/ChatBox/ThemeToggle.jsx
import React, { useState, useEffect } from "react";

/**
 * Small toggle used by ChatBox header.
 * For demo this toggles speech output (speakOn).
 * You can adapt to toggle CSS theme globally.
 *
 * Props:
 *  - onToggle(bool)
 */
export default function ThemeToggle({ onToggle }) {
  const [on, setOn] = useState(false);

  useEffect(() => {
    onToggle?.(on);
  }, [on, onToggle]);

  return (
    <button
      title={on ? "Speech: ON" : "Speech: OFF"}
      onClick={() => setOn((s) => !s)}
      style={{
        width: 36,
        height: 36,
        borderRadius: 8,
        border: "none",
        cursor: "pointer",
        fontSize: 14,
        background: on ? "linear-gradient(90deg,#00e0ff,#9b5de5)" : "transparent",
        color: on ? "#001" : "#fff",
      }}
    >
      {on ? "🔊" : "🔈"}
    </button>
  );
}
