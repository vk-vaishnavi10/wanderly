// 🌍 src/pages/HelpCenter.jsx
import React from "react";
import { NavLink, useNavigate } from "react-router-dom";
import confetti from "canvas-confetti";
import "./HelpCenter.css";

export default function HelpCenter() {
  const navigate = useNavigate();

  // 🎉 Confetti burst when card clicked
  const triggerConfetti = (path) => {
    confetti({
      particleCount: 80,
      spread: 80,
      origin: { y: 0.7 },
      colors: ["#ffd700", "#f15bb5", "#00e1ff", "#b2f5ea", "#9b5de5"],
    });
    setTimeout(() => navigate(path), 300); // small delay for effect
  };

  const helpOptions = [
    {
      icon: "📝",
      title: "Create Ticket",
      desc: "Need help? Create a new support request quickly.",
      link: "/help/create-ticket",
      color: "#ffd700",
    },
    {
      icon: "💬",
      title: "Live Chat",
      desc: "Chat instantly with our Wanderly support team.",
      link: "/help/live-chat",
      color: "#00e1ff",
    },
    {
      icon: "📞",
      title: "Call / Email",
      desc: "Reach us directly via phone or email for assistance.",
      link: "/help/contact",
      color: "#f15bb5",
    },
    {
      icon: "📡",
      title: "App Status",
      desc: "Check Wanderly’s current service and uptime status.",
      link: "/help/status",
      color: "#b2f5ea",
    },
    {
      icon: "❓",
      title: "FAQs",
      desc: "Get quick answers to your most common questions.",
      link: "/help/faqs",
      color: "#9b5de5",
    },
    {
      icon: "🎫",
      title: "My Tickets",
      desc: "Track, update or review your previous help tickets.",
      link: "/help/tickets",
      color: "#98ff98",
    },
  ];

  return (
    <div className="helpcenter-page">
      {/* 🌈 Header */}
      <header className="helpcenter-header">
        <h1>💫 Wanderly Help Center</h1>
        <p>Your one-stop place for travel assistance and support.</p>
      </header>

      {/* 💎 Cards Grid */}
      <div className="helpcenter-grid">
        {helpOptions.map((option, i) => (
          <div key={i} className="helpcard">
            <div
              className="helpcard-icon"
              style={{ color: option.color }}
            >
              {option.icon}
            </div>
            <h3>{option.title}</h3>
            <p>{option.desc}</p>
            <button onClick={() => triggerConfetti(option.link)}>
              ✨ Explore
            </button>
          </div>
        ))}
      </div>

      {/* 🌙 Footer */}
      <footer className="helpcenter-footer">
        <p>
          📩 Email us at{" "}
          <a href="mailto:support@wanderly.com">support@wanderly.com</a> or call{" "}
          <a href="tel:+919876543210">+91 98765 43210</a>
        </p>
        <p>© 2025 Wanderly. All rights reserved.</p>
      </footer>
    </div>
  );
}
