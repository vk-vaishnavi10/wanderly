import React from "react";
import { NavLink } from "react-router-dom";
import "./HelpSubpages.css";

export default function AppStatus() {
  return (
    <div className="help-subpage">
      <NavLink to="/help" className="back-btn">⬅️ Back to Help Center</NavLink>
      <h1>📡 Wanderly System Status</h1>
      <p>Check live operational updates and uptime reports.</p>

      <div className="status-box">
        <p>🟢 All systems operational</p>
        <p>Last Updated: {new Date().toLocaleTimeString()}</p>
      </div>
    </div>
  );
}
