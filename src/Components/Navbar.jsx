import React, { useContext, useState, useEffect, useRef } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { UserContext } from "../context/UserContext.jsx";
import logo from "../images/travellogo.jpeg";
import "./Navbar.css";

export default function Navbar({ onToggle }) {
  const { user, logout } = useContext(UserContext);
  const navigate = useNavigate();

  // 🌈 States
  const [expanded, setExpanded] = useState(true); // whole sidebar
  const [profileExpanded, setProfileExpanded] = useState(false); // only profile toggle
  const [showDropdown, setShowDropdown] = useState(false);
  const dropdownRef = useRef(null);

  // 🌟 Handle logout
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

  // Close dropdown outside click
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setShowDropdown(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <aside className={`vertical-navbar ${expanded ? "" : "collapsed"}`}>
      {/* 🌟 Header */}
      <div className="nav-header" onClick={() => navigate("/home")}>
        <img src={logo} alt="Wanderly Logo" className="nav-logo" />
        {expanded && <span className="brand-text">Wanderly</span>}
      </div>

      {/* 👤 Profile Section */}
      {user && (
        <div className="nav-user" ref={dropdownRef}>
          {/* Profile Avatar + Name */}
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
              <div
                className={`profile-dropdown-toggle ${
                  profileExpanded ? "open" : ""
                }`}
                onClick={() => setProfileExpanded(!profileExpanded)}
              >
                <span className="profile-name-top">
                  {user.fullName || "Traveler"}
                </span>
                <span className="profile-arrow">▾</span>
              </div>
            )}
          </div>

          {/* 🌟 Quick Actions - visible only when profileExpanded is true */}
          {expanded && profileExpanded && (
            <div
              className={`profile-quick-actions ${
                profileExpanded ? "slide-down" : "slide-up"
              }`}
            >
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

          <div className="nav-divider"></div>
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
      </div>
    </aside>
  );
}
