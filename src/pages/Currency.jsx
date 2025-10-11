import React, { useContext, useState } from "react";
import { CurrencyContext } from "../context/CurrencyContext";

export default function Currency() {
  const { currency, setCurrency } = useContext(CurrencyContext);
  const [amount, setAmount] = useState(1000);

  // Sample conversion rates (you can replace with API later)
  const rates = {
    INR: 1,
    USD: 0.012,
    EUR: 0.011,
    GBP: 0.0095,
    JPY: 1.7,
  };

  const converted = (amount * rates[currency]).toFixed(2);

  return (
    <div
      className="container text-center py-5"
      style={{ backgroundColor: "black", color: "yellow", minHeight: "100vh" }}
    >
      <h1 className="mb-4">💱 Currency Converter</h1>
      <p>Switch your preferred currency for bookings and packages.</p>

      {/* Select Currency */}
      <div className="mb-4">
        <label className="form-label me-2">Choose Currency: </label>
        <select
          className="form-select w-auto d-inline-block"
          value={currency}
          onChange={(e) => setCurrency(e.target.value)}
        >
          <option value="INR">🇮🇳 INR</option>
          <option value="USD">🇺🇸 USD</option>
          <option value="EUR">🇪🇺 EUR</option>
          <option value="GBP">🇬🇧 GBP</option>
          <option value="JPY">🇯🇵 JPY</option>
        </select>
      </div>

      {/* Amount Input */}
      <div className="mb-4">
        <label className="form-label me-2">Enter Amount (INR): </label>
        <input
          type="number"
          className="form-control w-25 d-inline-block"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
        />
      </div>

      {/* Conversion Result */}
      <h3>
        Converted: <span className="text-warning">{converted}</span>{" "}
        {currency}
      </h3>
    </div>
  );
}
