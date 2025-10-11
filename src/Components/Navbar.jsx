import React, { useState } from "react";
import { NavLink } from "react-router-dom";
import { useTranslation } from "react-i18next";
import logo from "../images/travellogo.jpeg";
import "./Navbar.css";

export default function Navbar() {
  const { t, i18n } = useTranslation();
  const [myTripsOpen, setMyTripsOpen] = useState(false);

  const changeLanguage = (lang) => {
    i18n.changeLanguage(lang);
  };

  return (
    <nav className="navbar navbar-expand-lg fixed-top custom-navbar">
      <div className="container-fluid d-flex align-items-center">
        {/* Brand */}
        <NavLink to="/" className="navbar-brand d-flex align-items-center">
          <img src={logo} alt="travellogo" className="navbar-logo me-2" />
          <span className="brand-text">Wanderly</span>
        </NavLink>

        {/* Center links */}
        <ul className="navbar-nav mx-auto d-flex flex-row gap-3 fs-6">
          <li className="nav-item">
            <NavLink className="nav-link" to="/stays">
              {t("stays")}
            </NavLink>
          </li>
          <li className="nav-item">
            <NavLink className="nav-link" to="/flights">
              {t("flights")}
            </NavLink>
          </li>
          <li className="nav-item">
            <NavLink className="nav-link" to="/packages">
              {t("packages")}
            </NavLink>
          </li>
          <li className="nav-item">
            <NavLink className="nav-link" to="/transport">
              Transport
            </NavLink>
          </li>
          <li className="nav-item">
            <NavLink className="nav-link" to="/attractions">
              {t("attractions")}
            </NavLink>
          </li>
          <li className="nav-item">
            <NavLink className="nav-link" to="/dining">
              Dining
            </NavLink>
          </li>
          <li className="nav-item">
            <NavLink className="nav-link" to="/events">
              Events
            </NavLink>
          </li>
        </ul>

        {/* Right-side actions */}
        <div className="d-flex align-items-center gap-2">
          <div
            className="mytrips-wrapper"
            onMouseEnter={() => setMyTripsOpen(true)}
            onMouseLeave={() => setMyTripsOpen(false)}
          >
            <NavLink to="/mytrips" className="mytrips-btn">
              MyTrips
            </NavLink>

            {/* Preview dropdown (appears on hover) */}
            <div className={`mytrips-preview ${myTripsOpen ? "open" : ""}`} role="dialog" aria-hidden={!myTripsOpen}>
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
              <div className="preview-actions">
                <NavLink to="/mytrips" className="btn btn-sm btn-outline-warning me-2">View All</NavLink>
                <NavLink to="/register" className="btn btn-sm btn-warning">Sign Up</NavLink>
              </div>
            </div>
          </div>

          {/* 🌐 Language Dropdown */}
          <div className="dropdown">
            <button
              className="mytrips-btn dropdown-toggle"
              type="button"
              id="languageDropdown"
              data-bs-toggle="dropdown"
              aria-expanded="false"
            >
              🌐
            </button>
            <ul
              className="dropdown-menu dropdown-menu-end"
              aria-labelledby="languageDropdown"
            >
              <li>
                <button className="dropdown-item" onClick={() => changeLanguage("en")}>English</button>
              </li>
              <li>
                <button className="dropdown-item" onClick={() => changeLanguage("hi")}>हिन्दी</button>
              </li>
              <li>
                <button className="dropdown-item" onClick={() => changeLanguage("es")}>Español</button>
              </li>
              <li>
                <button className="dropdown-item" onClick={() => changeLanguage("fr")}>Français</button>
              </li>
              <li>
                <button className="dropdown-item" onClick={() => changeLanguage("de")}>Deutsch</button>
              </li>
            </ul>
          </div>

          {/* Register & Sign In */}
          <NavLink to="/register" className="glass-btn-special">
            {t("register")}
          </NavLink>
          <NavLink to="/signin" className="glass-btn-special-outline">
            {t("signin")}
          </NavLink>
        </div>
      </div>
    </nav>
  );
}
