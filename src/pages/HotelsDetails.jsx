import React, { useEffect, useRef } from "react";
import { useParams } from "react-router-dom";
import hotels from "../data/hotels";
import maplibregl from "maplibre-gl";
import "maplibre-gl/dist/maplibre-gl.css";

export default function HotelDetails() {
  const { id } = useParams();
  const hotel = hotels.find((h) => h.id === parseInt(id));
  const mapContainer = useRef(null);

  // Simple mapping of known cities to coordinates
  const coordinates = {
    "Mumbai": [72.8777, 19.0760],
    "Udaipur": [73.6833, 24.5854],
    "Bengaluru": [77.5946, 12.9716],
    "Goa": [73.8567, 15.2993],
    "New Delhi": [77.2090, 28.6139],
    "Jodhpur": [73.0243, 26.2389],
    "Chennai": [80.2707, 13.0827],
    "Kolkata": [88.3639, 22.5726],
    "Hyderabad": [78.4867, 17.3850],
    "Jaipur": [75.7873, 26.9124],
    "Shimla": [77.1734, 31.1048],
    "Varanasi": [83.0, 25.3176],
    "Pune": [73.8567, 18.5204],
  };

  const city = hotel?.location.split(",")[0].trim();
  const hotelCoords = coordinates[city] || [77.2090, 28.6139]; // default Delhi

  useEffect(() => {
    if (!hotel) return;
    if (!mapContainer.current) return;

    const map = new maplibregl.Map({
      container: mapContainer.current,
      style:  "https://demotiles.maplibre.org/style.json" , 

      center: hotelCoords,
      zoom: 11,
    });

    new maplibregl.Marker({ color: "#FFD700" })
      .setLngLat(hotelCoords)
      .setPopup(new maplibregl.Popup().setText(hotel.name))
      .addTo(map);

    return () => map.remove();
  }, [hotel]);

  if (!hotel) {
    return <h2 style={{ color: "white", textAlign: "center" }}>Hotel not found</h2>;
  }

  return (
    <div className="container py-5 text-light">
      {/* Hotel Name + Location */}
      <div className="mb-4">
        <h2 style={{ color: "#FFD700" }}>{hotel.name}</h2>
        <p className="text-muted">{hotel.location}</p>
      </div>

      <div className="row">
        {/* Left - Hotel Gallery + Info */}
        <div className="col-md-8">
          {/* Image Gallery */}
          <div className="row g-2 mb-4">
            <div className="col-12">
              <img
                src={hotel.image}
                alt={hotel.name}
                style={{
                  width: "100%",
                  maxHeight: "400px",
                  objectFit: "cover",
                  borderRadius: "10px",
                }}
              />
            </div>
            <div className="col-4">
              <img
                src="https://source.unsplash.com/400x250/?luxury,hotelroom"
                alt="Room"
                className="img-fluid rounded"
              />
            </div>
            <div className="col-4">
              <img
                src="https://source.unsplash.com/400x250/?hotel,lobby"
                alt="Lobby"
                className="img-fluid rounded"
              />
            </div>
            <div className="col-4">
              <img
                src="https://source.unsplash.com/400x250/?hotel,pool"
                alt="Pool"
                className="img-fluid rounded"
              />
            </div>
          </div>

          {/* Hotel Details */}
          <div className="mb-4">
            <h4 style={{ color: "#FFD700" }}>About this hotel</h4>
            <p>
              <strong>{hotel.name}</strong> in {hotel.location} offers a luxurious
              experience with premium amenities, comfortable rooms, and world-class
              hospitality. Perfect for both leisure and business travelers.
            </p>
          </div>

          {/* Amenities */}
          <div className="mb-4">
            <h4 style={{ color: "#FFD700" }}>Amenities</h4>
            <ul className="row list-unstyled">
              <li className="col-6">✅ Free Wi-Fi</li>
              <li className="col-6">✅ Swimming Pool</li>
              <li className="col-6">✅ Spa & Wellness</li>
              <li className="col-6">✅ Gym & Fitness Center</li>
              <li className="col-6">✅ 24/7 Room Service</li>
              <li className="col-6">✅ Airport Shuttle</li>
            </ul>
          </div>

          {/* 🗺️ MAP SECTION */}
          <div className="mb-4">
            <h4 style={{ color: "#FFD700" }}>📍 Location on Map</h4>
            <div
              ref={mapContainer}
              style={{
                height: "350px",
                borderRadius: "12px",
                overflow: "hidden",
                border: "2px solid #FFD700",
              }}
            ></div>
          </div>

          {/* Reviews */}
          <div className="mb-4">
            <h4 style={{ color: "#FFD700" }}>Guest Reviews</h4>
            <div className="p-3 mb-2 bg-dark rounded">
              ⭐⭐⭐⭐⭐ - "Amazing stay, beautiful views and excellent service!"
            </div>
            <div className="p-3 mb-2 bg-dark rounded">
              ⭐⭐⭐⭐ - "Great location, very clean and comfortable rooms."
            </div>
          </div>
        </div>

        {/* Right - Sticky Booking Box */}
        <div className="col-md-4">
          <div
            className="p-4 bg-dark border border-warning rounded sticky-top"
            style={{ top: "90px" }}
          >
            <h4 style={{ color: "#FFD700" }}>Book Your Stay</h4>
            <p>
              <strong>Price:</strong> {hotel.price}
            </p>
            <p>
              <strong>Rating:</strong> {"⭐".repeat(hotel.rating)}
            </p>

            {/* Booking Form */}
            <form>
              <label className="form-label">Check-in</label>
              <input type="date" className="form-control mb-2" required />

              <label className="form-label">Check-out</label>
              <input type="date" className="form-control mb-2" required />

              <label className="form-label">Guests</label>
              <input type="number" min="1" className="form-control mb-3" defaultValue="2" />

              <button type="submit" className="btn btn-warning w-100">
                Book Now
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
