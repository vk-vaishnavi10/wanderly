import React, { useState } from "react";
import "./stays.css";
import { Modal } from "react-bootstrap";
import Swal from "sweetalert2";
import { addStayBooking } from "../services/api"; // ✅ API function



// 🖼️ Local Images
import oberoi from "../images/oberoi.jpg";
import tajlake from "../images/tajlake.jpg";
import leela from "../images/leela.jpg";
import radisson from "../images/radisson.jpg";
import itc from "../images/itc.jpg";
import juhu from "../images/juhu.jpg";
import lalit from "../images/lalit.jpg";
import novotel from "../images/novotel.jpg";
import windflower from "../images/windflower.jpg";
const hotelbg = "/videos/hotelbg.mp4";

// ✅ Predefined Hotel Data
const hotelsData = [
  {
    id: 1,
    name: "The Oberoi, Mumbai",
    city: "mumbai",
    location: "Mumbai, Maharashtra",
    price: "₹12,500/night",
    rating: 5,
    image: oberoi,
    phone: "+91 22 6632 5757",
    email: "reservations@oberoi.com",
    attractions: ["Gateway of India", "Marine Drive", "Elephanta Caves"],
    desc: "A luxurious 5-star hotel overlooking the Arabian Sea, offering world-class dining, elegant rooms, and breathtaking sea views.",
  },
  {
    id: 2,
    name: "Taj Mahal Palace",
    city: "mumbai",
    location: "Mumbai, Maharashtra",
    price: "₹18,000/night",
    rating: 5,
    image: tajlake,
    phone: "+91 22 6665 3366",
    email: "taj.reservations@tajhotels.com",
    attractions: ["Colaba Causeway", "Crawford Market", "Girgaum Chowpatty"],
    desc: "An iconic heritage hotel that combines Indian tradition with modern luxury, located by the famous Gateway of India.",
  },
  {
    id: 3,
    name: "The Leela Palace",
    city: "bengaluru",
    location: "Bengaluru, Karnataka",
    price: "₹10,000/night",
    rating: 4,
    image: leela,
    phone: "+91 80 2521 1234",
    email: "reservations.blr@theleela.com",
    attractions: ["Cubbon Park", "Bangalore Palace", "Lalbagh Garden"],
    desc: "A royal experience blending traditional Indian architecture with modern amenities, surrounded by lush greenery.",
  },
  {
    id: 4,
    name: "Radisson Blu Resort Goa",
    city: "goa",
    location: "Goa",
    price: "₹7,500/night",
    rating: 4,
    image: radisson,
    phone: "+91 832 880 2000",
    email: "reservations@radissonblu.com",
    attractions: ["Baga Beach", "Dudhsagar Falls", "Fort Aguada"],
    desc: "A beachside paradise with a perfect blend of modern comfort and Goan charm. Ideal for relaxation and family getaways.",
  },
  {
    id: 5,
    name: "JW Marriott Juhu",
    city: "mumbai",
    location: "Juhu, Mumbai, Maharashtra",
    price: "₹14,000/night",
    rating: 5,
    image: juhu,
    phone: "+91 22 6693 3000",
    email: "reservations.juhu@marriott.com",
    attractions: ["Juhu Beach", "ISKCON Temple", "Versova Beach"],
    desc: "A luxurious beachfront resort offering serene sea views, fine dining, and a relaxing spa experience.",
  },
  {
    id: 6,
    name: "ITC Grand Chola",
    city: "chennai",
    location: "Chennai, Tamil Nadu",
    price: "₹11,500/night",
    rating: 5,
    image: itc,
    phone: "+91 44 2220 0000",
    email: "reservations.chola@itchotels.in",
    attractions: ["Marina Beach", "Phoenix Market City", "Kapaleeshwar Temple"],
    desc: "An architectural marvel in Chennai offering royal luxury and signature ITC hospitality.",
  },
  {
    id: 7,
    name: "The Lalit Jaipur",
    city: "jaipur",
    location: "Jaipur, Rajasthan",
    price: "₹9,000/night",
    rating: 4,
    image: lalit,
    phone: "+91 141 664 7777",
    email: "reservations.jaipur@thelalit.com",
    attractions: ["Hawa Mahal", "City Palace", "Amber Fort"],
    desc: "A royal blend of Rajasthani architecture and contemporary comfort, perfect for heritage explorers.",
  },
  {
    id: 8,
    name: "Novotel Hyderabad Convention Centre",
    city: "hyderabad",
    location: "Hyderabad, Telangana",
    price: "₹8,000/night",
    rating: 4,
    image: novotel,
    phone: "+91 40 6682 4422",
    email: "reservations.hyd@novotel.com",
    attractions: ["Charminar", "Golconda Fort", "Hussain Sagar"],
    desc: "A business and leisure paradise offering modern comfort near the HITEC City area.",
  },
  {
    id: 9,
    name: "Windflower Resort and Spa",
    city: "mysuru",
    location: "Mysuru, Karnataka",
    price: "₹6,500/night",
    rating: 4,
    image: windflower,
    phone: "+91 821 252 2500",
    email: "reservations@thewindflower.com",
    attractions: ["Mysore Palace", "Chamundi Hill", "Brindavan Gardens"],
    desc: "A tranquil escape nestled in Mysuru, ideal for wellness retreats and peaceful holidays.",
  },
];

export default function Stays() {
  const [query, setQuery] = useState("");
  const [filteredHotels, setFilteredHotels] = useState(hotelsData);
  const [selectedHotel, setSelectedHotel] = useState(null);
  const [booking, setBooking] = useState({ checkIn: "", nights: 1, guests: 2 });

  // 🔍 Search by City
  const searchHotels = () => {
    if (!query.trim()) {
      setFilteredHotels(hotelsData);
      return;
    }
    const results = hotelsData.filter((hotel) =>
      hotel.city.toLowerCase().includes(query.toLowerCase())
    );
    setFilteredHotels(results);
  };

  // ✅ Booking Handler
  const handleBooking = async () => {
    if (!booking.checkIn || booking.nights < 1 || booking.guests < 1) {
      Swal.fire("⚠️ Missing Info", "Please fill all booking details.", "warning");
      return;
    }

    const chosenDate = new Date(booking.checkIn);
    if (isNaN(chosenDate.getTime()) || chosenDate.getFullYear() > 2100) {
      Swal.fire("⚠️ Invalid Date", "Please choose a valid check-in date.", "warning");
      return;
    }

    try {
      const payload = {
        user: { id: 1 },
        stay: { id: selectedHotel.id },
        checkInDate: booking.checkIn,
        nights: parseInt(booking.nights),
        guests: parseInt(booking.guests),
      };

      console.log("📤 Sending Stay Booking:", payload);
      await addStayBooking(payload);

      Swal.fire({
        title: "🎉 Booking Confirmed!",
        text: `Your stay at ${selectedHotel.name} is booked successfully!`,
        icon: "success",
        confirmButtonColor: "#f5c518",
        background: "#111",
        color: "#fff",
      });

      setSelectedHotel(null);
      setBooking({ checkIn: "", nights: 1, guests: 2 });
    } catch (error) {
      console.error("❌ Booking failed:", error);
      Swal.fire("❌ Error", "Unable to save booking. Try again!", "error");
    }
  };

  return (
    <section className="stays-section">
      {/* 🏙 Hero Section */}
      <div className="hero-section">
        {/* 🎥 Background Video (added instead of slideshow) */}
        <video
  className="hotel-bg-video"
  autoPlay
  muted
  loop
  playsInline
  preload="auto"
>
  <source src={hotelbg} type="video/mp4" />
</video>


<div className="hero-overlay slim-hero">
  <h1 className="slim-heading">
    Find your perfect stay — explore hotels, villas & city escapes 🌿
  </h1>

  <div className="search-wide">
    <input
      type="text"
      placeholder="Search by city, destination, or landmark..."
      value={query}
      onChange={(e) => setQuery(e.target.value)}
    />
    <button onClick={searchHotels}>🔍 Search</button>
  </div>
</div>

      </div>

      {/* 🏨 Hotel List */}
      <div className="container py-5">
        <h2 className="section-heading">Featured Hotels</h2>
        {filteredHotels.length > 0 ? (
          <div className="row g-4">
            {filteredHotels.map((hotel) => (
              <div key={hotel.id} className="col-12 col-md-6 col-lg-4">
                <div className="card stay-card h-100 shadow-sm">
                  <img src={hotel.image} className="card-img-top" alt={hotel.name} />
                  <div className="card-body text-center">
                    <h5>{hotel.name}</h5>
                    <p>{hotel.location}</p>
                    <p><strong>{hotel.price}</strong></p>
                    <p>{"⭐".repeat(hotel.rating)}</p>
                    <button
                      className="btn book-btn w-100"
                      onClick={() => setSelectedHotel(hotel)}
                    >
                      View Details
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <h4 className="text-center text-danger">⚠️ No hotels found in this city.</h4>
        )}
      </div>

      {/* 🏨 Modal for Booking */}
      <Modal
        show={!!selectedHotel}
        onHide={() => setSelectedHotel(null)}
        centered
        size="lg"
        className="hotel-modal"
      >
        {selectedHotel && (
          <div className="modal-content bg-dark text-light border-warning">
            <div className="modal-header border-warning">
              <h5 className="modal-title text-warning">{selectedHotel.name}</h5>
              <button
                type="button"
                className="btn-close btn-close-white"
                onClick={() => setSelectedHotel(null)}
              ></button>
            </div>

            <div className="modal-body">
              <img
                src={selectedHotel.image}
                alt={selectedHotel.name}
                className="img-fluid rounded mb-3"
              />
              <p>{selectedHotel.desc}</p>
              <p>📍 <strong>{selectedHotel.location}</strong></p>
              <p>💰 {selectedHotel.price}</p>
              <p>📞 {selectedHotel.phone}</p>
              <p>📧 {selectedHotel.email}</p>

              {/* 🗓 Inputs */}
              <div className="mt-4">
                <label className="form-label text-warning">🗓 Check-in Date</label>
                <input
                  type="date"
                  className="form-control bg-dark text-light border-warning"
                  value={booking.checkIn}
                  onChange={(e) => setBooking({ ...booking, checkIn: e.target.value })}
                />
              </div>

              <div className="mt-3">
                <label className="form-label text-warning">🌙 Nights</label>
                <input
                  type="number"
                  min="1"
                  className="form-control bg-dark text-light border-warning"
                  value={booking.nights}
                  onChange={(e) => setBooking({ ...booking, nights: e.target.value })}
                />
              </div>

              <div className="mt-3">
                <label className="form-label text-warning">👥 Guests</label>
                <input
                  type="number"
                  min="1"
                  className="form-control bg-dark text-light border-warning"
                  value={booking.guests}
                  onChange={(e) => setBooking({ ...booking, guests: e.target.value })}
                />
              </div>
            </div>

            <div className="modal-footer border-warning d-flex justify-content-center">
              <button className="btn btn-warning fw-bold px-4" onClick={handleBooking}>
                Confirm Stay ✨
              </button>
            </div>
          </div>
        )}
      </Modal>
    </section>
  );
}
