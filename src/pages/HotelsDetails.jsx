import React, { useEffect, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import hotels from "../data/hotels";
import maplibregl from "maplibre-gl";
import "maplibre-gl/dist/maplibre-gl.css";

export default function HotelDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const hotel = hotels.find((h) => h.id === parseInt(id));
  const mapContainer = useRef(null);

  const coordinates = {
    Mumbai: [72.8777, 19.076],
    Udaipur: [73.6833, 24.5854],
    Bengaluru: [77.5946, 12.9716],
    Goa: [73.8567, 15.2993],
    "New Delhi": [77.209, 28.6139],
    Jodhpur: [73.0243, 26.2389],
    Chennai: [80.2707, 13.0827],
    Kolkata: [88.3639, 22.5726],
    Hyderabad: [78.4867, 17.385],
    Jaipur: [75.7873, 26.9124],
    Shimla: [77.1734, 31.1048],
    Varanasi: [83.0, 25.3176],
    Pune: [73.8567, 18.5204],
  };

  const city = hotel?.location.split(",")[0].trim();
  const hotelCoords = coordinates[city] || [77.209, 28.6139];

  useEffect(() => {
    if (!hotel || !mapContainer.current) return;

    const map = new maplibregl.Map({
      container: mapContainer.current,
      style: "https://demotiles.maplibre.org/style.json",
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
    return (
      <h2 style={{ color: "white", textAlign: "center" }}>Hotel not found</h2>
    );
  }

  return (
    <div className="container py-5 text-light">
      <div className="mb-4">
        <h2 style={{ color: "#FFD700" }}>{hotel.name}</h2>
        <p className="text-muted">{hotel.location}</p>
      </div>

      <div className="row">
        <div className="col-md-8">
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
                className="img-fluid rounded"
              />
            </div>
            <div className="col-4">
              <img
                src="https://source.unsplash.com/400x250/?hotel,lobby"
                className="img-fluid rounded"
              />
            </div>
            <div className="col-4">
              <img
                src="https://source.unsplash.com/400x250/?hotel,pool"
                className="img-fluid rounded"
              />
            </div>
          </div>

          <div className="mb-4">
            <h4 style={{ color: "#FFD700" }}>About this hotel</h4>
            <p>
              <strong>{hotel.name}</strong> in {hotel.location} offers premium
              hospitality, luxury rooms, and world-class amenities.
            </p>
          </div>

          <div className="mb-4">
            <h4 style={{ color: "#FFD700" }}>Amenities</h4>
            <ul className="row list-unstyled">
              <li className="col-6">✅ Free Wi-Fi</li>
              <li className="col-6">✅ Swimming Pool</li>
              <li className="col-6">✅ Spa & Wellness</li>
              <li className="col-6">✅ Gym</li>
              <li className="col-6">✅ Room Service</li>
              <li className="col-6">✅ Airport Shuttle</li>
            </ul>
          </div>

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

          <div className="mb-4">
            <h4 style={{ color: "#FFD700" }}>Guest Reviews</h4>
            <div className="p-3 bg-dark rounded mb-2">
              ⭐⭐⭐⭐⭐ "Amazing experience!"
            </div>
            <div className="p-3 bg-dark rounded">
              ⭐⭐⭐⭐ "Great service!"
            </div>
          </div>
        </div>

        {/* RIGHT BOX */}
        <div className="col-md-4">
          <div
            className="p-4 bg-dark border border-warning rounded sticky-top"
            style={{ top: "90px" }}
          >
            <h4 style={{ color: "#FFD700" }}>Book Your Stay</h4>
            <p>
              <strong>Price:</strong> {hotel.price}
            </p>

            <button
              type="button"
              className="btn btn-warning w-100 mt-3"
              onClick={() =>
                navigate("/payment", {
                  state: {
                    paymentData: {
                      type: "hotel",
                      title: hotel.name,
                      price: hotel.price,
                      location: hotel.location,
                      image: hotel.image,
                    },
                  },
                })
              }
            >
              Book Now
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
