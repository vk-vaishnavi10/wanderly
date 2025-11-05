import React, { useContext, useState, useEffect } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { UserContext } from "../context/UserContext.jsx";
import logo from "../images/travellogo.jpeg";
import "./Navbar.css";

export default function Navbar({ onToggle }) {
  const { user, logout } = useContext(UserContext);
  const navigate = useNavigate();
  const [expanded, setExpanded] = useState(true);

  const toggleNavbar = () => {
    setExpanded(!expanded);
    if (onToggle) onToggle(!expanded);
  };

  const handleLogout = () => {
    logout();
    navigate("/signin");
  };

  const initials = (nameOrEmail = "") => {
    if (!nameOrEmail) return "🙂";
    const parts = nameOrEmail.trim().split(/\s+/);
    if (parts.length >= 2) return (parts[0][0] + parts[1][0]).toUpperCase();
    return nameOrEmail[0]?.toUpperCase() || "🙂";
  };

  useEffect(() => {
    if (onToggle) onToggle(expanded);
  }, [expanded]);

  return (
    <aside className={`vertical-navbar ${expanded ? "" : "collapsed"}`}>
      {/* 🌟 Header */}
      <div className="nav-header" onClick={() => navigate("/home")}>
        <img src={logo} alt="Wanderly Logo" className="nav-logo" />
        {expanded && <span className="brand-text">Wanderly</span>}
      </div>

      {/* 👤 Profile Section */}
      {user && (
        <div className="nav-user">
          <div className="profile-info">
            {user.profilePic ? (
              <img
                src={user.profilePic}
                alt="Profile"
                className="profile-pic-top"
              />
            ) : (
              <div className="profile-initials-top">
                {initials(user.fullName || user.email)}
              </div>
            )}
            {expanded && (
              <span className="profile-name-top">
                {user.fullName || "Traveler"}
              </span>
            )}
          </div>

          {/* 💜 Quick Buttons under Profile */}
          <div className="nav-divider"></div>

          {expanded && (
            <div className="profile-quick-actions">
              <NavLink
                to="/mytrips"
                className={({ isActive }) =>
                  isActive ? "quick-btn active" : "quick-btn"
                }
              >
                🧳 My Trips
              </NavLink>
              <NavLink
                to="/memories"
                className={({ isActive }) =>
                  isActive ? "quick-btn active" : "quick-btn"
                }
              >
                📸 Memories
              </NavLink>
              <NavLink
                to="/budget"
                className={({ isActive }) =>
                  isActive ? "quick-btn active" : "quick-btn"
                }
              >
                💰 Budget
              </NavLink>
              <NavLink
                to="/packing"
                className={({ isActive }) =>
                  isActive ? "quick-btn active" : "quick-btn"
                }
              >
                🎒 Packing
              </NavLink>
            </div>
          )}
       

        </div>
        
      )}

      {/* 📋 Main Navigation */}
      <ul className="nav-links">
        {[
          ["🏠 Home", "/home"],
          ["🏡 Stays", "/stays"],
          ["✈️ Flights", "/flights"],
          ["🎁 Packages", "/packages"],
          ["🚗 Transport", "/transport"],
          ["🗻 Attractions", "/attractions"],
          ["🍽️ Dining", "/dining"],
          ["🎉 Events", "/events"],
          ["🗺️ Map", "/map"],
          ["🕰️ Timeline", "/timeline"],
          ["⚙️ Settings", "/settings"],
          ["💬 Help Center", "/help"],
        ].map(([label, path]) => (
          <li key={path}>
            <NavLink
              to={path}
              className={({ isActive }) =>
                isActive ? "nav-link-vertical active" : "nav-link-vertical"
              }
            >
              {expanded ? label : label.split(" ")[0]}
            </NavLink>
          </li>
        ))}
      </ul>

      {/* 🚪 Bottom Section */}
      <div className="nav-bottom">
        {!user && (
          <button className="login-btn" onClick={() => navigate("/signin")}>
            🔐 Account Login
          </button>
        )}
        {user && (
          <button className="logout-btn" onClick={handleLogout}>
            🚪 Logout
          </button>
        )}
        <button className="collapse-btn" onClick={toggleNavbar}>
          {expanded ? "⬅️ Collapse" : "➡️"}
        </button>
      </div>
    </aside>
  );
}
