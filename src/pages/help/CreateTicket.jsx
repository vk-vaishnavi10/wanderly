import React from "react";
import { NavLink } from "react-router-dom";
import "./HelpSubpages.css";

export default function CreateTicket() {
  return (
    <div className="help-subpage">
      <NavLink to="/help" className="back-btn">
        ⬅️ Back to Help Center
      </NavLink>

      <h1>🧾 Create a Support Ticket</h1>
      <p>Need help? Submit a ticket and our team will assist you shortly.</p>

      <form className="ticket-form">
        <input type="text" placeholder="Your Name" required />
        <input type="email" placeholder="Your Email" required />
        <textarea placeholder="Describe your issue..." required></textarea>
        <button type="submit" className="submit-btn">Submit Ticket</button>
      </form>
    </div>
  );
}
