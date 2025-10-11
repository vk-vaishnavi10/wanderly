import React from "react";
import { Link } from "react-router-dom";
import "./Dining.css";

// ✅ Import local image for Street Food
import stImg from "../images/st.jpeg";

export default function Dining() {
  const diningOptions = [
    {
      id: 1,
      title: "Fine Dining 🍷",
      desc: "Luxury restaurants offering exquisite cuisines and top-class service.",
      img: "https://images.unsplash.com/photo-1528605248644-14dd04022da1?w=800",
    },
    {
      id: 2,
      title: "Local Cafés ☕",
      desc: "Charming cafés serving authentic local flavors and cozy vibes.",
      img: "https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=800",
    },
    {
      id: 3,
      title: "Street Food 🌮",
      desc: "Experience the culture through vibrant street food scenes.",
      img: stImg, // ✅ local image used here
    },
  ];

  return (
    <div className="dining-page">
      {/* 🌟 Hero */}
      <section className="dining-hero text-center text-light">
        <h1 className="fw-bold">🍴 Dining & Food</h1>
        <p className="lead text-warning">
          Explore restaurants, cafés, and street food around your stay.
        </p>
      </section>

      {/* 🍽️ Dining Options */}
      <section className="container py-5">
        <h2 className="text-center mb-4 text-warning fw-bold">
          ✨ Popular Dining Choices
        </h2>
        <div className="row g-4">
          {diningOptions.map((place) => (
            <div key={place.id} className="col-md-4">
              <div className="dining-card bg-dark text-light shadow-lg border border-warning rounded-3 overflow-hidden">
                <img
                  src={place.img}
                  alt={place.title}
                  className="dining-img w-100"
                  style={{ height: "230px", objectFit: "cover" }}
                />
                <div className="p-3">
                  <h4 className="text-warning">{place.title}</h4>
                  <p>{place.desc}</p>

                  <Link
                    to={`/dining/${place.id}`}
                    className="btn btn-warning w-100 fw-bold mt-2"
                  >
                    Reserve Table 🍽️
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
