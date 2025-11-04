// src/App.jsx
import React, { useRef, useState } from "react";
import { Routes, Route } from "react-router-dom";
import "./App.css";

// 🌍 Core Components
import Navbar from "./Components/Navbar.jsx";
import Footer from "./Components/Footer.jsx";
import ChatBox from "./Components/ChatBox.jsx";
import InstallPrompt from "./Components/InstallPrompt.jsx";

// 🧭 Pages
import Profile from "./pages/Profile.jsx";
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
import Stays from "./pages/stays.jsx";
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
import StayDetails from "./pages/StayDetails.jsx";
import TransportDetails from "./pages/TransportDetails.jsx";
import Register from "./pages/Register.jsx";
import Signin from "./pages/Signin.jsx";
import Users from "./pages/Users.jsx";
import DestinationPage from "./pages/DestinationPage.jsx";
import WanderTracker from "./pages/WanderTracker.jsx";
import Memories from "./pages/Memories.jsx";
export default function App() {
  const chatRef = useRef(null);
  const [chatOpen, setChatOpen] = useState(false);

  return (
    <>
      {/* 🌟 Navbar */}
      <Navbar />

      {/* 🧭 Main Routes */}
      <main className="flex-grow-1">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/flights" element={<Flights />} />
          <Route path="/flights/:id" element={<FlightsDetails />} />
          <Route path="/flights/book/:id" element={<FlightBooking />} />
          <Route path="/hotels" element={<Hotels />} />
          <Route path="/hotels/:id" element={<HotelsDetails />} />
          <Route path="/hotels/book/:id" element={<HotelBooking />} />
          <Route path="/packages" element={<Packages />} />
          <Route path="/packages/:id" element={<PackageDetails />} />
          <Route path="/payment/:id" element={<Payment />} />
          <Route path="/payment/success" element={<PaymentSuccess />} />
          <Route path="/mytrips" element={<MyTrips />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/admin" element={<AdminPanel />} />
          <Route path="/stays" element={<Stays />} />
          <Route path="/stays/:id" element={<StayDetails />} />
          <Route path="/users" element={<Users />} />
          <Route path="/attractions" element={<Attractions />} />
          <Route path="/attractions/:id" element={<AttractionDetails />} />
          <Route path="/transport" element={<Transport />} />
          <Route path="/transport/car/:id" element={<CarBooking />} />
          <Route path="/transport/cab/:id" element={<CabBooking />} />
          <Route path="/transport/:type/:id" element={<TransportDetails />} />
          <Route path="/dining" element={<Dining />} />
          <Route path="/dining/:id" element={<DiningDetails />} />
          <Route path="/events" element={<Events />} />
          <Route path="/events/:id" element={<EventDetails />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/register" element={<Register />} />
          <Route path="/signin" element={<Signin />} />
          <Route path="/about" element={<About />} />
          <Route path="/destination/:name" element={<DestinationPage />} />
          <Route path="/wander-tracker" element={<WanderTracker />} />
          <Route path="/memories" element={<Memories />} />

        </Routes>
      </main>

      {/* 🌎 Footer */}
      <Footer />

      {/* 💬 Wanderly Chat Assistant */}
      <ChatBox ref={chatRef} onToggle={(open) => setChatOpen(open)} />

      {/* 📲 Install App Prompt */}
      <InstallPrompt />
    </>
  );
}
