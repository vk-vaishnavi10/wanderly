import React from "react";
import { NavLink } from "react-router-dom";
import "./HelpSubpages.css";

export default function MyTickets() {
  return (
    <div className="help-subpage">
      <NavLink to="/help" className="back-btn">⬅️ Back to Help Center</NavLink>
      <h1>🎫 My Support Tickets</h1>
      <p>View or track your existing support tickets.</p>

      <div className="ticket-list">
        <div className="ticket-card">
          <h3>#WDR-12543</h3>
          <p>Status: <span className="status open">Open</span></p>
          <p>Topic: Payment Issue</p>
        </div>
        <div className="ticket-card">
          <h3>#WDR-12298</h3>
          <p>Status: <span className="status closed">Resolved</span></p>
          <p>Topic: Account Access</p>
        </div>
      </div>
    </div>
  );
}
