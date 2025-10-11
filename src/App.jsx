import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import "./App.css";

// 🔹 Components
import Navbar from "./Components/Navbar.jsx";
import Footer from "./Components/Footer.jsx";
import ChatBox from "./Components/ChatBox.jsx";

// 🔹 Pages
import Home from "./pages/Home.jsx";
import Flights from "./pages/Flights.jsx";
import FlightsDetails from "./pages/FlightsDetails.jsx";
import FlightBooking from "./pages/FlightBooking.jsx";
import Hotels from "./pages/Hotels.jsx";
import HotelsDetails from "./pages/HotelsDetails.jsx";
import HotelBooking from "./pages/HotelBooking.jsx";
import Packages from "./pages/Packages.jsx";
import PackageDetails from "./pages/PackageDetails.jsx";
import MyTrips from "./pages/MyTrips.jsx";
import Payment from "./pages/Payment.jsx";
import PaymentSuccess from "./pages/PaymentSuccess.jsx";
import Dashboard from "./pages/Dashboard.jsx";
import AdminPanel from "./pages/AdminPanel.jsx";
import Stays from "./pages/Stays.jsx";
import Attractions from "./pages/Attractions.jsx";
import AttractionDetails from "./pages/AttractionDetails.jsx";
import Transport from "./pages/Transport.jsx";
import Dining from "./pages/Dining.jsx";
import Events from "./pages/Events.jsx";
import About from "./pages/About.jsx";
import CarBooking from "./pages/CarBooking.jsx";
import CabBooking from "./pages/CabBooking.jsx";
import DiningDetails from "./pages/DiningDetails.jsx";
import EventDetails from "./pages/EventDetails.jsx";
import StayDetails from "./pages/StayDetails";
import TransportDetails from "./pages/TransportDetails.jsx";
// 🔹 Auth Pages
import Register from "./pages/Register.jsx";
import Signin from "./pages/Signin.jsx";
import Users from "./pages/Users";
// 🔹 Destination
import DestinationPage from "./pages/DestinationPage.jsx";

export default function App() {
  return (
    <Router>
      <Navbar />
      <main className="flex-grow-1">
        <Routes>
          {/* 🏠 Home */}
          <Route path="/" element={<Home />} />

          {/* ✈️ Flights */}
          <Route path="/flights" element={<Flights />} />
          <Route path="/flights/:id" element={<FlightsDetails />} />
          <Route path="/flights/book/:id" element={<FlightBooking />} />

          {/* 🏨 Hotels */}
          <Route path="/hotels" element={<Hotels />} />
          <Route path="/hotels/:id" element={<HotelsDetails />} />
          <Route path="/hotels/book/:id" element={<HotelBooking />} />

          {/* 📦 Packages */}
          <Route path="/packages" element={<Packages />} />
          <Route path="/packages/:id" element={<PackageDetails />} />

          {/* 💳 Payments */}
          <Route path="/payment" element={<Payment />} />
          <Route path="/payment/:id" element={<Payment />} />
          <Route path="/payment/success" element={<PaymentSuccess />} />

          {/* 🧳 My Trips */}
          <Route path="/mytrips" element={<MyTrips />} />

          {/* 📊 Dashboard & Admin */}
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/admin" element={<AdminPanel />} />

          {/* 🏠 Stays */}
          <Route path="/stays" element={<Stays />} />

          {/* 🧑‍💻 Users */}
          <Route path="/users" element={<Users />} />

          {/* 🏝️ Attractions */}
          <Route path="/attractions" element={<Attractions />} />
          <Route path="/attractions/:id" element={<AttractionDetails />} />

          {/* 🚗 Transport */}
          <Route path="/transport" element={<Transport />} />
          <Route path="/transport/car/:id" element={<CarBooking />} />
          <Route path="/transport/cab/:id" element={<CabBooking />} />

          {/* 🍽️ Dining */}
          <Route path="/dining" element={<Dining />} />
          <Route path="/dining/:id" element={<DiningDetails />} />

          {/* 🎉 Events */}
          <Route path="/events" element={<Events />} />
          <Route path="/events/:id" element={<EventDetails />} />

          {/* 🔐 Auth */}
          <Route path="/register" element={<Register />} />
          <Route path="/signin" element={<Signin />} />
          <Route path="/stays/:id" element={<StayDetails />} />

          {/* ℹ️ About */}
          <Route path="/about" element={<About />} />

          <Route path="/transport/:type/:id" element={<TransportDetails />} />

          {/* 🌍 Destination */}
          <Route path="/destination/:name" element={<DestinationPage />} />
        </Routes>
      </main>
      <Footer />
      <ChatBox />
    </Router>
  );
}
