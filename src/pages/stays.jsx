// src/pages/Stays.jsx
import React, { useState } from "react";
import "./stays.css";
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";

// Hero Background
import heroHotelBg from "../images/hotel.jpg";

// Mascot & Envelope Popup
import CuteEnvelopeMascot from "../Components/CuteEnvelopeMascot";
import EnvelopePopup from "../Components/EnvelopePopup";

// Hotel images
import oberoi from "../images/oberoi.jpg";
import tajlake from "../images/tajlake.jpg";
import leela from "../images/leela.jpg";
import radisson from "../images/radisson.jpg";
import itc from "../images/itc.jpg";
import juhu from "../images/juhu.jpg";
import lalit from "../images/lalit.jpg";
import novotel from "../images/novotel.jpg";
import windflower from "../images/windflower.jpg";

// Hotels Data
const hotelsData = [
  {
    id: 1,
    name: "The Oberoi, Mumbai",
    city: "mumbai",
    location: "Mumbai, Maharashtra",
    price: "₹12,500/night",
    rating: 5,
    image: oberoi,
    desc: "A luxurious 5-star hotel overlooking the Arabian Sea.",
  },
  {
    id: 2,
    name: "Taj Mahal Palace",
    city: "mumbai",
    location: "Mumbai, Maharashtra",
    price: "₹18,000/night",
    rating: 5,
    image: tajlake,
    desc: "An iconic heritage luxury hotel near Gateway of India.",
  },
  {
    id: 3,
    name: "The Leela Palace",
    city: "bengaluru",
    location: "Bengaluru, Karnataka",
    price: "₹10,000/night",
    rating: 4,
    image: leela,
    desc: "Traditional royal architecture blended with modern comfort.",
  },
  {
    id: 4,
    name: "Radisson Blu Resort Goa",
    city: "goa",
    location: "Goa",
    price: "₹7,500/night",
    rating: 4,
    image: radisson,
    desc: "Beachside resort with Goan charm.",
  },
  {
    id: 5,
    name: "JW Marriott Juhu",
    city: "mumbai",
    location: "Juhu, Mumbai",
    price: "₹14,000/night",
    rating: 5,
    image: juhu,
    desc: "Luxury beachfront resort with premium amenities.",
  },
  {
    id: 6,
    name: "ITC Grand Chola",
    city: "chennai",
    location: "Chennai, Tamil Nadu",
    price: "₹11,500/night",
    rating: 5,
    image: itc,
    desc: "A grand palace offering royal luxury.",
  },
  {
    id: 7,
    name: "The Lalit Jaipur",
    city: "jaipur",
    location: "Jaipur, Rajasthan",
    price: "₹9,000/night",
    rating: 4,
    image: lalit,
    desc: "Majestic Rajasthani architecture blended with luxury.",
  },
  {
    id: 8,
    name: "Novotel Hyderabad Convention Centre",
    city: "hyderabad",
    location: "Hyderabad, Telangana",
    price: "₹8,000/night",
    rating: 4,
    image: novotel,
    desc: "Modern comfort near HITEC City.",
  },
  {
    id: 9,
    name: "Windflower Resort and Spa",
    city: "mysuru",
    location: "Mysuru, Karnataka",
    price: "₹6,500/night",
    rating: 4,
    image: windflower,
    desc: "A peaceful wellness retreat in Mysuru.",
  },
];

export default function Stays() {
  const navigate = useNavigate();

  const [query, setQuery] = useState("");
  const [dropdown, setDropdown] = useState("");
  const [filteredHotels, setFilteredHotels] = useState(hotelsData);

  const [selectedHotel, setSelectedHotel] = useState(null);
  const [booking, setBooking] = useState({
    checkIn: "",
    nights: 1,
    guests: 2,
  });

  // 🔍 Search logic (dropdown + text)
  const searchHotels = () => {
    const q = query.toLowerCase().trim();
    const selectedCity = dropdown.toLowerCase();

    const results = hotelsData.filter((hotel) => {
      const matchesText =
        !q ||
        hotel.city.includes(q) ||
        hotel.location.toLowerCase().includes(q) ||
        hotel.name.toLowerCase().includes(q);

      const matchesDropdown = selectedCity ? hotel.city === selectedCity : true;

      return matchesText && matchesDropdown;
    });

    setFilteredHotels(results);
  };

  // 🐱 Mascot click → open first result
  const handleMascotClick = () => {
    if (filteredHotels.length === 0) {
      Swal.fire("😿", "No hotels found!", "info");
      return;
    }
    setSelectedHotel(filteredHotels[0]);
  };

  // 💳 Booking & redirect
  const handleBooking = () => {
    if (!booking.checkIn) {
      Swal.fire("⚠️ Missing Info", "Please select check-in date.", "warning");
      return;
    }

    if (!selectedHotel) {
      Swal.fire("⚠️ No Hotel", "Please select a hotel first.", "warning");
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
      {/* 🌌 HERO with right-side big black box */}
      <div
        className="hero-image"
        style={{ backgroundImage: `url(${heroHotelBg})` }}
      >
        {/* floating cat mascott */}
        <CuteEnvelopeMascot onClick={handleMascotClick} />

        <div className="hero-big-box">
          <div className="bigbox-dots" />

          <h1 className="hero-big-title">
            Find your perfect stay —{" "}
            <span>hotels, villas & escapes 💙</span>
          </h1>

          {/* quote / subtitle */}
          <p className="big-discover">
            Discover stays crafted for cozy nights, workcations and dreamy
            weekend getaways.
          </p>

          {/* dropdown + search + button */}
          <div className="big-search-bar">
            <select
              className="big-dropdown"
              value={dropdown}
              onChange={(e) => setDropdown(e.target.value)}
            >
              <option value="">City</option>
              <option value="mumbai">Mumbai</option>
              <option value="goa">Goa</option>
              <option value="hyderabad">Hyderabad</option>
              <option value="chennai">Chennai</option>
              <option value="mysuru">Mysuru</option>
              <option value="jaipur">Jaipur</option>
              <option value="bengaluru">Bengaluru</option>
            </select>

            <input
              type="text"
              className="big-input"
              placeholder="Search by city or hotel name..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && searchHotels()}
            />

            <button className="big-search-btn" onClick={searchHotels}>
              🔍 Search
            </button>
          </div>
        </div>
      </div>

      {/* 🏨 HOTEL LIST */}
      <div className="container py-5">
        <h2 className="section-heading">Featured Hotels</h2>

        <div className="row g-4">
          {filteredHotels.length === 0 && (
            <p className="text-center text-light">
              No hotels found. Try another city ✨
            </p>
          )}

          {filteredHotels.map((hotel) => (
            <div key={hotel.id} className="col-md-4">
              <div className="card stay-card shadow-sm h-100">
                <img src={hotel.image} alt={hotel.name} />

                <div className="card-body text-center">
                  <h5>{hotel.name}</h5>
                  <p>{hotel.location}</p>
                  <strong>{hotel.price}</strong>
                  <p>{"⭐".repeat(hotel.rating)}</p>

                  <button
                    className="btn book-btn w-100"
                    onClick={() => setSelectedHotel(hotel)}
                  >
                    View Details 💌
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 💌 ENVELOPE POPUP */}
      <EnvelopePopup
        hotel={selectedHotel}
        booking={booking}
        setBooking={setBooking}
        onClose={() => setSelectedHotel(null)}
        onConfirm={handleBooking}
      />
    </section>
  );
}
