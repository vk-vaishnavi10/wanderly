import axios from "axios";

/* ============================================================
   🌍 Wanderly — API Configuration (Optimized)
   By Vaishnavi 💜 — Updated for AI Chat Integration & Stability
============================================================ */

// ✅ Base API URL (Switch automatically for production)
const API_BASE =
  import.meta.env.VITE_API_BASE || "http://localhost:8085/api";

// ✅ Create reusable Axios instance
const api = axios.create({
  baseURL: API_BASE,
  headers: { "Content-Type": "application/json" },
  timeout: 15000, // ⏱️ Max wait 15s per request
});

// ✅ Global response interceptor for consistent error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error(
      "🚨 API Error:",
      error.response?.data?.message || error.message
    );
    return Promise.reject(
      error.response?.data || { message: "Network Error. Try again later." }
    );
  }
);

/* ============================================================
   👥 USERS
============================================================ */
export const registerUser = (user) => api.post(`/users/register`, user);
export const loginUser = (user) => api.post(`/users/login`, user);
export const getUsers = () => api.get(`/users`);
export const getUserById = (id) => api.get(`/users/${id}`);
export const updateUser = (id, user) => api.put(`/users/${id}`, user);
export const deleteUser = (id) => api.delete(`/users/${id}`);

/* ============================================================
   📱 OTP (Phone-based)
============================================================ */
export const sendOtp = (phone) => api.post(`/users/send-otp`, { phone });
export const verifyOtp = (phone, otp) => api.post(`/users/verify-otp`, { phone, otp });

/* ============================================================
   ✈️ FLIGHTS
============================================================ */
export const getFlights = () => api.get(`/flights`);
export const getFlightById = (id) => api.get(`/flights/${id}`);
export const addFlight = (flight) => api.post(`/flights`, flight);
export const updateFlight = (id, flight) => api.put(`/flights/${id}`, flight);
export const deleteFlight = (id) => api.delete(`/flights/${id}`);

/* ============================================================
   🎫 FLIGHT BOOKINGS
============================================================ */
export const addFlightBooking = (booking) => api.post(`/flight-bookings`, booking);
export const getFlightBookings = () => api.get(`/flight-bookings`);
export const deleteFlightBooking = (id) => api.delete(`/flight-bookings/${id}`);

/* ============================================================
   🎒 PACKAGES
============================================================ */
export const getPackages = () => api.get(`/packages`);
export const getPackageById = (id) => api.get(`/packages/${id}`);
export const addPackage = (pkg) => api.post(`/packages`, pkg);
export const updatePackage = (id, pkg) => api.put(`/packages/${id}`, pkg);
export const deletePackage = (id) => api.delete(`/packages/${id}`);

/* ============================================================
   🧳 PACKAGE BOOKINGS
============================================================ */
export const addPackageBooking = (booking) => api.post(`/package-bookings`, booking);
export const getPackageBookings = () => api.get(`/package-bookings`);
export const deletePackageBooking = (id) => api.delete(`/package-bookings/${id}`);

/* ============================================================
   💳 PAYMENTS
============================================================ */
export const addPayment = (payment) => api.post(`/payments`, payment);
export const getPayments = () => api.get(`/payments`);

/* ============================================================
   💰 PACKAGE PAYMENTS
============================================================ */
export const addPackagePayment = (payment) => api.post(`/package-payments`, payment);
export const getPackagePayments = () => api.get(`/package-payments`);

/* ============================================================
   🎉 EVENTS
============================================================ */
export const getEvents = () => api.get(`/events`);
export const getEventById = (id) => api.get(`/events/${id}`);
export const addEvent = (event) => api.post(`/events`, event);

/* ============================================================
   🎟️ EVENT BOOKINGS
============================================================ */
export const addEventBooking = (booking) => api.post(`/event-bookings`, booking);
export const getEventBookings = () => api.get(`/event-bookings`);
export const deleteEventBooking = (id) => api.delete(`/event-bookings/${id}`);

/* ============================================================
   🍽️ DINING
============================================================ */
export const getDining = () => api.get(`/dining`);
export const addDining = (restaurant) => api.post(`/dining`, restaurant);

/* ============================================================
   🍴 DINING RESERVATIONS
============================================================ */
export const addDiningReservation = (reservation) =>
  api.post(`/dining-reservations`, reservation);
export const getDiningReservations = () => api.get(`/dining-reservations`);

/* ============================================================
   🏨 STAY BOOKINGS
============================================================ */
export const addStayBooking = (booking) => api.post(`/stay-bookings`, booking);
export const getStayBookings = () => api.get(`/stay-bookings`);
export const deleteStayBooking = (id) => api.delete(`/stay-bookings/${id}`);

/* ============================================================
   🚗 TRANSPORT
============================================================ */
export const getTransport = () => api.get(`/transport`);
export const addTransport = (transport) => api.post(`/transport`, transport);
export const deleteTransport = (id) => api.delete(`/transport/${id}`);

/* ============================================================
   🚙 TRANSPORT BOOKINGS
============================================================ */
export const addTransportBooking = (booking) => api.post(`/transport-bookings`, booking);
export const getTransportBookings = () => api.get(`/transport-bookings`);
export const deleteTransportBooking = (id) => api.delete(`/transport-bookings/${id}`);

/* ============================================================
   🤖 AI TRAVEL COMPANION (Wanderly Genie)
============================================================ */
/**
 * 🧠 Connect to AI Travel Companion
 * @param {Array} messages - Chat history [{ role: "user"|"assistant"|"system", content: string }]
 * @returns {Promise<{ reply: string }>} AI response text
 */
export const chatWithAI = async (messages) => {
  try {
    const res = await api.post(`/ai/chat`, {
      messages,
      temperature: 0.7,
    });
    return res.data;
  } catch (error) {
    console.error("🚨 AI Chat Error:", error.message);
    return {
      reply: "⚠️ AI server is taking a coffee break. Please try again shortly ☕",
      error: true,
    };
  }
};

/* ============================================================
   🧩 Default Export (optional grouped usage)
============================================================ */
export default {
  registerUser,
  loginUser,
  getUsers,
  getUserById,
  updateUser,
  deleteUser,
  sendOtp,
  verifyOtp,
  getFlights,
  getFlightById,
  addFlight,
  updateFlight,
  deleteFlight,
  addFlightBooking,
  getFlightBookings,
  deleteFlightBooking,
  getPackages,
  getPackageById,
  addPackage,
  updatePackage,
  deletePackage,
  addPackageBooking,
  getPackageBookings,
  deletePackageBooking,
  addPayment,
  getPayments,
  addPackagePayment,
  getPackagePayments,
  getEvents,
  getEventById,
  addEvent,
  addEventBooking,
  getEventBookings,
  deleteEventBooking,
  getDining,
  addDining,
  addDiningReservation,
  getDiningReservations,
  addStayBooking,
  getStayBookings,
  deleteStayBooking,
  getTransport,
  addTransport,
  deleteTransport,
  addTransportBooking,
  getTransportBookings,
  deleteTransportBooking,
  chatWithAI,
};
