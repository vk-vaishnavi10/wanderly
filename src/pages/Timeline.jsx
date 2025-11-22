// src/pages/Timeline.jsx
import React, { useState, useEffect, useMemo } from "react";
import "./Timeline.css";
import { motion, AnimatePresence } from "framer-motion";
import {
  FaPlaneDeparture,
  FaHotel,
  FaCameraRetro,
  FaMapMarkerAlt,
  FaRegCalendarAlt,
} from "react-icons/fa";

/* 🐱 Reusable CSS-drawn cat sitting on an envelope + hello bubble */
function CatHello({ className = "", message = "hello!", style }) {
  return (
    <div className={`kitty-shell ${className}`} style={style}>
      <div className="kitty-inner">
        {/* Envelope */}
        <div className="kitty-envelope">
          <div className="kitty-env-flap" />
          <div className="kitty-env-body" />
        </div>

        {/* Cat */}
        <div className="kitty">
          <div className="kitty-ears">
            <span className="kitty-ear kitty-ear-left" />
            <span className="kitty-ear kitty-ear-right" />
          </div>

          <div className="kitty-head">
            <span className="kitty-eye kitty-eye-left" />
            <span className="kitty-eye kitty-eye-right" />
            <span className="kitty-nose" />
            <span className="kitty-mouth" />
          </div>

          <div className="kitty-body" />
          <div className="kitty-tail" />
        </div>

        {/* Speech bubble */}
        <div className="kitty-bubble">
          <span>{message}</span>
        </div>
      </div>
    </div>
  );
}

/* 💌 Envelope Modal for a memory */
function MemoryEnvelope({ event, onClose }) {
  if (!event) return null;

  return (
    <AnimatePresence>
      <motion.div
        className="memory-overlay"
        onClick={onClose}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
      >
        <motion.div
          className="memory-envelope-card"
          onClick={(e) => e.stopPropagation()}
          initial={{ scale: 0.85, y: 30, opacity: 0 }}
          animate={{ scale: 1, y: 0, opacity: 1 }}
          exit={{ scale: 0.9, y: 20, opacity: 0 }}
          transition={{ duration: 0.4, ease: "easeOut" }}
        >
          {/* Flap */}
          <div className="envelope-flap" />

          {/* Body */}
          <div className="envelope-body">
            <div className="memory-chip">
              ✨ Memory from <span>{event.date}</span>
            </div>

            <h2 className="memory-title">{event.title}</h2>

            <p className="memory-date">
              <FaRegCalendarAlt /> {event.date}
            </p>

            <p className="memory-text">{event.desc}</p>

            <div className="memory-footer">
              {/* Smaller version of cat in footer */}
              <CatHello
                className="memory-kitty"
                message="hi, memory keeper! 💌"
              />

              <button className="close-memory-btn" onClick={onClose}>
                Close Memory
              </button>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}

export default function Timeline() {
  const [events] = useState([
    {
      id: 1,
      title: "Flight to Bali ✈️",
      date: "Oct 14, 2025",
      desc: "Departed from Hyderabad on an early morning flight to Bali 🌅",
      icon: <FaPlaneDeparture />,
    },
    {
      id: 2,
      title: "Checked into Ocean Bliss Resort 🏖️",
      date: "Oct 15, 2025",
      desc: "Relaxed by the poolside, with tropical vibes and ocean breeze.",
      icon: <FaHotel />,
    },
    {
      id: 3,
      title: "Captured Memories 📸",
      date: "Oct 16, 2025",
      desc: "Snapped sunsets and coconut trails with new Wanderly friends!",
      icon: <FaCameraRetro />,
    },
    {
      id: 4,
      title: "Exploring Kyoto, Japan 🇯🇵",
      date: "Nov 2, 2025",
      desc: "Arriving soon to witness cherry blossoms & ancient temples 🌸",
      icon: <FaMapMarkerAlt />,
    },
  ]);

  const [openEvent, setOpenEvent] = useState(null);

  /* 🌙 Parallax background based on scroll */
  useEffect(() => {
    const handleScroll = () => {
      const y = window.scrollY || 0;
      document.documentElement.style.setProperty("--scrollY", `${y}`);
    };

    handleScroll();
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  /* 🐱 Generate many floating cats with random positions/speeds */
  const bgCats = useMemo(() => {
    const count = 18; // feels like “unlimited” without lag
    return Array.from({ length: count }, (_, i) => ({
      id: i,
      top: `${10 + Math.random() * 70}vh`,
      left: `${-10 + Math.random() * 120}vw`,
      duration: 20 + Math.random() * 20,
      delay: Math.random() * 20,
      scale: 0.6 + Math.random() * 0.7,
      direction: Math.random() < 0.5 ? "left" : "right",
    }));
  }, []);

  return (
    <section className="timeline-section">
      {/* 🌌 Soft aurora background */}
      <div className="timeline-aurora" />

      {/* 🐱 Many floating cats in the background */}
      {bgCats.map((cat) => (
        <CatHello
          key={cat.id}
          className={`bg-kitty ${
            cat.direction === "left" ? "bg-kitty--left" : "bg-kitty--right"
          }`}
          message="hello!"
          style={{
            top: cat.top,
            left: cat.left,
            animationDuration: `${cat.duration}s`,
            animationDelay: `${cat.delay}s`,
            "--kitty-scale": cat.scale,
          }}
        />
      ))}

      {/* ✨ Title */}
      <motion.h1
        className="timeline-title"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <span className="title-orb" /> Your Wanderly Journey
      </motion.h1>

      <motion.p
        className="timeline-subtitle"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
      >
        Trace your adventures, milestones & shining memories ✨
      </motion.p>

      {/* 🧭 Timeline cards (old layout) */}
      <div className="timeline-container">
        {events.map((event, index) => (
          <motion.div
            key={event.id}
            className={`timeline-card ${index % 2 === 0 ? "left" : "right"}`}
            initial={{ opacity: 0, x: index % 2 === 0 ? -80 : 80 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.25, duration: 0.6 }}
            whileHover={{ y: -6, scale: 1.02 }}
            onClick={() => setOpenEvent(event)} // whole card opens modal
          >
            <div className="timeline-icon">{event.icon}</div>
            <div className="timeline-content">
              <h3>{event.title}</h3>
              <p className="timeline-date">
                <FaRegCalendarAlt /> {event.date}
              </p>
              <p className="timeline-desc">{event.desc}</p>

              <button
                className="open-memory-btn"
                onClick={(e) => {
                  e.stopPropagation();
                  setOpenEvent(event);
                }}
              >
                Open Memory ✨
              </button>
            </div>
          </motion.div>
        ))}
      </div>

      {/* 💫 Footer */}
      <footer className="timeline-footer">
        <p>
          💛 Keep exploring —{" "}
          <span className="wanderly-glow">Wanderly</span> holds your every
          glowing memory.
        </p>
      </footer>

      {/* 💌 Envelope Modal */}
      <MemoryEnvelope event={openEvent} onClose={() => setOpenEvent(null)} />
    </section>
  );
}
