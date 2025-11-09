import React, { useEffect, useState } from "react";
import { NavLink } from "react-router-dom";
import { motion } from "framer-motion";
import "./About.css";

export default function About() {
  const [counters, setCounters] = useState({
    travelers: 0,
    destinations: 0,
    deals: 0,
  });
  const [animated, setAnimated] = useState(false);

  useEffect(() => {
    const animateValue = (key, target, duration) => {
      let start = 0;
      const stepTime = Math.abs(Math.floor(duration / target));
      const timer = setInterval(() => {
        start += 1;
        setCounters((prev) => ({ ...prev, [key]: start }));
        if (start >= target) clearInterval(timer);
      }, stepTime);
    };

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && !animated) {
          animateValue("travelers", 50000, 2000);
          animateValue("destinations", 120, 2000);
          animateValue("deals", 300, 2000);
          setAnimated(true);
        }
      },
      { threshold: 0.5 }
    );

    const target = document.querySelector("#stats-section");
    if (target) observer.observe(target);
    return () => observer.disconnect();
  }, [animated]);

  // Auto Play Video Fix
  useEffect(() => {
    const video = document.getElementById("about-video");
    if (video) {
      const playPromise = video.play();
      if (playPromise !== undefined) {
        playPromise.catch(() => {
          const tryPlay = setInterval(() => video.play().catch(() => {}), 1000);
          setTimeout(() => clearInterval(tryPlay), 6000);
        });
      }
    }
  }, []);

  return (
    <div className="about-page">
      {/* 🎥 Cinematic Video */}
      <div className="video-container">
        <video
          id="about-video"
          className="about-video-bg"
          autoPlay
          loop
          muted
          playsInline
          preload="auto"
        >
          <source src="/videos/aboutbg.mp4" type="video/mp4" />
          Your browser does not support the video tag.
        </video>
        <div className="video-overlay"></div>
      </div>

      {/* 🌈 Aurora Layer */}
      <div className="aurora"></div>

      {/* 🌍 Main Content */}
      <motion.div
        className="about-content"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 1.5 }}
      >
        {/* 🪐 Hero Section */}
        <section className="about-hero">
          <h1>💫 About Wanderly</h1>
          <p>Your ultimate travel companion — making trips seamless, affordable, and memorable.</p>
        </section>

        {/* 🌟 Core Values */}
        <section className="container py-5 core-values">
          <h2 className="section-heading">🤍 Our Core Values</h2>
          <div className="row g-4 justify-content-center">
            {[
              {
                icon: "🎯",
                title: "Mission",
                desc: "Make travel booking simple, affordable, and stress-free for every explorer.",
              },
              {
                icon: "🚀",
                title: "Vision",
                desc: "To inspire the world with smart travel solutions and unforgettable journeys.",
              },
              {
                icon: "🤝",
                title: "Promise",
                desc: "Transparent pricing, secure payments, and 24/7 support for worry-free adventures.",
              },
            ].map((item, i) => (
              <motion.div
                key={i}
                className="col-md-4"
                whileHover={{ scale: 1.08 }}
                transition={{ type: "spring", stiffness: 120 }}
              >
                <div className="glass-card">
                  <h3>{item.icon} {item.title}</h3>
                  <p>{item.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </section>

        {/* 📊 Stats Section */}
        <section id="stats-section" className="stats-section py-5">
          <h2 className="section-heading">📊 Wanderly in Numbers</h2>
          <div className="row g-5 justify-content-center">
            {[
              { number: counters.travelers, text: "Happy Travelers", suffix: "+", max: 50000 },
              { number: counters.destinations, text: "Destinations Covered", suffix: "+", max: 120 },
              { number: counters.deals, text: "Exclusive Deals", suffix: "+", max: 300 },
            ].map((stat, i) => (
              <div key={i} className="col-md-4">
                <div className="stat-box">
                  <h1 className="stat-number">
                    {stat.number}{stat.suffix}
                  </h1>
                  <p className="stat-label">{stat.text}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* 📩 Contact Section */}
        <section className="contact-section text-center">
          <h2 className="section-heading">📩 Contact Us</h2>
          <p>Email: <a href="mailto:support@wanderly.com">support@wanderly.com</a></p>
          <p>Phone: +91 98765 43210</p>
          <p>Location: Hyderabad, India 🌆</p>
        </section>

        {/* 🚀 CTA Section */}
        <section className="cta-section text-center">
          <h2>🚀 Ready to Explore the World?</h2>
          <p>Join Wanderly today and unlock unique travel experiences.</p>
          <NavLink to="/register" className="btn-glow">
            Get Started ✈️
          </NavLink>
        </section>
      </motion.div>
    </div>
  );
}
