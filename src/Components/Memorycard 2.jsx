import React from "react";
import { motion } from "framer-motion";
import "./FlashMemories.css";

export default function MemoryCard({ memory }) {
  return (
    <motion.div
      className="memory-flash-card"
      whileHover={{ rotateY: 180 }}
      transition={{ duration: 0.6 }}
    >
      {/* FRONT */}
      <div className="flash-front">
        <img src={memory.imageUrl} alt={memory.caption} className="memory-image" />
        <div className="caption-overlay">
          <p>{memory.caption}</p>
        </div>
      </div>

      {/* BACK */}
      <div className="flash-back">
        <h3>{memory.location || "📍 Somewhere Beautiful"}</h3>
        <p className="flash-story">
          {memory.story || "Every photo holds a heartbeat of adventure."}
        </p>
        <small className="flash-date">{memory.date}</small>
        <div className="flash-emotion">{memory.emotion || "💛 Joyful"}</div>
      </div>
    </motion.div>
  );
}
