import React, { useState } from "react";
import { Link } from "react-router-dom";
import hotels from "../data/hotels";
import "./Hotels.css";

export default function Hotels() {
  const [search, setSearch] = useState("");

  // Filter hotels
  const filteredHotels = hotels.filter(
    (hotel) =>
      hotel.name.toLowerCase().includes(search.toLowerCase()) ||
      hotel.location.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="hotels-page">

      {/* ✅ Hero Section */}
      <section className="hero-hotels">
        <div className="slideshow">
          <div className="slide" style={{ backgroundImage: "url(https://source.unsplash.com/1600x600/?hotel,resort)" }}></div>
          <div className="slide" style={{ backgroundImage: "url(https://source.unsplash.com/1600x600/?luxury,hotel)" }}></div>
          <div className="slide" style={{ backgroundImage: "url(https://source.unsplash.com/1600x600/?pool,resort)" }}></div>
        </div>

        <div className="hero-overlay">
          <h1>🏨 Luxury Hotels</h1>
          <p>Find the best stays across India</p>
        </div>
      </section>

      {/* ✅ Search Bar */}
      <h2 className="text-center mt-5 mb-4" style={{ color: "#FFD700" }}>
        Available Hotels
      </h2>
      <div className="search-box mb-5">
        <input
          type="text"
          placeholder="Search by city or hotel name..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <button>Search</button>
      </div>

      {/* ✅ Hotels List */}
      <div className="container">
        <div className="row g-4">
          {filteredHotels.length > 0 ? (
            filteredHotels.map((hotel) => (
              <div key={hotel.id} className="col-md-4">
                <div className="card hotel-card h-100 shadow-sm">
                  {/* Image with Overlay */}
                  <div className="hotel-image-container">
                    <img src={hotel.image} alt={hotel.name} />
                    <div className="hotel-overlay">
                      <h5>{hotel.name}</h5>
                      <p>{hotel.location}</p>
                    </div>
                  </div>

                  {/* Hotel details */}
                  <div className="card-body">
                    <p><strong>{hotel.price}</strong></p>
                    <p>{"⭐".repeat(hotel.rating)}</p>
                    <Link
                      to={`/hotels/${hotel.id}`}
                      className="btn btn-warning w-100"
                    >
                      View Details
                    </Link>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <p className="text-center text-light">No hotels found.</p>
          )}
        </div>
      </div>
    </div>
  );
}
