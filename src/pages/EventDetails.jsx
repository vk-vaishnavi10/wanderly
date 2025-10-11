import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Swal from "sweetalert2";
import { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable";
import QRCode from "qrcode";
import { addEventBooking } from "../services/api.js";
import "./EventDetails.css";

// ✅ Import local images
import ocImg from "../images/oc.jpg";
import royalImg from "../images/royal.jpg";
import ffImg from "../images/ff.jpeg";

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
    guests: "Chef Vikas Khanna, Gordon Ramsay, International Food Bloggers",
    tickets: [
      { type: "Entry Pass", price: 500 },
      { type: "All Access Tasting", price: 2500 },
      { type: "VIP Chef Table", price: 8000 },
    ],
  },
};

export default function EventDetails() {
  const { id } = useParams();
  const event = eventsData[id];
  const [countdown, setCountdown] = useState("");

  useEffect(() => {
    if (!event) return;
    const targetDate = new Date(event.date);
    const interval = setInterval(() => {
      const now = new Date();
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

  if (!event)
    return <h2 className="text-center text-warning mt-5">Event not found!</h2>;

  // 🎫 PDF Generator
  const generatePDF = async (ticket) => {
    try {
      const doc = new jsPDF("p", "mm", "a4");

      // 💛 Gold Header
      doc.setFillColor(245, 197, 24);
      doc.rect(0, 0, 210, 35, "F");
      doc.setFontSize(22);
      doc.setTextColor(0, 0, 0);
      doc.text("🎟 Wanderly Event Ticket", 45, 23);

      // 🖼 Event Image
      const img = event.img;
      const imgData = await fetch(img)
        .then((res) => res.blob())
        .then(
          (blob) =>
            new Promise((resolve) => {
              const reader = new FileReader();
              reader.onload = () => resolve(reader.result);
              reader.readAsDataURL(blob);
            })
        );
      doc.addImage(imgData, "JPEG", 15, 45, 180, 80);

      // 🧾 Ticket Info Table
      autoTable(doc, {
        startY: 135,
        head: [["Field", "Details"]],
        body: [
          ["Event", event.name],
          ["Ticket Type", ticket.type],
          ["Price", `₹${ticket.price}`],
          ["Date", new Date(event.date).toLocaleDateString()],
          ["Venue", event.venue],
          ["Guests", event.guests],
        ],
        styles: {
          halign: "center",
          valign: "middle",
          textColor: [255, 255, 255],
          fillColor: [0, 0, 0],
        },
        headStyles: {
          fillColor: [245, 197, 24],
          textColor: [0, 0, 0],
          fontStyle: "bold",
        },
      });

      // 🔳 QR Code
      const qrData = `Event: ${event.name}\nTicket: ${ticket.type}\nDate: ${event.date}\nVenue: ${event.venue}`;
      const qrCode = await QRCode.toDataURL(qrData);
      doc.addImage(qrCode, "PNG", 80, doc.lastAutoTable.finalY + 10, 50, 50);

      // ✅ Footer
      doc.setFontSize(10);
      doc.setTextColor(255, 255, 255);
      doc.text(
        "Please show this ticket at the event gate | Powered by Wanderly 💛",
        25,
        290
      );

      // 💾 Save File
      const fileName = `${event.name}_${ticket.type}_Ticket.pdf`;
      doc.save(fileName);
      console.log("✅ Ticket PDF saved:", fileName);
    } catch (error) {
      console.error("❌ PDF Generation Error:", error);
      Swal.fire("⚠️ Error", "Couldn't generate your ticket. Try again.", "error");
    }
  };

  // 🎟 Booking Handler
  const handleBooking = async (ticket) => {
    try {
      const bookingData = {
        userId: 1,
        eventId: parseInt(id),
        ticketType: ticket.type,
        price: ticket.price.toString(),
      };

      console.log("Sending bookingData:", bookingData);
      await addEventBooking(bookingData);

      const result = await Swal.fire({
        title: "🎉 Booking Confirmed!",
        html: `
          <strong>${event.name}</strong><br/>
          <strong>Ticket:</strong> ${ticket.type}<br/>
          <strong>Price:</strong> ₹${ticket.price}<br/>
          <strong>Date:</strong> ${new Date(event.date).toLocaleDateString()}<br/>
          <strong>Venue:</strong> ${event.venue}
        `,
        icon: "success",
        confirmButtonText: "Download Ticket 📥",
        confirmButtonColor: "#f5c518",
        background: "#111",
        color: "#fff",
        allowOutsideClick: false,
      });

      if (result.isConfirmed) {
        await generatePDF(ticket);
      }
    } catch (err) {
      console.error("Booking failed:", err);
      Swal.fire("❌ Booking Failed", "Could not complete booking", "error");
    }
  };

  return (
    <div className="event-details text-light">
      {/* 🏖 Hero Section */}
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

      {/* 🎟 Tickets */}
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
                  Book Now
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
