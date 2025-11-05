import React, { useEffect, useState, useRef } from "react";
import { useNavigate, NavLink } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import "./Home.css";
import varImg from "../images/var.jpg";
// Slideshow images
import { UserContext } from "../context/UserContext";
import { useContext } from "react";


import manImg from "../images/man.jpg";
import ham from "../images/ham.jpg";
import ooty from "../images/ooty.jpg";
import homeVideo from "../assets/videos/homebg.mp4";

// Popular Destinations
import tajmahal from "../images/tajmahal.jpg";
import jaipur from "../images/jaipur.jpg";
import kerala from "../images/kerala.jpg";
import lehladakh from "../images/lehladakh.jpg";

export default function Home() {
  const [query, setQuery] = useState("");
  
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [listening, setListening] = useState(false);
  const navigate = useNavigate();
  const { user } = useContext(UserContext);

useEffect(() => {
  if (!user) {
    navigate("/signin"); // 🚫 Redirect if not logged in
  }
}, [user, navigate]);



  const suggestions = [
    "Goa",
    "Dubai",
    "Bali",
    "Taj Mahal",
    "Jaipur",
    "Kerala",
    "Leh Ladakh",
    "Shimla",
    "Manali",
  ];

  const filtered = suggestions.filter((s) =>
    s.toLowerCase().includes(query.toLowerCase())
  );

  // Slideshow auto-advance
  

  // Parallax mouse movement
  const heroRef = useRef(null);
  useEffect(() => {
    const el = heroRef.current;
    if (!el) return;
    const handle = (e) => {
      const rect = el.getBoundingClientRect();
      const x = ((e.clientX - rect.left) / rect.width - 0.5) * 20;
      const y = ((e.clientY - rect.top) / rect.height - 0.5) * 10;
      el.style.setProperty("--parallax-x", `${x}deg`);
      el.style.setProperty("--parallax-y", `${y}px`);
    };
    window.addEventListener("mousemove", handle);
    return () => window.removeEventListener("mousemove", handle);
  }, []);

  // Reveal animations
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) entry.target.classList.add("visible");
        });
      },
      { threshold: 0.18 }
    );

    document
      .querySelectorAll(
        ".animate-card, .deal-card, .whyus-card, .extra-card, .inspo-card"
      )
      .forEach((el) => observer.observe(el));
  }, []);

  // Voice recognition
  const recognitionRef = useRef(null);
  useEffect(() => {
    const SpeechRecognition =
      window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) return;
    const r = new SpeechRecognition();
    r.lang = "en-IN";
    r.interimResults = false;
    r.maxAlternatives = 1;
    r.onresult = (e) => {
      const text = e.results[0][0].transcript;
      setQuery(text);
      setShowSuggestions(false);
      setListening(false);
      navigate(`/destination/${encodeURIComponent(text.trim())}`);
    };
    r.onend = () => setListening(false);
    recognitionRef.current = r;
  }, [navigate]);

  const toggleListen = () => {
    if (!recognitionRef.current)
      return alert("Voice search not supported in this browser.");
    if (listening) {
      recognitionRef.current.stop();
      setListening(false);
    } else {
      try {
        recognitionRef.current.start();
        setListening(true);
      } catch {
        setListening(false);
      }
    }
  };

  const handleSearch = (q) => {
    const finalQuery = (q ?? query).trim();
    if (!finalQuery) return;
    navigate(`/destination/${encodeURIComponent(finalQuery)}`);
  };

  const handleKeyDown = (e) => {
    if (e.key === "ArrowDown" || e.key === "ArrowUp") {
      e.preventDefault();
    } else if (e.key === "Enter") {
      handleSearch();
    } else if (e.key === "Escape") {
      setShowSuggestions(false);
    }
  };

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.12 } },
    exit: { opacity: 0 },
  };
  const itemVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: { opacity: 1, y: 0 },
  };

  const inspirations = [
    { img: varImg, title: "VARANASI", subtitle: "Uttar Pradesh Divine Experience" },
    { img: manImg, title: "MANALI", subtitle: "Manali vibes and mountain highs." },
    { img: ham, title: "HAMPI", subtitle: "Lost in the ancient charm of Hampi." },
    { img: ooty, title: "OOTY", subtitle: "Life's better in the hills of Ooty" },
  ];

  return (
    <AnimatePresence mode="wait">
      <motion.div
        className="home-root"
        initial="hidden"
        animate="visible"
        exit="exit"
        variants={containerVariants}
      >
        <section id="hero" className="hero-section" ref={heroRef}>

    <video className="hero-video-bg" autoPlay loop muted playsInline>
    <source src={homeVideo} type="video/mp4" />
  </video>
  <div className="hero-dark-overlay" />


  {/* ✨ Floating Headline & Search */}
  <div className="hero-floating-content">
    <motion.h1
      className="dreamy-heading"
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 1 }}
    >
      Every Destination Begins With a Dream
    </motion.h1>

    <motion.p
      className="dreamy-subtext"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 0.3 }}
    >
      Type your dream place and let’s go 🌍
    </motion.p>

    {/* 🌈 Floating Search Bar */}
    <motion.div
      className="floating-search-bar"
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.6 }}
    >
      <input
        type="text"
        placeholder="Where are you going?"
        value={query}
        onChange={(e) => {
          setQuery(e.target.value);
          setShowSuggestions(true);
        }}
        onKeyDown={handleKeyDown}
        onBlur={() => setTimeout(() => setShowSuggestions(false), 120)}
      />
      <button className="icon-btn mic-btn" onClick={toggleListen} title="Voice search">
        {listening ? "🎙️" : "🎤"}
      </button>
      <button className="search-icon-btn" onClick={() => handleSearch()}>
        🔍
      </button>
    </motion.div>

    {/* 🔽 Suggestions Dropdown */}
    {showSuggestions && filtered.length > 0 && (
      <motion.ul
        className="suggestions-list"
        initial={{ opacity: 0, y: -6 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.12 }}
      >
        {filtered.map((s, i) => (
          <li
            key={i}
            onMouseDown={() => {
              setQuery(s);
              setShowSuggestions(false);
              handleSearch(s);
            }}
          >
            {s}
          </li>
        ))}
      </motion.ul>
    )}
  </div>
</section>


        <div className="section-separator" />

        {/* Travel Inspiration */}
        <motion.section
          id="inspiration"
          className="container py-5"
          variants={itemVariants}
        >
          <h2 className="text-center mb-4">Travel Inspiration</h2>
          <div className="inspo-carousel d-flex gap-3 justify-content-center">
            {inspirations.map((it, i) => (
              <motion.div
                key={i}
                className="card inspo-card animate-card"
                whileHover={{ scale: 1.03, y: -6 }}
                transition={{ type: "spring", stiffness: 140 }}
              >
                <div className="inspo-img-wrap">
                  <img src={it.img} alt={it.title} />
                </div>
                <div className="card-body">
                  <h5>{it.title}</h5>
                  <p className="muted">{it.subtitle}</p>
                  <button
  className="btn btn-sm btn-outline-warning mt-2"
  onClick={() =>
    navigate(`/destination/${encodeURIComponent(it.title)}`)
  }
>
  Explore
</button>


                </div>
              </motion.div>
            ))}
          </div>
        </motion.section>

        <div className="section-separator" />

        {/* Popular Destinations */}
        <motion.section
          id="destinations"
          className="container py-5"
          variants={itemVariants}
        >
          <h2 className="text-center mb-4">Popular Destinations</h2>
          <div className="row g-4 text-center">
            {[
              { img: tajmahal, title: "Taj Mahal, Agra" },
              { img: jaipur, title: "Jaipur, Rajasthan" },
              { img: kerala, title: "Kerala Backwaters" },
              { img: lehladakh, title: "Leh Ladakh" },
            ].map((place, i) => (
              <div key={i} className="col-6 col-md-3 animate-card">
                <motion.div
                  className="card shadow-sm h-100 destination-card"
                  whileHover={{ scale: 1.03, y: -6 }}
                  transition={{ type: "spring", stiffness: 140 }}
                >
                  <img src={place.img} className="card-img-top" alt={place.title} />
                  <div className="card-body">
                    <h5 className="card-title">{place.title}</h5>
                  </div>
                </motion.div>
              </div>
            ))}
          </div>
        </motion.section>

        <div className="section-separator" />

        {/* Top Deals */}
        <motion.section
          id="deals"
          className="container py-5 text-center"
          variants={itemVariants}
        >
          <h2 className="mb-4 text-warning">🔥 Top Deals & Offers</h2>
          <div className="row g-4 mt-3">
            {[
              { title: "✈️ Flights to Dubai", desc: "Save up to 20% this month" },
              { title: "🏨 Hotels in Goa", desc: "Stay 3 nights, get 1 free" },
              { title: "🎒 Bali Packages", desc: "Up to 30% off holiday bundles" },
            ].map((deal, i) => (
              <motion.div key={i} className="col-md-4 deal-card" variants={itemVariants}>
                <div className="p-4 bg-dark text-light rounded shadow-sm border border-warning">
                  <h4>{deal.title}</h4>
                  <p>{deal.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.section>

        <div className="section-separator" />

        {/* Why Choose Us */}
        <motion.section
          id="why-us"
          className="container py-5 text-center"
          variants={itemVariants}
        >
          <h2 className="mb-4 text-warning">💎 Why Choose Wanderly?</h2>
          <div className="row g-4 mt-3">
            {[
              {
                title: "💰 Best Prices",
                desc: "We compare across 100+ travel sites to guarantee the lowest prices.",
              },
              {
                title: "⚡ Easy Booking",
                desc: "Book flights, hotels, cabs & packages in just a few clicks.",
              },
              {
                title: "🌍 24/7 Support",
                desc: "Your travel buddy — available anytime, anywhere.",
              },
              {
                title: "🔒 Secure Payments",
                desc: "Your data & payments are encrypted with top-grade security.",
              },
              {
                title: "✨ Tailored Experiences",
                desc: "Get personalized recommendations based on your interests.",
              },
            ].map((why, i) => (
              <div key={i} className="col-md-4 whyus-card">
                <motion.div
                  className="p-4 bg-dark text-light rounded shadow-sm border border-warning h-100"
                  whileHover={{ scale: 1.02 }}
                  transition={{ duration: 0.2 }}
                >
                  <h3>{why.title}</h3>
                  <p>{why.desc}</p>
                </motion.div>
              </div>
            ))}
          </div>
        </motion.section>

        <div className="section-separator" />

        {/* About */}
        <motion.section className="container py-5 text-center" variants={itemVariants}>
          <h2 className="mb-4 text-warning">📖 About Wanderly</h2>
          <p className="lead text-light">
            Wanderly is built with a mission to make travel{" "}
            <b>seamless, affordable, and memorable</b>. We bring everything —
            <b> flights, hotels, cars, attractions, and cabs</b> — into one
            platform.
          </p>

          <div className="row mt-4">
            {[
              {
                icon: "🚀",
                title: "Our Mission",
                desc: "To simplify travel planning by offering everything in one place.",
              },
              {
                icon: "🌟",
                title: "Our Vision",
                desc: "To be the world’s most trusted and traveler-friendly platform.",
              },
              {
                icon: "🤝",
                title: "Our Promise",
                desc: "Affordable deals, safe payments, and 24/7 dedicated support.",
              },
            ].map((card, i) => (
              <div key={i} className="col-md-4">
                <div className="p-4 bg-dark text-light rounded shadow-sm border border-warning extra-card h-100">
                  <h4>{card.icon} {card.title}</h4>
                  <p>{card.desc}</p>
                </div>
              </div>
            ))}
          </div>

          <NavLink to="/about" className="btn btn-warning fw-bold mt-4 px-4">
            Learn More →
          </NavLink>
        </motion.section>

        <div className="section-separator" />

        {/* Newsletter Signup */}
        <motion.section className="container py-5 text-center" variants={itemVariants}>
          <h2 className="text-warning">📩 Stay Updated</h2>
          <p>Subscribe to get the latest travel offers in your inbox</p>
          <div className="d-flex justify-content-center mt-3 flex-column flex-sm-row align-items-center gap-2">
            <input
              type="email"
              placeholder="Enter your email"
              className="form-control subscribe-input"
            />
            <button className="btn btn-warning fw-bold">Subscribe</button>
          </div>
        </motion.section>

        {/* Chat bubble assistant */}
       
      </motion.div>
    </AnimatePresence>
  );
}
