import React, { useState } from "react";
import { Link } from "react-router-dom";
import "./Events.css";
import eventsVideo from "../assets/videos/eventbg.mp4"; // 🎥 Background video

// ✅ Local images
import ocImg from "../images/oc.jpg";
import royalImg from "../images/royal.jpg";
import ffImg from "../images/ff.jpeg";

export default function Events() {
  const [query, setQuery] = useState("");

  const events = [
    {
      id: 1,
      title: "Ocean Beats Music Festival",
      location: "Baga Beach, Goa",
      date: "2025-10-15",
      imageUrl: ocImg,
    },
    {
      id: 2,
      title: "Royal Heritage Cultural Gala",
      location: "Amber Fort, Jaipur",
      date: "2025-11-21",
      imageUrl: royalImg,
    },
    {
      id: 3,
      title: "World Street Food Carnival",
      location: "Jio World Garden, Mumbai",
      date: "2025-12-05",
      imageUrl: ffImg,
    },
  ];

  const filteredEvents = query
    ? events.filter((event) =>
        event.title.toLowerCase().includes(query.toLowerCase())
      )
    : events;

  return (
    <div className="events-page position-relative">
      {/* 🎥 Background Video */}
      <video className="events-bg-video" autoPlay loop muted playsInline>
        <source src={eventsVideo} type="video/mp4" />
      </video>

      {/* ✨ Gradient Overlay */}
      <div className="events-overlay"></div>

      {/* 🎊 Floating Confetti Sparkles */}
      {Array.from({ length: 25 }).map((_, i) => (
        <div key={i} className={`confetti confetti-${i + 1}`}></div>
      ))}

      {/* 🎉 Hero Section */}
      <section className="events-hero text-center">
        <h1 className="hero-title">🎆 Events & Experiences</h1>
        <p className="hero-sub">
          Discover festivals, shows, and unique cultural gatherings.
        </p>

        {/* 🔍 Search */}
        <div className="search-box">
          <input
            type="text"
            placeholder="Search event..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
        </div>
      </section>

      {/* 🎟 Events List */}
      <section className="container py-5">
        <h2 className="text-center mb-4 glow-heading">✨ Upcoming Events</h2>

        <div className="row g-4">
          {filteredEvents.length > 0 ? (
            filteredEvents.map((event) => (
              <div key={event.id} className="col-md-4 fade-in">
                <div className="event-card">
                  <img
                    src={event.imageUrl}
                    alt={event.title}
                    className="event-img"
                  />
                  <div className="p-3 text-light">
                    <h4 className="event-title">{event.title}</h4>
                    <p>{event.location}</p>
                    <p>
                      <strong>Date:</strong>{" "}
                      {new Date(event.date).toLocaleDateString()}
                    </p>
                    <Link
                      to={`/events/${event.id}`}
                      className="btn btn-warning w-100 fw-bold mt-2"
                    >
                      View Details
                    </Link>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <h4 className="text-center text-warning">No events found 😢</h4>
          )}
        </div>
      </section>
    </div>
  );
}
