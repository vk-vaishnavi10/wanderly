import React, { useContext, useState, useEffect, useRef } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { UserContext } from "../context/UserContext.jsx";
import logo from "../images/travellogo.jpeg";
import "./Navbar.css";

export default function Navbar() {
  const { user, logout } = useContext(UserContext);
  const navigate = useNavigate();

  const [expanded, setExpanded] = useState(true);
  const [profileExpanded, setProfileExpanded] = useState(false);
  const dropdownRef = useRef(null);

  const initials = (nameOrEmail = "") => {
    if (!nameOrEmail) return "🙂";
    const parts = nameOrEmail.split(" ");
    if (parts.length >= 2) return (parts[0][0] + parts[1][0]).toUpperCase();
    return nameOrEmail[0]?.toUpperCase() || "🙂";
  };

  useEffect(() => {
    const clickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setProfileExpanded(false);
      }
    };
    document.addEventListener("mousedown", clickOutside);
    return () => document.removeEventListener("mousedown", clickOutside);
  }, []);

  const handleLogout = () => {
    logout();
    navigate("/signin");
  };

  return (
    <>
      {/* ========================= */}
      {/* DESKTOP GLASS SIDEBAR */}
      {/* ========================= */}
      <aside className={expanded ? "vertical-navbar expanded" : "vertical-navbar collapsed"}>
        <div className="nav-toggle" onClick={() => setExpanded(!expanded)}>
          {expanded ? "◀" : "▶"}
        </div>

        <div className="nav-header" onClick={() => navigate("/home")}>
          <img src={logo} alt="Logo" className="nav-logo" />
          {expanded && <span className="brand-text">Wanderly</span>}
        </div>

        {user && (
          <div className="nav-user" ref={dropdownRef}>
            <div className="profile-info">
              {user.profilePic ? (
                <img src={user.profilePic} className="profile-pic-top" />
              ) : (
                <div className="profile-initials-top">
                  {initials(user.fullName || user.email)}
                </div>
              )}

              {expanded && (
                <div
                  className="profile-dropdown-toggle"
                  onClick={() => setProfileExpanded(!profileExpanded)}
                >
                  <span className="profile-name-top">
                    {user.fullName || "Traveler"}
                  </span>
                  <span className="profile-arrow">▾</span>
                </div>
              )}
            </div>

            {expanded && profileExpanded && (
              <div className="profile-quick-actions">
                <NavLink to="/mytrips" className="quick-btn">My Trips</NavLink>
                <NavLink to="/memories" className="quick-btn">Memories</NavLink>
                <NavLink to="/budget" className="quick-btn">Budget</NavLink>
                <NavLink to="/packing" className="quick-btn">Packing</NavLink>
              </div>
            )}
          </div>
        )}

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
            ["💬 Help", "/help"],
          ].map(([label, path]) => (
            <li key={path}>
              <NavLink
                to={path}
                className={({ isActive }) =>
                  isActive
                    ? "nav-link-vertical active"
                    : "nav-link-vertical"
                }
              >
                {expanded ? label : label.split(" ")[0]} 
              </NavLink>
            </li>
          ))}
        </ul>

        {user && expanded && (
          <button className="logout-btn" onClick={handleLogout}>
            Logout
          </button>
        )}
      </aside>

      {/* ========================= */}
      {/* MOBILE BOTTOM NAV BAR */}
      {/* ========================= */}
      <div className="mobile-nav">
        {[
          ["🏠", "/home"],
          ["✈️", "/flights"],
          ["🎁", "/packages"],
          ["🗺️", "/map"],
          ["⚙️", "/settings"],
        ].map(([icon, path]) => (
          <NavLink
            key={path}
            to={path}
            className={({ isActive }) =>
              isActive ? "mobile-nav-item active" : "mobile-nav-item"
            }
          >
            {icon}
          </NavLink>
        ))}
      </div>
    </>
  );
}
