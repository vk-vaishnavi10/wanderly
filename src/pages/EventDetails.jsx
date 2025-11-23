// src/pages/EventDetails.jsx
import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable";
import QRCode from "qrcode";

import "./EventDetails.css";

// Images
import ocImg from "../images/oc.jpg";
import royalImg from "../images/royal.jpg";
import ffImg from "../images/ff.jpeg";

// ⭐ Event cute dog mascot
import EventDogMascot from "../Components/EventDogMascot";

const eventsData = {
  1: {
    name: "Ocean Beats Music Festival",
    desc: "Dance under the stars with world-renowned DJs and beachside vibes.",
    img: ocImg,
    date: "2025-10-15",
    venue: "Baga Beach, Goa",
    guests: "Martin Garrix, Dua Lipa, Arijit Singh",
    tickets: [
      { type: "General Pass", price: 2000 },
      { type: "VIP Lounge", price: 6000 },
      { type: "Backstage Meet & Greet", price: 12000 },
    ],
  },
  2: {
    name: "Royal Heritage Cultural Gala",
    desc: "Experience classical performances, folk dances, and royal parades.",
    img: royalImg,
    date: "2025-11-21",
    venue: "Amber Fort, Jaipur",
    guests: "Rajasthani Folk Troupe, Classical Kathak Performers",
    tickets: [
      { type: "Standard Entry", price: 800 },
      { type: "Premium Balcony", price: 2500 },
      { type: "Royal Dining + Show", price: 7500 },
    ],
  },
  3: {
    name: "World Street Food Carnival",
    desc: "Taste global flavors with live food stalls, wine tasting, and celebrity chefs.",
    img: ffImg,
    date: "2025-12-05",
    venue: "Jio World Garden, Mumbai",
    guests: "Chef Vikas Khanna, Gordon Ramsay",
    tickets: [
      { type: "Entry Pass", price: 500 },
      { type: "All Access Tasting", price: 2500 },
      { type: "VIP Chef Table", price: 8000 },
    ],
  },
};

export default function EventDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const event = eventsData[id];

  const [countdown, setCountdown] = useState("");

  // Countdown Timer
  useEffect(() => {
    if (!event) return;
    const targetDate = new Date(event.date);

    const interval = setInterval(() => {
      const now = Date.now();
      const diff = targetDate - now;

      if (diff <= 0) {
        setCountdown("🎉 Event Started!");
        clearInterval(interval);
      } else {
        const d = Math.floor(diff / (1000 * 60 * 60 * 24));
        const h = Math.floor((diff / (1000 * 60 * 60)) % 24);
        const m = Math.floor((diff / (1000 * 60)) % 60);
        const s = Math.floor((diff / 1000) % 60);
        setCountdown(`${d}d : ${h}h : ${m}m : ${s}s`);
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [event]);

  if (!event) {
    return <h2 className="text-center text-warning mt-5">Event not found!</h2>;
  }

  // BOOK TICKET → Payment Page
  const handleBooking = (ticket) => {
    const paymentData = {
      type: "event",
      title: event.name,
      price: ticket.price,
      details: {
        ticketType: ticket.type,
        eventDate: event.date,
        venue: event.venue,
        guests: event.guests,
        image: event.img,
      },
    };

    navigate("/payment", { state: { paymentData } });
  };

  return (
    <div className="event-details text-light">

      {/* ⭐ Cute Music Party Dog Mascot */}
      <EventDogMascot />

      {/* HERO CARD */}
      <div
        className="event-hero-card"
        style={{
          backgroundImage: `url(${event.img})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        <div className="event-hero-info bg-dark bg-opacity-75 p-4 rounded-3">
          <h2 className="text-warning fw-bold">{event.name}</h2>
          <p>{event.desc}</p>
          <p>📍 {event.venue}</p>
          <p>🎤 Guests: {event.guests}</p>
          <p>📅 {new Date(event.date).toLocaleDateString()}</p>
          <p className="countdown">⏳ {countdown}</p>
        </div>
      </div>

      {/* TICKETS */}
      <section className="ticket-section container py-5">
        <h3 className="text-center text-warning mb-4">🎟 Available Tickets</h3>

        <div className="row g-4">
          {event.tickets.map((ticket, i) => (
            <div key={i} className="col-md-4">
              <div className="ticket-card bg-dark border border-warning text-center p-3 rounded-4 shadow">
                <h5 className="text-warning">{ticket.type}</h5>
                <p className="ticket-price">₹{ticket.price}</p>
                <button
                  className="btn btn-warning fw-bold w-100"
                  onClick={() => handleBooking(ticket)}
                >
                  Book Now → Pay
                </button>
              </div>
            </div>
          ))}
        </div>

      </section>
    </div>
  );
}
