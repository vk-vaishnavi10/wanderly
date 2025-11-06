import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import "./packages.css";
import { getPackages } from "../services/api";
import kashmirImg from "../images/kashmirparadise.jpg";
import sinImg from "../images/sin.avif";
import keralaImg from "../images/kerala.jpg";
import packageVideo from "../assets/videos/packagebg.mp4";

const fallbackPackages = [
  {
    id: 1,
    title: "Goa Beach Escape 🌴",
    description: "Flight + 3 Nights at 5⭐ Resort + Cab Transfers",
    price: "₹22,000/person",
    duration: "3 Nights / 4 Days",
    image:
      "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=800&q=80",
    inclusions: ["Roundtrip Flights", "Breakfast", "Airport Pickup"],
  },
  {
    id: 2,
    title: "Kashmir Paradise ❄️",
    description: "Flight + 4 Nights in Srinagar & Gulmarg + Cab",
    price: "₹35,000/person",
    duration: "4 Nights / 5 Days",
    image: kashmirImg,
    inclusions: ["Flights", "Deluxe Hotels", "Sightseeing Tours"],
  },
  {
    id: 3,
    title: "Kerala Backwaters Cruise 🚤",
    description: "Flight + 3 Nights in Houseboat + Cab",
    price: "₹28,000/person",
    duration: "3 Nights / 4 Days",
    image: keralaImg,
    inclusions: ["Flights", "Houseboat Stay", "Meals"],
  },
  {
    id: 4,
    title: "Singapore Family Fun 🎡",
    description: "Flight + 3 Nights Hotel + Universal Studios",
    price: "₹60,000/person",
    duration: "3 Nights / 4 Days",
    image: sinImg,
    inclusions: ["Flights", "Hotel", "Universal Studio Tickets"],
  },
];

export default function Packages() {
  const [query, setQuery] = useState("");
  const [packages, setPackages] = useState([]);
  const [filteredPackages, setFilteredPackages] = useState([]);

  useEffect(() => {
    async function fetchPackages() {
      try {
        const res = await getPackages();
        if (res.data && res.data.length > 0) {
          setPackages(
            res.data.map((pkg) => ({
              ...pkg,
              image: pkg.imageUrl || kashmirImg,
              price: `₹${pkg.price}/person`,
              inclusions: ["Flights", "Hotels", "Cabs"],
            }))
          );
        } else setPackages(fallbackPackages);
      } catch (err) {
        console.error("❌ Failed to load packages:", err);
        setPackages(fallbackPackages);
      }
    }
    fetchPackages();
  }, []);

  useEffect(() => {
    setFilteredPackages(packages);
  }, [packages]);

  const searchPackages = () => {
    if (!query) return setFilteredPackages(packages);
    const results = packages.filter((pkg) =>
      pkg.title.toLowerCase().includes(query.toLowerCase())
    );
    setFilteredPackages(results);
  };

  return (
    <section className="packages-section">
      {/* 🎥 Background Video */}
      <video autoPlay loop muted playsInline className="packages-bg-video">
        <source src={packageVideo} type="video/mp4" />
      </video>

      {/* 🌍 Elegant Hero */}
      <div className="packages-hero">
        <div className="hero-overlay">
          <h1>Explore Travel Packages</h1>
          <p>
            Book <strong>Flight + Hotel + Cab</strong> packages at the best
            prices for your dream vacation.
          </p>

          <div className="search-box">
            <input
              type="text"
              placeholder="Search destination..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
            <button onClick={searchPackages}>Search</button>
          </div>
        </div>
      </div>

      {/* ✨ Featured Packages */}
      <div className="container py-5">
        <h2 className="section-heading">Featured Packages</h2>
        <div className="row g-4">
          {filteredPackages.length > 0 ? (
            filteredPackages.map((pkg) => (
              <div key={pkg.id} className="col-12 col-md-6 col-lg-4">
                <div className="card package-card h-100">
                  <img src={pkg.image} className="card-img-top" alt={pkg.title} />
                  <div className="card-body text-center">
                    <h5 className="card-title">{pkg.title}</h5>
                    <p className="card-text">{pkg.description}</p>
                    <p>
                      <strong>{pkg.price}</strong> | {pkg.duration}
                    </p>
                    <ul className="inclusions">
                      {pkg.inclusions.map((item, idx) => (
                        <li key={idx}>✅ {item}</li>
                      ))}
                    </ul>
                    <Link
                      to={`/packages/${pkg.id}`}
                      className="btn book-btn w-100"
                    >
                      Book Now
                    </Link>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <h4 className="text-center text-light mt-4">
              No packages found 😢
            </h4>
          )}
        </div>
      </div>
    </section>
  );
}
