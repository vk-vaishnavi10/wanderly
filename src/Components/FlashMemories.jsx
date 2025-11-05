import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import axios from "axios";
import MemoryCard from "./MemoryCard";
import "./FlashMemories.css";

export default function FlashMemories() {
  const [memories, setMemories] = useState([]);
  const [status, setStatus] = useState("✨ Relive your favorite travel moments...");

  useEffect(() => {
    axios
      .get("http://localhost:8085/api/memories")
      .then((res) => setMemories(res.data.reverse()))
      .catch(() => setStatus("⚠️ Offline — showing cached memories."));
  }, []);

  return (
    <div className="flash-memories-container">
      {/* ✨ Header */}
      <motion.div
        className="flash-header"
        initial={{ opacity: 0, y: -30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7 }}
      >
        <h1 className="title-glow">📸 Wanderly Flash Memories</h1>
        <p className="status-text">{status}</p>
      </motion.div>

      {/* 🕰️ Timeline */}
      <div className="timeline-bar">
        {memories.map((m, i) => (
          <div key={i} className="timeline-dot" title={m.date}></div>
        ))}
      </div>

      {/* 🪞 Memory Grid */}
      <div className="flash-grid">
        {memories.map((m, i) => (
          <MemoryCard key={i} memory={m} />
        ))}
      </div>
    </div>
  );
}
