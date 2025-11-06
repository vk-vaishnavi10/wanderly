import React from "react";
import { NavLink } from "react-router-dom";
import "./HelpSubpages.css";

export default function ContactHelp() {
  return (
    <div className="help-subpage">
      <NavLink to="/help" className="back-btn">⬅️ Back to Help Center</NavLink>
      <h1>📞 Contact Us</h1>
      <p>Reach us via email or phone for immediate assistance.</p>

      <div className="contact-info">
        <p>📧 Email: <a href="mailto:support@wanderly.com">support@wanderly.com</a></p>
        <p>📱 Phone: <a href="tel:+919876543210">+91 98765 43210</a></p>
        <p>🌍 Available: Mon–Sat, 9AM–6PM IST</p>
      </div>
    </div>
  );
}
