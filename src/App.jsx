// 🌍 src/App.jsx
import React, { useRef, useState, useContext } from "react";
import { Routes, Route, useLocation, Navigate } from "react-router-dom";
import "./App.css";

import { UserContext } from "./context/UserContext";

// 🌌 Core Components
import Navbar from "./Components/Navbar.jsx";
import Footer from "./Components/Footer.jsx";
import ChatBox from "./Components/Chatbox/ChatBox.jsx";

import InstallPrompt from "./Components/InstallPrompt.jsx";

// 🧭 Pages
import Intro from "./pages/Intro.jsx";
import Register from "./pages/Register.jsx";
import Signin from "./pages/Signin.jsx";
import Home from "./pages/Home.jsx";
import Profile from "./pages/Profile.jsx";
import Flights from "./pages/Flights.jsx";
import FlightsDetails from "./pages/FlightsDetails.jsx";
import FlightBooking from "./pages/FlightBooking.jsx";
import Hotels from "./pages/Hotels.jsx";
import HotelsDetails from "./pages/HotelsDetails.jsx";
import Packages from "./pages/Packages.jsx";
import PackageDetails from "./pages/PackageDetails.jsx";
import Payment from "./pages/Payment.jsx";
import PaymentSuccess from "./pages/PaymentSuccess.jsx";
import MyTrips from "./pages/MyTrips.jsx";
import Dashboard from "./pages/Dashboard.jsx";
import AdminPanel from "./pages/AdminPanel.jsx";
import Stays from "./pages/stays.jsx";
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
import Packing from "./pages/Packing.jsx";

// ⭐ Protected Route
function ProtectedRoute({ children }) {
  const { user } = useContext(UserContext);
  return user ? children : <Navigate to="/signin" replace />;
}

export default function App() {
  const chatRef = useRef(null);
  const [navExpanded, setNavExpanded] = useState(true);
  const location = useLocation();

  // ⭐ Hide layout on intro/auth screens
  const hideLayout = ["/", "/register", "/signin"].includes(location.pathname);

  return (
    <>
      {/* 🧭 Navbar only after login */}
      {!hideLayout && <Navbar onToggle={(expanded) => setNavExpanded(expanded)} />}

      <div className={`main-content ${navExpanded ? "" : "collapsed"}`}>
        <main className="flex-grow-1">
          <Routes>
            {/* PUBLIC ROUTES */}
            <Route path="/" element={<Intro />} />
            <Route path="/register" element={<Register />} />
            <Route path="/signin" element={<Signin />} />

            {/* PROTECTED ROUTES */}
            <Route path="/home" element={<ProtectedRoute><Home /></ProtectedRoute>} />
            <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
            <Route path="/flights" element={<ProtectedRoute><Flights /></ProtectedRoute>} />
            <Route path="/flights/:id" element={<ProtectedRoute><FlightsDetails /></ProtectedRoute>} />
            <Route path="/flights/book/:id" element={<ProtectedRoute><FlightBooking /></ProtectedRoute>} />

            <Route path="/hotels" element={<ProtectedRoute><Hotels /></ProtectedRoute>} />
            <Route path="/hotels/:id" element={<ProtectedRoute><HotelsDetails /></ProtectedRoute>} />

            <Route path="/packages" element={<ProtectedRoute><Packages /></ProtectedRoute>} />
            <Route path="/packages/:id" element={<ProtectedRoute><PackageDetails /></ProtectedRoute>} />

            <Route path="/payment" element={<ProtectedRoute><Payment /></ProtectedRoute>} />
            <Route path="/payment/success" element={<ProtectedRoute><PaymentSuccess /></ProtectedRoute>} />

            <Route path="/mytrips" element={<ProtectedRoute><MyTrips /></ProtectedRoute>} />
            <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
            <Route path="/admin" element={<ProtectedRoute><AdminPanel /></ProtectedRoute>} />

            <Route path="/stays" element={<ProtectedRoute><Stays /></ProtectedRoute>} />
            <Route path="/stays/:id" element={<ProtectedRoute><StayDetails /></ProtectedRoute>} />

            <Route path="/users" element={<ProtectedRoute><Users /></ProtectedRoute>} />

            <Route path="/attractions" element={<ProtectedRoute><Attractions /></ProtectedRoute>} />
            <Route path="/attractions/:id" element={<ProtectedRoute><AttractionDetails /></ProtectedRoute>} />

            <Route path="/transport" element={<ProtectedRoute><Transport /></ProtectedRoute>} />
            <Route path="/transport/car/:id" element={<ProtectedRoute><CarBooking /></ProtectedRoute>} />
            <Route path="/transport/cab/:id" element={<ProtectedRoute><CabBooking /></ProtectedRoute>} />
            <Route path="/transport/:type/:id" element={<ProtectedRoute><TransportDetails /></ProtectedRoute>} />

            <Route path="/dining" element={<ProtectedRoute><Dining /></ProtectedRoute>} />
            <Route path="/dining/:id" element={<ProtectedRoute><DiningDetails /></ProtectedRoute>} />

            <Route path="/events" element={<ProtectedRoute><Events /></ProtectedRoute>} />
            <Route path="/events/:id" element={<ProtectedRoute><EventDetails /></ProtectedRoute>} />

            <Route path="/about" element={<ProtectedRoute><About /></ProtectedRoute>} />
            <Route path="/destination/:name" element={<ProtectedRoute><DestinationPage /></ProtectedRoute>} />

            <Route path="/wander-tracker" element={<ProtectedRoute><WanderTracker /></ProtectedRoute>} />
            <Route path="/memories" element={<ProtectedRoute><Memories /></ProtectedRoute>} />
            <Route path="/map" element={<ProtectedRoute><MapPage /></ProtectedRoute>} />

            <Route path="/timeline" element={<ProtectedRoute><Timeline /></ProtectedRoute>} />
            <Route path="/settings" element={<ProtectedRoute><Settings /></ProtectedRoute>} />

            <Route path="/help" element={<ProtectedRoute><HelpCenter /></ProtectedRoute>} />
            <Route path="/help/create-ticket" element={<ProtectedRoute><CreateTicket /></ProtectedRoute>} />
            <Route path="/help/live-chat" element={<ProtectedRoute><LiveChat /></ProtectedRoute>} />
            <Route path="/help/contact" element={<ProtectedRoute><ContactHelp /></ProtectedRoute>} />
            <Route path="/help/status" element={<ProtectedRoute><AppStatus /></ProtectedRoute>} />
            <Route path="/help/faqs" element={<ProtectedRoute><Faqs /></ProtectedRoute>} />
            <Route path="/help/tickets" element={<ProtectedRoute><MyTickets /></ProtectedRoute>} />

            <Route path="/budget" element={<ProtectedRoute><Budget /></ProtectedRoute>} />
            <Route path="/packing" element={<ProtectedRoute><Packing /></ProtectedRoute>} />

          </Routes>
        </main>

        {/* ⭐ FOOTER + CHATBOX ONLY AFTER LOGIN */}
        {!hideLayout && (
          <>
            <Footer />
            <ChatBox ref={chatRef} />
            <InstallPrompt />
          </>
        )}
      </div>
    </>
  );
}
