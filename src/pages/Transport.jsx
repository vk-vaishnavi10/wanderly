import React from "react";
import { useNavigate } from "react-router-dom";
import "./Transport.css";

// ✅ Import your local images
import sedanImg from "../images/sedan.webp";
import suvImg from "../images/suv.png";
import luxuryImg from "../images/luxurycar.webp";
import airportImg from "../images/airport.jpg";
import localImg from "../images/local.jpeg";
import outImg from "../images/out.jpeg";

export default function Transport() {
  const navigate = useNavigate();

  // 🚗 Car Rentals Data
  const cars = [
    {
      id: 1,
      title: "Sedan",
      price: "₹2000/day",
      desc: "Comfortable and fuel-efficient, perfect for city drives.",
      img: sedanImg,
    },
    {
      id: 2,
      title: "SUV",
      price: "₹3500/day",
      desc: "Spacious SUV with off-road capability and comfort.",
      img: suvImg,
    },
    {
      id: 3,
      title: "Luxury Car",
      price: "₹7000/day",
      desc: "Premium comfort and performance for special trips.",
      img: luxuryImg,
    },
  ];

  // 🚕 Cab Services Data
  const cabs = [
    {
      id: 1,
      title: "Airport Cabs",
      price: "From ₹800",
      desc: "Quick and reliable rides to and from the airport.",
      img: airportImg,
    },
    {
      id: 2,
      title: "Local City Rides",
      price: "From ₹300",
      desc: "Affordable rides for daily commutes within the city.",
      img: localImg,
    },
    {
      id: 3,
      title: "Outstation Cabs",
      price: "From ₹2500",
      desc: "Comfortable and safe long-distance rides to nearby cities.",
      img: outImg,
    },
  ];

  return (
    <div className="transport-page">
      {/* 🚖 Hero Section */}
      <section className="transport-hero text-center">
        <h1>🚖 Transport Services</h1>
        <p>Choose from our reliable car rentals and cab services.</p>
      </section>

      {/* 🚗 Car Rentals Section */}
      <section className="container py-5">
        <h2 className="text-center mb-4">🚗 Available Car Rentals</h2>
        <div className="row g-4">
          {cars.map((car) => (
            <div key={car.id} className="col-md-4">
              <div className="transport-card shadow-lg rounded">
                <img src={car.img} alt={car.title} className="transport-img" />
                <div className="p-3">
                  <h4>{car.title}</h4>
                  <p className="text-warning fw-bold">{car.price}</p>
                  <p>{car.desc}</p>
                  <button
                    className="btn btn-warning w-100"
                    onClick={() => navigate(`/transport/car/${car.id}`)}
                  >
                    Book Now
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 🚕 Cab Services Section */}
      <section className="container py-5">
        <h2 className="text-center mb-4">🚕 Cab Services</h2>
        <div className="row g-4">
          {cabs.map((cab) => (
            <div key={cab.id} className="col-md-4">
              <div className="transport-card shadow-lg rounded">
                <img src={cab.img} alt={cab.title} className="transport-img" />
                <div className="p-3">
                  <h4>{cab.title}</h4>
                  <p className="text-warning fw-bold">{cab.price}</p>
                  <p>{cab.desc}</p>
                  <button
                    className="btn btn-warning w-100"
                    onClick={() => navigate(`/transport/cab/${cab.id}`)}
                  >
                    Book Now
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
