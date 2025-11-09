import React, { useState } from "react";
import "./Timeline.css";
import { motion } from "framer-motion";
import {
  FaPlaneDeparture,
  FaHotel,
  FaCameraRetro,
  FaMapMarkerAlt,
  FaRegCalendarAlt,
} from "react-icons/fa";

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

  return (
    <section className="timeline-section">
      {/* 🌌 Background Aurora & Stars */}
      <div className="timeline-aurora"></div>
      <div className="floating-stars">
        {Array.from({ length: 30 }).map((_, i) => (
          <span key={i} className={`star star-${i + 1}`}></span>
        ))}
      </div>

      {/* 🌠 Shooting Stars */}
      <div className="shooting-stars">
        {Array.from({ length: 3 }).map((_, i) => (
          <div key={i} className={`shooting-star shooting-star-${i + 1}`}></div>
        ))}
      </div>

      {/* ✨ Title */}
      <motion.h1
  className="timeline-title"
  initial={{ opacity: 0, y: -20 }}
  animate={{ opacity: 1, y: 0 }}
  transition={{ duration: 0.6 }}
>
  <span className="title-orb"></span> Your Wanderly Journey
</motion.h1>



      <motion.p
        className="timeline-subtitle"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
      >
        Trace your adventures, milestones & shining memories ✨
      </motion.p>

      {/* 🧭 Timeline */}
      <div className="timeline-container">
        {events.map((event, index) => (
          <motion.div
            key={event.id}
            className={`timeline-card ${index % 2 === 0 ? "left" : "right"}`}
            initial={{ opacity: 0, x: index % 2 === 0 ? -80 : 80 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.25, duration: 0.6 }}
          >
            <div className="timeline-icon">{event.icon}</div>
            <div className="timeline-content">
              <h3>{event.title}</h3>
              <p className="timeline-date">
                <FaRegCalendarAlt /> {event.date}
              </p>
              <p>{event.desc}</p>
            </div>
          </motion.div>
        ))}
      </div>

      {/* 💫 Footer */}
      <footer className="timeline-footer">
        <p>
          💛 Keep exploring — <span className="wanderly-glow">Wanderly</span>{" "}
          holds your every glowing memory.
        </p>
      </footer>
    </section>
  );
}
