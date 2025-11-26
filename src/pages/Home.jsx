import React, {
  useEffect,
  useState,
  useRef,
  useContext,
} from "react";
import { useNavigate, NavLink } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import "./Home.css";

import varImg from "../images/var.jpg";
import manImg from "../images/man.jpg";
import ham from "../images/ham.jpg";
import ooty from "../images/ooty.jpg";
import pandaPeek from "../assets/panda-peek.png";
import chibiMini from "../assets/chibi-mini.png";
import chibiHero from "../assets/chibi-hero.png";




import tajmahal from "../images/tajmahal.jpg";
import jaipur from "../images/jaipur.jpg";
import kerala from "../images/kerala.jpg";
import lehladakh from "../images/lehladakh.jpg";

import { UserContext } from "../context/UserContext";

export default function Home() {
  const [query, setQuery] = useState("");
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [listening, setListening] = useState(false);

  const [heroIndex, setHeroIndex] = useState(0);

  const navigate = useNavigate();
  const { user } = useContext(UserContext);

  // protect route
  useEffect(() => {
    if (!user) navigate("/signin");
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

  // parallax hero (subtle tilt)
  const heroRef = useRef(null);
  useEffect(() => {
    const el = heroRef.current;
    if (!el) return;

    const handle = (e) => {
      const rect = el.getBoundingClientRect();
      const x = ((e.clientX - rect.left) / rect.width - 0.5) * 10;
      const y = ((e.clientY - rect.top) / rect.height - 0.5) * 6;
      el.style.setProperty("--parallax-x", `${x}deg`);
      el.style.setProperty("--parallax-y", `${y}px`);
    };

    window.addEventListener("mousemove", handle);
    return () => window.removeEventListener("mousemove", handle);
  }, []);

  // voice search
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
      const trimmed = text.trim();
      setQuery(trimmed);
      setShowSuggestions(false);
      setListening(false);
      if (trimmed) {
        navigate(`/destination/${encodeURIComponent(trimmed)}`);
      }
    };

    r.onend = () => setListening(false);
    recognitionRef.current = r;
  }, [navigate]);

  const toggleListen = () => {
    if (!recognitionRef.current) {
      alert("Voice search not supported in this browser.");
      return;
    }
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

  // ================= HERO SLIDER CONTENT =================

  const heroSlides = [
    {
      img: varImg,
      tag: "Spiritual Trails",
      title: "Sunrise at Varanasi Ghats",
      desc: "Morning aarti by the Ganges, lanterns and chants under soft amber skies.",
      label: "Varanasi, Uttar Pradesh",
    },
    {
      img: manImg,
      tag: "Mountain Escapes",
      title: "Snowy Peaks of Manali",
      desc: "Cable cars, pine forests and slow café mornings.",
      label: "Manali, Himachal Pradesh",
    },
    {
      img: ham,
      tag: "Ancient Ruins",
      title: "Ruins of Hampi",
      desc: "Stone temples, boulder hills and golden riverside sunsets.",
      label: "Hampi, Karnataka",
    },
    {
      img: ooty,
      tag: "Tea Hill Getaway",
      title: "Mist Over Ooty Hills",
      desc: "Toy trains, tea gardens and cool breeze escapes.",
      label: "Ooty, Tamil Nadu",
    },
  ];

  const heroNextIndex = (index, step = 1) =>
    (index + step + heroSlides.length) % heroSlides.length;

  const heroPrev = () => setHeroIndex((prev) => heroNextIndex(prev, -1));
  const heroNext = () => setHeroIndex((prev) => heroNextIndex(prev, 1));

  // autoplay slider
  useEffect(() => {
    const id = setInterval(() => {
      setHeroIndex((prev) => heroNextIndex(prev, 1));
    }, 6500);
    return () => clearInterval(id);
  }, []);

  // ================= BELOW-HERO CONTENT =================

  const inspirations = [
    {
      img: varImg,
      title: "Varanasi",
      subtitle: "Riverside dawn rituals and heritage ghats.",
    },
    {
      img: manImg,
      title: "Manali",
      subtitle: "Mountain air, snow peaks and cosy stays.",
    },
    {
      img: ham,
      title: "Hampi",
      subtitle: "Ancient stones, sunsets and slow walks.",
    },
    {
      img: ooty,
      title: "Ooty",
      subtitle: "Toy trains, tea gardens and misty roads.",
    },
  ];

  return (
    <AnimatePresence mode="wait">
      <motion.div
        className="home-root"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
      >
        {/* ================= HERO ================= */}
        <section
          id="hero"
          className="hero-premium"
          ref={heroRef}
          style={{ backgroundImage: `url(${heroSlides[heroIndex].img})` }}
        >
          <div className="hero-gradient-overlay" />

          <div className="hero-content">
            <div className="hero-grid">
              {/* LEFT – main management card */}
              <div className="hero-left-card blob-shape">
              <div className="hero-chibi-welcome">
  <img src={chibiHero} alt="traveller chibi" className="chibi-welcome-img" />

  <div className="chibi-welcome-text">
    <h3>Welcome to Wanderly</h3>
    <p>Your cosy travel companion ☕✨</p>
  </div>
</div>

                {/* Panda mascot – cute peek animation */}
                <div className="hero-panda-wrap">
  <img src={pandaPeek} alt="panda" className="hero-panda-img" />
</div>


                <div className="hero-eyebrow">
                  WANDERLY • TRAVEL MANAGEMENT
                </div>

                <h1 className="hero-title welcome-title">
  Welcome to Wanderly, Traveller ✈️✨
</h1>


                <p className="hero-subtitle">
                  Discover destinations crafted like a perfect cup – layered,
                  warm and unforgettable. Plan, track and manage every journey
                  from a single, calm workspace.
                </p>

                <div className="hero-tag-row">
                  <span className="hero-tag-pill">Curated itineraries</span>
                  <span className="hero-tag-pill">Handpicked stays</span>
                  <span className="hero-tag-pill">Seamless bookings</span>
                </div>

                {/* search */}
                <div className="hero-search-shell">
                  <div className="hero-search-row">
                    <input
                      type="text"
                      placeholder="Search by city, country or experience"
                      value={query}
                      onChange={(e) => {
                        setQuery(e.target.value);
                        setShowSuggestions(true);
                      }}
                      onKeyDown={handleKeyDown}
                      onBlur={() =>
                        setTimeout(() => setShowSuggestions(false), 120)
                      }
                    />

                    <button
                      className={`hero-icon-btn mic-btn ${
                        listening ? "is-active" : ""
                      }`}
                      onClick={toggleListen}
                      type="button"
                    >
                      Mic
                    </button>

                    <button
                      className="hero-icon-btn search-btn"
                      onClick={() => handleSearch()}
                      type="button"
                    >
                      Go
                    </button>

                    {showSuggestions && filtered.length > 0 && (
                      <ul className="hero-suggestions">
                        {filtered.map((s, i) => (
                          <li
                            key={i}
                            onMouseDown={() => {
                              setQuery(s);
                              setShowSuggestions(false);
                              handleSearch(s);
                            }}
                          >
                            <span>{s}</span>
                            <span className="hero-suggestion-arrow">↗</span>
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>

                  <div className="hero-metrics">
                    <div className="hero-metric">
                      <span className="metric-label">Trips planned</span>
                      <span className="metric-value">1,248</span>
                    </div>
                    <div className="hero-metric">
                      <span className="metric-label">Cities covered</span>
                      <span className="metric-value">96</span>
                    </div>
                    <div className="hero-metric">
                      <span className="metric-label">Avg. rating</span>
                      <span className="metric-value">4.8</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* RIGHT – highlights + slider */}
              <div className="hero-right-column">
              <div className="hero-highlight-card blob-shape">

                  <h2 className="highlight-title">Today&apos;s Highlights</h2>
                  <p className="highlight-sub">
                    Handpicked places trending among modern travellers –
                    balanced between calm, culture and comfort.
                  </p>

                  <ul className="highlight-list">
                    <li>
                      <span className="dot" />
                      Weekend hill escapes – long views, slow mornings.
                    </li>
                    <li>
                      <span className="dot" />
                      Culture and heritage – walk through stories and old towns.
                    </li>
                    <li>
                      <span className="dot" />
                      Coastal slow stays – sea-facing rooms and quiet beaches.
                    </li>
                  </ul>

                  <button
                    type="button"
                    className="highlight-cta"
                    onClick={() => navigate("/about")}
                  >
                    Discover how Wanderly works
                  </button>
                </div>

                {/* slider zone */}
                <div className="hero-slider-wrapper">
                  <div className="hero-slider-header">
                    <span className="slider-title">Featured Destinations</span>
                    <div className="slider-nav">
                      <button type="button" onClick={heroPrev}>
                        ‹
                      </button>
                      <button type="button" onClick={heroNext}>
                        ›
                      </button>
                    </div>
                  </div>

                  <div className="hero-slider-grid">
                    {/* main card */}
                    <div className="hero-slider-main blob-shape"

                      style={{
                        backgroundImage: `url(${heroSlides[heroIndex].img})`,
                      }}
                    >
                      <div className="slider-main-overlay" />
                      <div className="slider-main-text">
                        <span className="slider-tag">
                          {heroSlides[heroIndex].tag}
                        </span>
                        <h3>{heroSlides[heroIndex].title}</h3>
                        <p>{heroSlides[heroIndex].desc}</p>
                        <button
                          type="button"
                          className="slider-main-cta"
                          onClick={() =>
                            navigate(
                              `/destination/${encodeURIComponent(
                                heroSlides[heroIndex].label
                              )}`
                            )
                          }
                        >
                          Explore destination
                        </button>
                      </div>
                    </div>

                    {/* side mini cards */}
                    <div className="hero-slider-side">
                      {[1, 2].map((step) => {
                        const idx = heroNextIndex(heroIndex, step);
                        const slide = heroSlides[idx];
                        return (
                          <button
                            key={idx}
                            type="button"
                            className="hero-slider-mini"
                            style={{ backgroundImage: `url(${slide.img})` }}
                            onClick={() => setHeroIndex(idx)}
                          >
                            <div className="hero-slider-mini-label">
                              <span>{slide.label}</span>
                              <span>↗</span>
                            </div>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
        {/* ================= COFFEE THEME BOTTOM HERO ================= */}
        <section className="bottom-hero-coffee">

<div className="coffee-box">
  <div className="bottom-hero-inner">


  {/* text */}
  <div className="coffee-hero-text">
    <h2 className="coffee-hero-title">Travel Made Warm, Easy & Personal ☕✨</h2>

    <p className="coffee-hero-sub">
      A cosy workspace designed to guide your journey—from planning
      to booking—served with caramel calm and mocha clarity.
    </p>

    <button
      className="coffee-hero-btn"
      type="button"
      onClick={() => navigate("/about")}
    >
      Learn More
    </button>
  </div>

  {/* girl */}
  <div className="coffee-hero-girl">
    <img src={chibiMini} alt="Traveller Girl" />
  </div>

</div>
</div>
</section>




        {/* ================= BELOW HERO ================= */}
        <div className="section-wrapper">
          {/* Travel Inspiration */}
          <section className="pull-section">
            <div className="pull-header">
              <div className="pull-badge">TI</div>
              <div className="pull-label">
                <span className="pull-title">Travel Inspiration</span>
                <span className="pull-sub">
                  Quick ideas to start planning your next journey.
                </span>
              </div>
            </div>

            <div className="pull-envelope">
              <div className="pull-envelope-inner">
                <div className="inspo-carousel">
                  {inspirations.map((it, i) => (
                    <div key={i} className="cloud-card inspo-card">
                      <img
                        src={it.img}
                        alt={it.title}
                        className="inspo-img"
                      />
                      <h5>{it.title}</h5>
                      <p>{it.subtitle}</p>
                      <button
                        className="cloud-btn"
                        type="button"
                        onClick={() =>
                          navigate(
                            `/destination/${encodeURIComponent(it.title)}`
                          )
                        }
                      >
                        View details
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </section>

          {/* Popular Destinations */}
          <section className="pull-section">
            <div className="pull-header">
              <div className="pull-badge">PD</div>
              <div className="pull-label">
                <span className="pull-title">Popular Destinations</span>
                <span className="pull-sub">
                  Places your fellow travellers are bookmarking the most.
                </span>
              </div>
            </div>

            <div className="pull-envelope">
              <div className="pull-envelope-inner popular-grid">
                {[
                  { img: tajmahal, title: "Taj Mahal, Agra" },
                  { img: jaipur, title: "Jaipur, Rajasthan" },
                  { img: kerala, title: "Kerala Backwaters" },
                  { img: lehladakh, title: "Leh Ladakh" },
                ].map((place, i) => (
                  <div key={i} className="cloud-card popular-card">
                    <img
                      src={place.img}
                      alt={place.title}
                      className="popular-img"
                    />
                    <h5>{place.title}</h5>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* Top Deals */}
          <section className="pull-section">
            <div className="pull-header">
              <div className="pull-badge">TD</div>
              <div className="pull-label">
                <span className="pull-title">Top Deals & Offers</span>
                <span className="pull-sub">
                  Curated value trips across flights, stays and experiences.
                </span>
              </div>
            </div>

            <div className="pull-envelope">
              <div className="pull-envelope-inner deal-grid">
                {[
                  {
                    title: "Flights to Dubai",
                    desc: "Save up to 20% on select departures this month.",
                  },
                  {
                    title: "Hotels in Goa",
                    desc: "Stay 3 nights, get the 4th night complimentary.",
                  },
                  {
                    title: "Bali Packages",
                    desc: "Up to 30% off curated week-long bundles.",
                  },
                ].map((deal, i) => (
                  <div key={i} className="cloud-card deal-card">
                    <h4>{deal.title}</h4>
                    <p>{deal.desc}</p>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* Why Choose Us */}
          <section className="pull-section">
            <div className="pull-header">
              <div className="pull-badge">WU</div>
              <div className="pull-label">
                <span className="pull-title">Why Choose Wanderly?</span>
                <span className="pull-sub">
                  Built for travellers who like clarity, control and comfort.
                </span>
              </div>
            </div>

            <div className="pull-envelope">
              <div className="pull-envelope-inner why-grid">
                {[
                  {
                    title: "Best Prices",
                    desc: "We compare across 100+ providers to secure consistent value.",
                  },
                  {
                    title: "Easy Booking",
                    desc: "Flights, stays and packages in a few clear, guided steps.",
                  },
                  {
                    title: "24/7 Support",
                    desc: "Assistance for changes, delays or last-minute plans.",
                  },
                  {
                    title: "Secure Payments",
                    desc: "Enterprise-grade encryption and multiple payment options.",
                  },
                  {
                    title: "Tailored Experiences",
                    desc: "Trips recommended based on your style and pace of travel.",
                  },
                  {
                    title: "Single Workspace",
                    desc: "Manage itineraries, vouchers and updates in one place.",
                  },
                ].map((why, i) => (
                  <div key={i} className="cloud-card why-card">
                    <h3>{why.title}</h3>
                    <p>{why.desc}</p>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* About Wanderly */}
          <section className="pull-section">
            <div className="pull-header">
              <div className="pull-badge">AB</div>
              <div className="pull-label">
                <span className="pull-title">About Wanderly</span>
                <span className="pull-sub">
                  A focused platform for calm, well-planned journeys.
                </span>
              </div>
            </div>

            <div className="pull-envelope">
              <div className="pull-envelope-inner">
                <div className="cloud-card about-card">
                  <h2>About Wanderly</h2>
                  <p>
                    Wanderly is designed to make travel{" "}
                    <b>structured, affordable and memorable</b>. From flights and
                    stays to cabs and local experiences, everything is organised
                    into a single, clear view – so you always know what comes
                    next in your journey.
                  </p>
                  <NavLink
                    to="/about"
                    className="cloud-btn"
                    style={{ marginTop: "14px", display: "inline-block" }}
                  >
                    Learn more
                  </NavLink>
                </div>
              </div>
            </div>
          </section>

          {/* Newsletter */}
          <section className="pull-section">
            <div className="pull-header">
              <div className="pull-badge">NL</div>
              <div className="pull-label">
                <span className="pull-title">Stay Updated</span>
                <span className="pull-sub">
                  Quiet, useful updates on offers and new itineraries.
                </span>
              </div>
            </div>

            <div className="pull-envelope">
              <div className="pull-envelope-inner">
                <div className="cloud-card newsletter-card">
                  <h2>Stay Updated</h2>
                  <p>
                    Subscribe to receive curated travel deals and planning tips
                    directly in your inbox.
                  </p>
                  <div className="newsletter-input">
                    <input type="email" placeholder="Enter your email" />
                    <button className="cloud-btn" type="button">
                      Subscribe
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </section>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}

