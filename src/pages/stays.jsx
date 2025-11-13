import React, { useState } from "react";
import "./stays.css";
import { Modal } from "react-bootstrap";
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";

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

// 🔥 Predefined Hotels Data
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
    desc: "A luxurious 5-star hotel overlooking the Arabian Sea."
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
    desc: "An iconic heritage luxury hotel near Gateway of India."
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
    desc: "Traditional royal architecture blended with modern comfort."
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
    desc: "Beachside resort with a perfect mix of Goan charm."
  },
  {
    id: 5,
    name: "JW Marriott Juhu",
    city: "mumbai",
    location: "Juhu, Mumbai",
    price: "₹14,000/night",
    rating: 5,
    image: juhu,
    phone: "+91 22 6693 3000",
    email: "reservations.juhu@marriott.com",
    desc: "Luxury beachfront resort with premium amenities."
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
    desc: "A grand palace offering royal luxury."
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
    desc: "Majestic Rajasthani architecture blended with luxury."
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
    desc: "Modern comfort near HITEC City."
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
    desc: "A peaceful wellness retreat in Mysuru."
  },
];

export default function Stays() {
  const navigate = useNavigate();
  const [query, setQuery] = useState("");
  const [filteredHotels, setFilteredHotels] = useState(hotelsData);
  const [selectedHotel, setSelectedHotel] = useState(null);
  const [booking, setBooking] = useState({
    checkIn: "",
    nights: 1,
    guests: 2,
  });

  // 🔍 SEARCH
  const searchHotels = () => {
    if (!query.trim()) {
      setFilteredHotels(hotelsData);
      return;
    }

    setFilteredHotels(
      hotelsData.filter((hotel) =>
        hotel.city.toLowerCase().includes(query.toLowerCase())
      )
    );
  };

  // ⭐ PAYMENT REDIRECT HANDLER
  const handleBooking = () => {
    if (!booking.checkIn) {
      Swal.fire("⚠️ Missing Info", "Please select check-in date.", "warning");
      return;
    }

    navigate("/payment", {
      state: {
        paymentData: {
          type: "hotel",
          title: selectedHotel.name,
          price: selectedHotel.price,
          location: selectedHotel.location,
          checkIn: booking.checkIn,
          nights: booking.nights,
          guests: booking.guests,
          image: selectedHotel.image,
        },
      },
    });
  };

  return (
    <section className="stays-section">
      {/* HERO SECTION */}
      <div className="hero-section">
        <video className="hotel-bg-video" autoPlay muted loop playsInline>
          <source src={hotelbg} type="video/mp4" />
        </video>

        <div className="hero-overlay slim-hero">
          <h1 className="slim-heading">
            Find your perfect stay — hotels, villas & escapes 🌿
          </h1>

          <div className="search-wide">
            <input
              type="text"
              placeholder="Search by city..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
            <button onClick={searchHotels}>🔍 Search</button>
          </div>
        </div>
      </div>

      {/* HOTEL LIST */}
      <div className="container py-5">
        <h2 className="section-heading">Featured Hotels</h2>

        <div className="row g-4">
          {filteredHotels.map((hotel) => (
            <div key={hotel.id} className="col-md-4">
              <div className="card stay-card shadow-sm h-100">
                <img src={hotel.image} className="card-img-top" alt={hotel.name} />
                <div className="card-body text-center">
                  <h5>{hotel.name}</h5>
                  <p>{hotel.location}</p>
                  <strong>{hotel.price}</strong>
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
      </div>

      {/* BOOKING MODAL */}
      <Modal show={!!selectedHotel} onHide={() => setSelectedHotel(null)} centered>
        {selectedHotel && (
          <div className="modal-content bg-dark text-light border-warning">
            <div className="modal-header border-warning">
              <h5 className="modal-title text-warning">{selectedHotel.name}</h5>
              <button
                className="btn-close btn-close-white"
                onClick={() => setSelectedHotel(null)}
              ></button>
            </div>

            <div className="modal-body">
              <img
                src={selectedHotel.image}
                className="img-fluid rounded mb-3"
                alt=""
              />
              <p>{selectedHotel.desc}</p>
              <p>📍 {selectedHotel.location}</p>
              <p>💰 {selectedHotel.price}</p>

              {/* DATE */}
              <label className="form-label text-warning mt-3">
                🗓 Check-in Date
              </label>
              <input
                type="date"
                className="form-control bg-dark text-light"
                value={booking.checkIn}
                onChange={(e) =>
                  setBooking({ ...booking, checkIn: e.target.value })
                }
              />

              {/* NIGHTS */}
              <label className="form-label text-warning mt-3">🌙 Nights</label>
              <input
                type="number"
                min="1"
                className="form-control bg-dark text-light"
                value={booking.nights}
                onChange={(e) =>
                  setBooking({ ...booking, nights: e.target.value })
                }
              />

              {/* GUESTS */}
              <label className="form-label text-warning mt-3">👥 Guests</label>
              <input
                type="number"
                min="1"
                className="form-control bg-dark text-light"
                value={booking.guests}
                onChange={(e) =>
                  setBooking({ ...booking, guests: e.target.value })
                }
              />
            </div>

            <div className="modal-footer border-warning">
              <button className="btn btn-warning w-100" onClick={handleBooking}>
                Confirm Stay ✨
              </button>
            </div>
          </div>
        )}
      </Modal>
    </section>
  );
}
