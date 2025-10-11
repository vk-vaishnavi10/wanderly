import React, { useState } from "react";
import { Link } from "react-router-dom";
import "./Events.css";

// ✅ Local images
import ocImg from "../images/oc.jpg";
import royalImg from "../images/royal.jpg";
import ffImg from "../images/ff.jpeg";

export default function Events() {
  const [query, setQuery] = useState("");

  // ✅ Static event data
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
      {/* ✨ Floating Gold Particles */}
      {Array.from({ length: 12 }).map((_, i) => (
        <div key={i} className={`particle particle-${i + 1}`}></div>
      ))}

      {/* 🎊 Hero Section */}
      <section className="events-hero text-center">
        <h1 className="hero-title">🎉 Events & Experiences</h1>
        <p className="hero-sub">
          Discover festivals, shows, and unique cultural gatherings.
        </p>

        {/* ✅ Single Search Bar */}
        <div className="search-box">
          <input
            type="text"
            placeholder="Search event..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
        </div>
      </section>

      {/* ✨ Event Cards */}
      <section className="container py-5">
        <h2 className="text-center mb-4 text-warning glow-heading">
          ✨ Upcoming Events
        </h2>

        <div className="row g-4">
          {filteredEvents.length > 0 ? (
            filteredEvents.map((event) => (
              <div key={event.id} className="col-md-4">
                <div className="event-card shadow-lg border border-warning rounded-3 overflow-hidden">
                  <img
                    src={event.imageUrl}
                    alt={event.title}
                    className="event-img w-100"
                  />
                  <div className="p-3 bg-dark text-light">
                    <h4 className="text-warning event-title">{event.title}</h4>
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
