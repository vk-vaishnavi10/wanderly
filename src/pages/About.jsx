import React, { useEffect, useState } from "react";
import { NavLink } from "react-router-dom";
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
      let stepTime = Math.abs(Math.floor(duration / target));
      let timer = setInterval(() => {
        start += 1;
        setCounters((prev) => ({ ...prev, [key]: start }));
        if (start >= target) {
          clearInterval(timer);
        }
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

  return (
    <div className="about-page" style={{ backgroundColor: "#000", color: "#FFD700" }}>
      
      {/* Hero Section */}
      <section
        className="about-hero text-center d-flex flex-column justify-content-center align-items-center"
        style={{
          backgroundImage:
            "url('https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=1400&q=80')",
          backgroundSize: "cover",
          backgroundPosition: "center",
          minHeight: "60vh",
          color: "#fff",
          textShadow: "0 0 15px rgba(0,0,0,0.8)",
        }}
      >
        <h1 className="fw-bold display-3 text-warning">🌍 About Wanderly</h1>
        <p className="lead mt-3">
          Your ultimate travel companion — making trips seamless, affordable, and memorable.
        </p>
      </section>

      {/* Mission, Vision, Promise */}
      <section className="container py-5 text-center">
        <h2 className="mb-4 text-warning">✨ Our Core Values</h2>
        <div className="row g-4">
          {[
            {
              icon: "🎯",
              title: "Mission",
              desc: "Make travel booking simple, affordable, and stress-free for solo travelers, families, and explorers.",
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
          ].map((val, i) => (
            <div key={i} className="col-md-4">
              <div
                className="p-4 rounded glass-card h-100"
                style={{
                  background: "rgba(255, 215, 0, 0.05)",
                  border: "1px solid #FFD700",
                  boxShadow: "0 0 15px rgba(255, 215, 0, 0.3)",
                }}
              >
                <h3 className="text-warning">{val.icon} {val.title}</h3>
                <p className="mt-3 text-light">{val.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Stats Section */}
      <section id="stats-section" className="stats-section text-center py-5 bg-dark">
        <div className="container">
          <h2 className="mb-4 text-warning">📊 Wanderly in Numbers</h2>
          <div className="row g-5">
            {[
              { number: counters.travelers, text: "Happy Travelers", suffix: "+", max: 50000 },
              { number: counters.destinations, text: "Destinations Covered", suffix: "+", max: 120 },
              { number: counters.deals, text: "Exclusive Deals", suffix: "+", max: 300 },
            ].map((stat, i) => (
              <div key={i} className="col-md-4">
                <div className="stat-box">
                  <h1 className="fw-bold text-warning">
                    {stat.number}{stat.suffix}
                  </h1>
                  <p className="text-light">{stat.text}</p>

                  {/* Glowing Progress Bar */}
                  <div
                    className="progress"
                    style={{
                      height: "10px",
                      borderRadius: "5px",
                      background: "#222",
                      boxShadow: "inset 0 0 10px rgba(255,215,0,0.2)",
                    }}
                  >
                    <div
                      className="progress-bar"
                      style={{
                        width: `${(stat.number / stat.max) * 100}%`,
                        background: "#FFD700",
                        boxShadow: "0 0 15px #FFD700, 0 0 30px #FFD700, 0 0 45px #ffcc00",
                        transition: "width 0.6s ease-in-out",
                      }}
                    ></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section className="container py-5 text-center">
        <h2 className="mb-4 text-warning">📩 Contact Us</h2>
        <p>Email: <a href="mailto:support@wanderly.com" className="text-warning">support@wanderly.com</a></p>
        <p>Phone: <span className="text-warning">+91 98765 43210</span></p>
        <p>Location: Hyderabad, India 🌆</p>
      </section>

      {/* Call to Action */}
      <section className="text-center py-5 bg-dark">
        <h2 className="fw-bold text-warning">🚀 Ready to Explore the World?</h2>
        <p className="text-light">Join Wanderly today and unlock unique travel experiences.</p>
        <NavLink to="/register" className="btn btn-warning fw-bold px-5 mt-3">
          Get Started
        </NavLink>
      </section>
    </div>
  );
}
