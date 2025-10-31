import React, { useContext, useEffect, useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { UserContext } from "../context/UserContext.jsx";
import logo from "../images/travellogo.jpeg";
import "./Navbar.css";

export default function Navbar() {
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();
  const { user, logout } = useContext(UserContext);

  const [myTripsOpen, setMyTripsOpen] = useState(false);
  const [theme, setTheme] = useState(localStorage.getItem("wanderly-theme") || "dark");
  const [travelMode, setTravelMode] = useState(localStorage.getItem("wanderly-mode") || "explore");

  // 🌐 Change language instantly
  const changeLanguage = (lang) => {
    i18n.changeLanguage(lang);
    localStorage.setItem("wanderly-lang", lang);
  };

  // 🧭 Generate user initials
  const initials = (nameOrEmail = "") => {
    if (!nameOrEmail) return "🙂";
    const parts = nameOrEmail.trim().split(/\s+/);
    if (parts.length >= 2) return (parts[0][0] + parts[1][0]).toUpperCase();
    return nameOrEmail[0]?.toUpperCase() || "🙂";
  };

  // 🚪 Logout handler
  const handleLogout = () => {
    logout();
    navigate("/signin");
  };

  // 🌗 Apply and persist theme globally
  useEffect(() => {
    document.body.classList.remove("theme-dark", "theme-light", "theme-auto");
    document.body.classList.add(`theme-${theme}`);
    localStorage.setItem("wanderly-theme", theme);
  }, [theme]);

  // 🧭 Apply and persist travel mode (future use in ChatBox)
  useEffect(() => {
    localStorage.setItem("wanderly-mode", travelMode);
    console.log(`🌍 Travel Mode: ${travelMode}`);
  }, [travelMode]);

  return (
    <nav className="navbar navbar-expand-lg fixed-top custom-navbar">
      <div className="container-fluid d-flex align-items-center justify-content-between">
        {/* 🌟 Brand */}
        <NavLink to="/" className="navbar-brand d-flex align-items-center">
          <img src={logo} alt="Wanderly Logo" className="navbar-logo me-2" />
          <span className="brand-text">Wanderly</span>
        </NavLink>

        {/* 🌍 Center Navigation Links */}
        <ul className="navbar-nav mx-auto d-flex flex-row gap-3 fs-6">
          {[
            ["stays", "/stays"],
            ["flights", "/flights"],
            ["packages", "/packages"],
            ["transport", "/transport"],
            ["attractions", "/attractions"],
            ["dining", "/dining"],
            ["events", "/events"],
          ].map(([label, path]) => (
            <li key={path} className="nav-item">
              <NavLink className="nav-link" to={path}>
                {t(label)}
              </NavLink>
            </li>
          ))}
        </ul>

        {/* 🌟 Right Controls */}
        <div className="d-flex align-items-center gap-2">
          {/* 🧳 MyTrips Hover */}
          <div
            className="mytrips-wrapper position-relative"
            onMouseEnter={() => setMyTripsOpen(true)}
            onMouseLeave={() => setMyTripsOpen(false)}
          >
            <NavLink to="/mytrips" className="mytrips-btn">
              MyTrips
            </NavLink>

            <div className={`mytrips-preview ${myTripsOpen ? "open" : ""}`} role="dialog">
              <div className="preview-item">
                <div className="small-dot" />
                <div>
                  <div className="muted">Upcoming</div>
                  <div className="preview-title">Goa Beach Trip • Dec 2025</div>
                </div>
              </div>
              <div className="preview-item">
                <div className="small-dot" />
                <div>
                  <div className="muted">Bookings</div>
                  <div className="preview-title">2 Flights • 1 Hotel</div>
                </div>
              </div>
              <div className="preview-actions mt-2">
                <NavLink to="/mytrips" className="btn btn-sm btn-outline-warning me-2">
                  View All
                </NavLink>
                {!user && (
                  <NavLink to="/register" className="btn btn-sm btn-warning">
                    Sign Up
                  </NavLink>
                )}
              </div>
            </div>
          </div>

          {/* 🌐 Language + Mode + Theme Dropdown */}
          <div className="dropdown">
            <button
              className="mytrips-btn dropdown-toggle"
              id="settingsDropdown"
              data-bs-toggle="dropdown"
              aria-expanded="false"
              title="Settings"
            >
              ⚙️ Wanderly
            </button>

            <ul className="dropdown-menu dropdown-menu-end shadow-sm p-2" aria-labelledby="settingsDropdown">
              <li className="dropdown-header text-warning fw-bold">🌍 Language</li>
              {[
                ["en", "English"],
                ["hi", "हिन्दी"],
                ["es", "Español"],
                ["fr", "Français"],
                ["de", "Deutsch"],
              ].map(([code, label]) => (
                <li key={code}>
                  <button className="dropdown-item" onClick={() => changeLanguage(code)}>
                    {label}
                  </button>
                </li>
              ))}
              <li><hr className="dropdown-divider" /></li>

              <li className="dropdown-header text-warning fw-bold">🧭 Travel Mode</li>
              {["Explore", "Plan", "Adventure", "Relax"].map((mode) => (
                <li key={mode}>
                  <button
                    className={`dropdown-item ${travelMode === mode.toLowerCase() ? "active" : ""}`}
                    onClick={() => setTravelMode(mode.toLowerCase())}
                  >
                    {mode}
                  </button>
                </li>
              ))}
              <li><hr className="dropdown-divider" /></li>

              <li className="dropdown-header text-warning fw-bold">🌗 Theme</li>
              {["Dark", "Light", "Auto"].map((th) => (
                <li key={th}>
                  <button
                    className={`dropdown-item ${theme === th.toLowerCase() ? "active" : ""}`}
                    onClick={() => setTheme(th.toLowerCase())}
                  >
                    {th}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* 👤 Auth / Profile */}
          {!user ? (
            <>
              <NavLink to="/register" className="glass-btn-special">
                {t("register")}
              </NavLink>
              <NavLink to="/signin" className="glass-btn-special-outline">
                {t("signin")}
              </NavLink>
            </>
          ) : (
            <div className="dropdown">
              <button
                className="btn btn-dark d-flex align-items-center px-2 py-1 rounded-pill"
                data-bs-toggle="dropdown"
                aria-expanded="false"
              >
                <span
                  className="navbar-avatar d-inline-flex justify-content-center align-items-center rounded-circle me-2 overflow-hidden"
                  onClick={() => navigate("/profile")}
                  title="Open profile"
                >
                  {user.profilePic ? (
                    <img src={user.profilePic} alt="Profile" className="navbar-avatar-img" />
                  ) : (
                    <span className="navbar-avatar-fallback">
                      {initials(user.fullName || user.email)}
                    </span>
                  )}
                </span>
                <span className="d-none d-sm-inline">{user.fullName || user.email}</span>
                <i className="bi bi-caret-down-fill ms-2" />
              </button>

              <ul className="dropdown-menu dropdown-menu-end shadow-sm">
                <li>
                  <NavLink className="dropdown-item" to="/profile">
                    <i className="bi bi-person me-2" /> Profile
                  </NavLink>
                </li>
                <li>
                  <NavLink className="dropdown-item" to="/mytrips">
                    <i className="bi bi-suitcase2 me-2" /> My Trips
                  </NavLink>
                </li>
                <li><hr className="dropdown-divider" /></li>
                <li>
                  <button className="dropdown-item text-danger" onClick={handleLogout}>
                    <i className="bi bi-box-arrow-right me-2" /> Logout
                  </button>
                </li>
              </ul>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}
