// 🌍 src/App.jsx
import React, { useRef, useState } from "react";
import { Routes, Route, useLocation } from "react-router-dom";
import "./App.css";

// 🌌 Core Components
import Navbar from "./Components/Navbar.jsx";
import Footer from "./Components/Footer.jsx";
import ChatBox from "./Components/ChatBox.jsx";
import InstallPrompt from "./Components/InstallPrompt.jsx";

// 🧭 Pages
import Intro from "./pages/Intro.jsx"; // 🎥 NEW cinematic intro page
import Register from "./pages/Register.jsx";
import Signin from "./pages/Signin.jsx";
import Home from "./pages/Home.jsx";
import Profile from "./pages/Profile.jsx";
import Flights from "./pages/Flights.jsx";
import FlightsDetails from "./pages/FlightsDetails.jsx";
import FlightBooking from "./pages/FlightBooking.jsx";
import Hotels from "./pages/Hotels.jsx";
import HotelsDetails from "./pages/HotelsDetails.jsx";
import HotelBooking from "./pages/HotelBooking.jsx";
import Packages from "./pages/Packages.jsx";
import PackageDetails from "./pages/PackageDetails.jsx";
import Payment from "./pages/Payment.jsx";
import PaymentSuccess from "./pages/PaymentSuccess.jsx";
import MyTrips from "./pages/MyTrips.jsx";
import Dashboard from "./pages/Dashboard.jsx";
import AdminPanel from "./pages/AdminPanel.jsx";
import Stays from "./pages/Stays.jsx";
import StayDetails from "./pages/StayDetails.jsx";
import Attractions from "./pages/Attractions.jsx";
import AttractionDetails from "./pages/AttractionDetails.jsx";
import Transport from "./pages/Transport.jsx";
import CarBooking from "./pages/CarBooking.jsx";
import CabBooking from "./pages/CabBooking.jsx";
import TransportDetails from "./pages/TransportDetails.jsx";
import Dining from "./pages/Dining.jsx";
import DiningDetails from "./pages/DiningDetails.jsx";
import Events from "./pages/Events.jsx";
import EventDetails from "./pages/EventDetails.jsx";
import About from "./pages/About.jsx";
import Users from "./pages/Users.jsx";
import DestinationPage from "./pages/DestinationPage.jsx";
import WanderTracker from "./pages/WanderTracker.jsx";
import Memories from "./pages/Memories.jsx";
import MapPage from "./pages/Map.jsx";
import Timeline from "./pages/Timeline.jsx";
import Settings from "./pages/Settings.jsx";
import HelpCenter from "./pages/HelpCenter.jsx"; 
import CreateTicket from "./pages/help/CreateTicket.jsx";
import LiveChat from "./pages/help/LiveChat.jsx";
import ContactHelp from "./pages/help/ContactHelp.jsx";
import AppStatus from "./pages/help/AppStatus.jsx";
import Faqs from "./pages/help/Faqs.jsx";
import MyTickets from "./pages/help/MyTickets.jsx";
import Budget from "./pages/Budget.jsx";



export default function App() {
  const chatRef = useRef(null);
  const [chatOpen, setChatOpen] = useState(false);
  const [navExpanded, setNavExpanded] = useState(true);
  const location = useLocation();

  // 🚫 Hide Navbar, Footer, ChatBox, and InstallPrompt
  // on cinematic / auth screens
  const hideLayout =
    location.pathname === "/" || // 🎬 Intro video page
    location.pathname === "/register" || // 🪄 Registration form
    location.pathname === "/signin"; // 🔐 Sign in page

  return (
    <>
      {/* 🧭 Navbar visible only on main pages */}
      {!hideLayout && (
        <Navbar onToggle={(expanded) => setNavExpanded(expanded)} />
      )}

      {/* 🌌 Main Page Content */}
      <div className={`main-content ${navExpanded ? "" : "collapsed"}`}>
        <main className="flex-grow-1">
          <Routes>
            {/* 🎥 Cinematic flow */}
            <Route path="/" element={<Intro />} /> {/* 🌄 Intro Video Page */}
            <Route path="/register" element={<Register />} /> {/* 🪄 Register */}
            <Route path="/signin" element={<Signin />} /> {/* 🔐 Signin */}

            {/* 🏠 Main Application Pages */}
            <Route path="/home" element={<Home />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/flights" element={<Flights />} />
            <Route path="/flights/:id" element={<FlightsDetails />} />
            <Route path="/flightbooking/:id" element={<FlightBooking />} />

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
            <Route path="/about" element={<About />} />
            <Route path="/destination/:name" element={<DestinationPage />} />
            <Route path="/wander-tracker" element={<WanderTracker />} />
            <Route path="/memories" element={<Memories />} />
            <Route path="/map" element={<MapPage />} />
            <Route path="/timeline" element={<Timeline />} />
            <Route path="/settings" element={<Settings />} />
            <Route path="/help" element={<HelpCenter />} /> {/* 🆕 Help Center */}
            <Route path="/help/create-ticket" element={<CreateTicket />} />
<Route path="/help/live-chat" element={<LiveChat />} />
<Route path="/help/contact" element={<ContactHelp />} />
<Route path="/help/status" element={<AppStatus />} />
<Route path="/help/faqs" element={<Faqs />} />
<Route path="/help/tickets" element={<MyTickets />} />
<Route path="/budget" element={<Budget />} /> {/* 💜 Budget Route */}


          </Routes>
        </main>

        {/* 🧩 Footer + ChatBox + Install Prompt (hidden on intro/auth) */}
        {!hideLayout && (
          <>
            <Footer />
            <ChatBox ref={chatRef} onToggle={(open) => setChatOpen(open)} />
            <InstallPrompt />
          </>
        )}
      </div>
    </>
  );
}
