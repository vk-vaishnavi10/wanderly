import React from "react";
import "./Footer.css";
import { FaFacebookF, FaInstagram, FaTwitter } from "react-icons/fa";

const Footer = () => {
  return (
    <footer>
      <div className="footer-container">
        <h2>Contact Us</h2>
        <p>Email: <a href="mailto:support@wanderly.com">support@wanderly.com</a></p>
        <p>Phone: <a href="tel:+919876543210">+91 98765 43210</a></p>
        <p>Location: Hyderabad, India 📍</p>

        <div className="social-icons">
          <a href="#"><FaFacebookF /></a>
          <a href="#"><FaInstagram /></a>
          <a href="#"><FaTwitter /></a>
        </div>

        <div className="footer-divider"></div>

        <p className="footer-tagline">🚀 Ready for your next adventure?</p>
        <button className="join-btn">Join Wanderly Now</button>

        <p className="footer-bottom">© 2025 Wanderly. All rights reserved.</p>
      </div>
    </footer>
  );
};

export default Footer;
