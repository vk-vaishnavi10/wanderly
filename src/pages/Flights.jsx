// src/pages/Flights.jsx
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getFlights } from "../services/api.js";
import localFlights from "../data/flights.js";
import "./Flights.css";

function formatDateTime(dateStr) {
  if (!dateStr) return "N/A";
  const d = new Date(dateStr);
  return d.toLocaleString("en-IN", {
    dateStyle: "medium",
    timeStyle: "short",
  });
}

function durationToMinutes(duration) {
  const match = duration?.match(/(\d+)h\s*(\d+)?m?/);
  if (!match) return 0;
  const hours = parseInt(match[1]) || 0;
  const mins = parseInt(match[2]) || 0;
  return hours * 60 + mins;
}

export default function Flights() {
  const [flights, setFlights] = useState([]);
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");
  const [sort, setSort] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [fromQuery, setFromQuery] = useState("");
  const [toQuery, setToQuery] = useState("");

  const [showFromOptions, setShowFromOptions] = useState(false);
  const [showToOptions, setShowToOptions] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);

        const res = await getFlights();
        let data = Array.isArray(res.data) ? res.data : [];

        if (data.length === 0) {
          data = localFlights.map((f) => ({
            id: f.id,
            airline: f.airline,
            fromCity: f.from,
            toCity: f.to,
            price: parseInt(f.price.replace(/[₹,]/g, "")),
            duration: f.duration,
            image: f.image,
          }));
        }

        const normalized = data.map((f) => ({
          id: f.id,
          airline: f.airline,
          fromCity: f.fromCity || f.from,
          toCity: f.toCity || f.to,
          price: parseInt(f.price?.toString().replace(/[^\d]/g, "")) || 0,
          duration: f.duration || "2h",
          image: f.image || "https://via.placeholder.com/400x250?text=Flight",
          departureTime: f.departureTime || new Date().toISOString(),
          arrivalTime:
            f.arrivalTime ||
            new Date(Date.now() + 2 * 60 * 60 * 1000).toISOString(),
        }));

        setFlights(normalized);
      } catch (err) {
        console.error("Backend offline, using demo:", err);

        setFlights(
          localFlights.map((f) => ({
            id: f.id,
            airline: f.airline,
            fromCity: f.from,
            toCity: f.to,
            price: parseInt(f.price.replace(/[₹,]/g, "")),
            duration: f.duration,
            image: f.image,
            departureTime: new Date().toISOString(),
            arrivalTime: new Date(
              Date.now() + 2 * 60 * 60 * 1000
            ).toISOString(),
          }))
        );

        setError("⚠️ Showing demo flight data (offline mode).");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const uniqueFromCities = [...new Set(flights.map((f) => f.fromCity))];
  const uniqueToCities = [...new Set(flights.map((f) => f.toCity))];

  let filteredFlights = flights.filter((f) => {
    const mFrom = !from || f.fromCity.toLowerCase() === from.toLowerCase();
    const mTo = !to || f.toCity.toLowerCase() === to.toLowerCase();
    return mFrom && mTo;
  });

  if (sort === "priceLow") filteredFlights.sort((a, b) => a.price - b.price);
  if (sort === "priceHigh") filteredFlights.sort((a, b) => b.price - a.price);
  if (sort === "duration")
    filteredFlights.sort(
      (a, b) => durationToMinutes(a.duration) - durationToMinutes(b.duration)
    );
  if (sort === "airline")
    filteredFlights.sort((a, b) =>
      (a.airline || "").localeCompare(b.airline || "")
    );

  const sortLabels = {
    priceLow: "Price (Low → High)",
    priceHigh: "Price (High → Low)",
    duration: "Duration (Shortest → Longest)",
    airline: "Airline (A → Z)",
  };

  const summaryText =
    filteredFlights.length === 0
      ? "No flights found."
      : from && to
      ? `Showing ${filteredFlights.length} flight${
          filteredFlights.length > 1 ? "s" : ""
        } from ${from} → ${to}${
          sort ? ` | Sorted by ${sortLabels[sort]}` : ""
        }`
      : `Showing all ${filteredFlights.length} flights${
          sort ? ` | Sorted by ${sortLabels[sort]}` : ""
        }`;

  const filteredFromCities = uniqueFromCities.filter((city) =>
    city.toLowerCase().includes(fromQuery.toLowerCase())
  );

  const filteredToCities = uniqueToCities.filter((city) =>
    city.toLowerCase().includes(toQuery.toLowerCase())
  );

  return (
    <div className="flights-page page-container py-5">

      {/* TITLE */}
      <h2>
        <span className="emoji">✈️</span>
        <span className="flights-title-text">Flight Planner</span>
      </h2>

      <p className="flights-subtitle">
        Pick, sort, filter — served in a calm caramel coffee workspace.
      </p>

      {/* SEARCH BOX */}
      <div className="search-controls">
        <div className="search-form">

          {/* From City */}
          <div className="dropdown-wrapper">
            <input
              type="text"
              value={fromQuery}
              onChange={(e) => setFromQuery(e.target.value)}
              onFocus={() => setShowFromOptions(true)}
              onBlur={() => setTimeout(() => setShowFromOptions(false), 200)}
              placeholder="From"
              className="search-input"
            />
            {showFromOptions && (
              <ul className="dropdown-list">
                {filteredFromCities.length > 0 ? (
                  filteredFromCities.map((city) => (
                    <li
                      key={city}
                      onClick={() => {
                        setFrom(city);
                        setFromQuery(city);
                        setShowFromOptions(false);
                      }}
                    >
                      {city}
                    </li>
                  ))
                ) : (
                  <li className="no-option">No match</li>
                )}
              </ul>
            )}
          </div>

          {/* To City */}
          <div className="dropdown-wrapper">
            <input
              type="text"
              value={toQuery}
              onChange={(e) => setToQuery(e.target.value)}
              onFocus={() => setShowToOptions(true)}
              onBlur={() => setTimeout(() => setShowToOptions(false), 200)}
              placeholder="To"
              className="search-input"
            />
            {showToOptions && (
              <ul className="dropdown-list">
                {filteredToCities.length > 0 ? (
                  filteredToCities.map((city) => (
                    <li
                      key={city}
                      onClick={() => {
                        setTo(city);
                        setToQuery(city);
                        setShowToOptions(false);
                      }}
                    >
                      {city}
                    </li>
                  ))
                ) : (
                  <li className="no-option">No match</li>
                )}
              </ul>
            )}
          </div>

          {/* Buttons */}
          <button>🔎 Search</button>

          <button
            className="reset-btn"
            onClick={() => {
              setFrom("");
              setTo("");
              setFromQuery("");
              setToQuery("");
              setSort("");
            }}
          >
            🔁 Reset
          </button>
        </div>

        {/* SORT BOX */}
        <div className="sort-box mt-3 text-center">
          <label className="sort-label">Sort by:</label>
          <select
            className="sort-select"
            value={sort}
            onChange={(e) => setSort(e.target.value)}
          >
            <option value="">-- Select --</option>
            <option value="priceLow">💰 Price: Low → High</option>
            <option value="priceHigh">💰 Price: High → Low</option>
            <option value="duration">⏱ Duration</option>
            <option value="airline">✈️ Airline</option>
          </select>
        </div>
      </div>

      {/* SUMMARY */}
      <div className="summary-bar">{summaryText}</div>
      {error && <p className="text-warning text-center">{error}</p>}

      {/* FLIGHTS GRID */}
      {loading ? (
        <p className="text-light text-center mt-4">Loading flights...</p>
      ) : (
        <div className="row g-4 mt-4 flights-row">
          {filteredFlights.length > 0 ? (
            filteredFlights.map((flight) => (
              <div key={flight.id} className="col-md-4">
                <div className="card flight-card wavy shadow-lg border-0">

                  <img
                    src={flight.image}
                    alt={flight.airline}
                    className="card-img-top"
                  />

                  <div className="card-body text-center">

                    <h5 className="card-title">{flight.airline}</h5>

                    <p className="card-text mb-1">
                      {flight.fromCity} ✈️ {flight.toCity}
                    </p>

                    <p className="card-text">
                      <strong>₹{flight.price.toLocaleString()}</strong> •{" "}
                      {flight.duration}
                    </p>

                    <small className="d-block">
                      Departure: {formatDateTime(flight.departureTime)}
                    </small>
                    <small className="d-block">
                      Arrival: {formatDateTime(flight.arrivalTime)}
                    </small>

                    {/* ✔ CORRECT BUTTON WITH CLASS view-btn */}
                    <Link
  to={`/flights/book/${flight.id}`}
  state={{ flight }}
  className="view-btn w-100 mt-3 fw-bold"
>
  Book Now
</Link>



                  </div>
                </div>
              </div>
            ))
          ) : (
            <p className="text-light text-center">No flights found.</p>
          )}
        </div>
      )}
    </div>
  );
}
