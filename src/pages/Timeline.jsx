import React, { useState } from "react";
import "./Timeline.css";
import { motion } from "framer-motion";
import { FaPlane, FaHotel, FaMapMarkerAlt, FaCamera, FaRegCalendarAlt } from "react-icons/fa";

export default function Timeline() {
  const [events] = useState([
    {
      id: 1,
      title: "Flight to Bali ✈️",
      date: "Oct 14, 2025",
      desc: "Departed from Hyderabad on an early morning flight to Bali 🌅",
      icon: <FaPlane />,
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
      icon: <FaCamera />,
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
      <motion.h1
        className="timeline-title"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        🌍 Your Wanderly Journey
      </motion.h1>

      <motion.p
        className="timeline-subtitle"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
      >
        Track your adventures, milestones & travel memories ✨
      </motion.p>

      <div className="timeline-container">
        {events.map((event, index) => (
          <motion.div
            key={event.id}
            className={`timeline-card ${index % 2 === 0 ? "left" : "right"}`}
            initial={{ opacity: 0, x: index % 2 === 0 ? -80 : 80 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.2, duration: 0.6 }}
          >
            <div className="timeline-icon">{event.icon}</div>
            <div className="timeline-content glassy">
              <h3>{event.title}</h3>
              <p className="timeline-date">
                <FaRegCalendarAlt /> {event.date}
              </p>
              <p>{event.desc}</p>
            </div>
          </motion.div>
        ))}
      </div>

      <footer className="timeline-footer">
        <p>
          ✨ Keep exploring — <span className="wanderly-glow">Wanderly</span> remembers every step of your journey.
        </p>
      </footer>
    </section>
  );
}
