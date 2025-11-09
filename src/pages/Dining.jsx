import React from "react";
import { Link } from "react-router-dom";
import "./Dining.css";
import stImg from "../images/st.jpeg";

// 🎬 Use public path instead of importing from assets
const diningVideo = "/videos/diningbg.mp4";

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
      img: stImg,
    },
  ];

  return (
    <div className="dining-page">
      {/* 🎥 Background Video */}
      <video
        className="dining-bg-video"
        autoPlay
        loop
        muted
        playsInline
        preload="auto"
        onLoadedData={() => console.log("✅ Dining video loaded")}
        onError={(e) => console.error("❌ Dining video load error:", e)}
      >
        <source src={diningVideo} type="video/mp4" />
        Your browser does not support the video tag.
      </video>

      {/* 🪞 Glass Overlay */}
      <div className="dining-overlay"></div>

      {/* 🌟 Hero Section */}
      <section className="dining-hero text-center">
        <h1>🍴 Dining & Food</h1>
        <p>Explore restaurants, cafés, and street food around your stay.</p>
      </section>

      {/* 🍽️ Dining Options */}
      <section className="container py-5">
        <h2 className="section-heading">✨ Popular Dining Choices</h2>
        <div className="row g-4 justify-content-center">
          {diningOptions.map((place, index) => (
            <div
              key={place.id}
              className="col-md-4 fade-in"
              style={{ animationDelay: `${index * 0.2}s` }}
            >
              <div className="dining-card">
                <img src={place.img} alt={place.title} className="dining-img" />
                <div className="p-3">
                  <h4>{place.title}</h4>
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
