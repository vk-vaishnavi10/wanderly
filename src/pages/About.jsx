import React, { useEffect, useRef, useState } from "react";
import { NavLink } from "react-router-dom";
import { motion } from "framer-motion";
import "./About.css";

export default function About() {
  const [counters, setCounters] = useState({
    travelers: 0,
    destinations: 0,
    deals: 0,
  });
  const animatedRef = useRef(false);

  // Smooth, CPU-safe counters
  useEffect(() => {
    const targets = { travelers: 50000, destinations: 120, deals: 300 };
    const duration = 2000; // ms
    const fps = 60;
    const stepMs = 1000 / fps; // ~16ms
    const totalSteps = Math.max(1, Math.round(duration / stepMs));
    const increments = {
      travelers: Math.ceil(targets.travelers / totalSteps),
      destinations: Math.ceil(targets.destinations / totalSteps),
      deals: Math.ceil(targets.deals / totalSteps),
    };

    let t = 0;
    let timer;

    const startCounters = () => {
      if (animatedRef.current) return;
      animatedRef.current = true;
      timer = setInterval(() => {
        t += 1;
        setCounters((prev) => ({
          travelers: Math.min(targets.travelers, prev.travelers + increments.travelers),
          destinations: Math.min(targets.destinations, prev.destinations + increments.destinations),
          deals: Math.min(targets.deals, prev.deals + increments.deals),
        }));
        if (t >= totalSteps) clearInterval(timer);
      }, stepMs);
    };

    const el = document.querySelector("#stats-section");
    if (!el) return;

    const io = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) startCounters();
      },
      { threshold: 0.5 }
    );
    io.observe(el);

    return () => {
      io.disconnect();
      if (timer) clearInterval(timer);
    };
  }, []);

  // Force autoplay (with mute/inline) without spamming the main thread
  useEffect(() => {
    const v = document.getElementById("about-video");
    if (!v) return;
    const tryPlay = () => v.play().catch(() => {});
    tryPlay(); // first attempt
    const id = setTimeout(tryPlay, 600); // one gentle retry
    return () => clearTimeout(id);
  }, []);

  return (
    <div className="about-page">
      {/* 🎥 Cinematic Video */}
      <div className="video-container" aria-hidden="true">
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
        </video>
        <div className="video-overlay" />
      </div>

      {/* 🌈 Aurora Layer */}
      <div className="aurora" />

      {/* 🌍 Main Content */}
      <motion.div
        className="about-content"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.8 }}
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
                key={item.title}
                className="col-md-4"
                whileHover={{ scale: 1.06 }}
                transition={{ type: "spring", stiffness: 160, damping: 12 }}
              >
                <div className="glass-card">
                  <h3>
                    {item.icon} {item.title}
                  </h3>
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
              { number: counters.travelers, text: "Happy Travelers", suffix: "+" },
              { number: counters.destinations, text: "Destinations Covered", suffix: "+" },
              { number: counters.deals, text: "Exclusive Deals", suffix: "+" },
            ].map((stat) => (
              <div key={stat.text} className="col-md-4">
                <div className="stat-box">
                  <h1 className="stat-number">
                    {stat.number}
                    {stat.suffix}
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
          <p>
            Email: <a href="mailto:support@wanderly.com">support@wanderly.com</a>
          </p>
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
