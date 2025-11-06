import React from "react";
import "./Footer.css";
import {
  FaFacebookF,
  FaInstagram,
  FaTwitter,
  FaLinkedinIn,
  FaEnvelope,
  FaMapMarkerAlt,
  FaPhoneAlt,
} from "react-icons/fa";
import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <footer className="wanderly-footer">
      <div className="footer-main">
        {/* 🌈 Brand Section */}
        <div className="footer-brand">
          <h2 className="footer-logo">Wanderly ✈️</h2>
          <p className="footer-tagline">Explore. Dream. Discover. 🌍</p>
          <div className="footer-socials">
            <a href="#"><FaInstagram /></a>
            <a href="#"><FaTwitter /></a>
            <a href="#"><FaFacebookF /></a>
            <a href="#"><FaLinkedinIn /></a>
          </div>
        </div>

        {/* 🧭 Quick Links */}
        <div className="footer-links">
          <h4>Quick Links</h4>
          <Link to="/stays">🏨 Stays</Link>
          <Link to="/flights">✈️ Flights</Link>
          <Link to="/packages">🎒 Packages</Link>
          <Link to="/attractions">🌄 Attractions</Link>
          <Link to="/events">🎉 Events</Link>
        </div>

        {/* 💌 Contact Info */}
        <div className="footer-contact">
          <h4>Contact Us</h4>
          <p>
            <FaEnvelope /> support@wanderly.com
          </p>
          <p>
            <FaPhoneAlt /> +91 98765 43210
          </p>
          <p>
            <FaMapMarkerAlt /> Hyderabad, India 📍
          </p>
          <button className="join-btn">Join Wanderly 🚀</button>
        </div>
      </div>

      {/* 🌟 Divider */}
      <div className="footer-divider"></div>

      {/* 💜 Bottom Text */}
      <div className="footer-bottom">
        <p>
          Made with 💜 by <span className="team-name">Team Wanderly</span>
        </p>
        <p>© 2025 Wanderly. All rights reserved.</p>
      </div>
    </footer>
  );
};

export default Footer;
