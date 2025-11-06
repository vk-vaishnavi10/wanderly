import React from "react";
import { NavLink } from "react-router-dom";
import "./HelpSubpages.css";

export default function Faqs() {
  return (
    <div className="help-subpage">
      <NavLink to="/help" className="back-btn">⬅️ Back to Help Center</NavLink>
      <h1>❓ Frequently Asked Questions</h1>
      <div className="faq-list">
        <details>
          <summary>How do I book a trip on Wanderly?</summary>
          <p>Simply browse destinations, select a package, and follow the booking flow!</p>
        </details>
        <details>
          <summary>Can I cancel or reschedule my booking?</summary>
          <p>Yes, you can manage your trips under the "My Trips" section.</p>
        </details>
        <details>
          <summary>Is my payment information secure?</summary>
          <p>Absolutely! Wanderly uses AES-256 encryption and secure gateways.</p>
        </details>
      </div>
    </div>
  );
}
