// src/pages/Flights.jsx
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getFlights } from "../services/api.js";
import localFlights from "../data/flights.js";
import "./Flights.css";

function formatDateTime(dateStr) {
  if (!dateStr) return "N/A";
  const d = new Date(dateStr);
  return d.toLocaleString("en-IN", { dateStyle: "medium", timeStyle: "short" });
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
            id: f.id, airline: f.airline,
            fromCity: f.from, toCity: f.to,
            price: parseInt(f.price.replace(/[₹,]/g, "")),
            duration: f.duration, image: f.image,
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
            f.arrivalTime || new Date(Date.now() + 2 * 60 * 60 * 1000).toISOString(),
        }));

        setFlights(normalized);
      } catch (err) {
        console.error("❌ Backend unavailable — using local data:", err);
        setFlights(
          localFlights.map((f) => ({
            id: f.id, airline: f.airline,
            fromCity: f.from, toCity: f.to,
            price: parseInt(f.price.replace(/[₹,]/g, "")),
            duration: f.duration, image: f.image,
            departureTime: new Date().toISOString(),
            arrivalTime: new Date(Date.now() + 2 * 60 * 60 * 1000).toISOString(),
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
    const matchesFrom = !from || f.fromCity.toLowerCase() === from.toLowerCase();
    const matchesTo = !to || f.toCity.toLowerCase() === to.toLowerCase();
    return matchesFrom && matchesTo;
  });

  if (sort === "priceLow") filteredFlights.sort((a, b) => a.price - b.price);
  else if (sort === "priceHigh") filteredFlights.sort((a, b) => b.price - a.price);
  else if (sort === "duration")
    filteredFlights.sort(
      (a, b) => durationToMinutes(a.duration) - durationToMinutes(b.duration)
    );
  else if (sort === "airline")
    filteredFlights.sort((a, b) => (a.airline || "").localeCompare(b.airline || ""));

  const sortLabels = {
    priceLow: "Price (Low → High)",
    priceHigh: "Price (High → Low)",
    duration: "Duration (Shortest → Longest)",
    airline: "Airline (A → Z)",
  };

  const summaryText =
    filteredFlights.length === 0
      ? "No flights found for your search."
      : from && to
      ? `Showing ${filteredFlights.length} flight${filteredFlights.length > 1 ? "s" : ""} from ${from} → ${to}${sort ? ` | Sorted by ${sortLabels[sort]}` : ""}`
      : `Showing all ${filteredFlights.length} flights${sort ? ` | Sorted by ${sortLabels[sort]}` : ""}`;

  const filteredFromCities = uniqueFromCities.filter((city) =>
    city.toLowerCase().includes(fromQuery.toLowerCase())
  );
  const filteredToCities = uniqueToCities.filter((city) =>
    city.toLowerCase().includes(toQuery.toLowerCase())
  );

  return (
    <div className="flights-page page-container py-5">
      <h2 className="text-center mb-4" style={{ color: "#FFD700" }}>
        ✈️ Search Flights
      </h2>

      <div className="search-controls">
        <div className="search-form">
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

          <button>🔎 Search</button>
          <button
            onClick={() => {
              setFrom(""); setTo(""); setFromQuery(""); setToQuery(""); setSort("");
            }}
            style={{ marginLeft: "10px", backgroundColor: "#444", color: "#FFD700", border: "1px solid #FFD700" }}
          >
            🔁 Reset
          </button>
        </div>

        <div className="sort-box mt-3 text-center">
          <label htmlFor="sort" style={{ color: "#FFD700", marginRight: "10px" }}>
            Sort by:
          </label>
          <select
            id="sort"
            value={sort}
            onChange={(e) => setSort(e.target.value)}
            style={{ padding: "8px", borderRadius: "8px", border: "1px solid #FFD700", background: "#111", color: "#FFD700" }}
          >
            <option value="">-- Select --</option>
            <option value="priceLow">💰 Price: Low → High</option>
            <option value="priceHigh">💰 Price: High → Low</option>
            <option value="duration">⏱ Duration: Short → Long</option>
            <option value="airline">✈️ Airline (A → Z)</option>
          </select>
        </div>
      </div>

      <div className="summary-bar">{summaryText}</div>

      {loading ? (
        <p className="text-light text-center mt-4">Loading flights...</p>
      ) : (
        <div className="row g-4 mt-4">
          {filteredFlights.length > 0 ? (
            filteredFlights.map((flight) => (
              <div key={flight.id} className="col-md-4">
                <div className="card flight-card shadow-lg border-0">
                  <img src={flight.image} className="card-img-top" alt={flight.airline} />
                  <div className="card-body text-center">
                    <h5 className="card-title text-warning fw-bold">{flight.airline}</h5>
                    <p className="card-text mb-1">{flight.fromCity} ✈️ {flight.toCity}</p>
                    <p className="card-text text-light small">
                      <strong>₹{flight.price.toLocaleString()}</strong> • {flight.duration}
                    </p>
                    <small className="text-muted d-block">🕓 Departure: {formatDateTime(flight.departureTime)}</small>
                    <small className="text-muted d-block">🛬 Arrival: {formatDateTime(flight.arrivalTime)}</small>
                    <Link to={`/flights/${flight.id}`} className="btn btn-warning w-100 mt-3 fw-bold">
                      View Details
                    </Link>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <p className="text-light text-center mt-4">⚠️ No flights found for your search.</p>
          )}
        </div>
      )}
    </div>
  );
}
