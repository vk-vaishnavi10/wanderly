import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import { addStayBooking } from "../services/api";
import "./stays.css";
import oberoi from "../images/oberoi.jpg";
import tajlake from "../images/tajlake.jpg";
import leela from "../images/leela.jpg";
import radisson from "../images/radisson.jpg";

const GOOGLE_MAPS_KEY = "AIzaSyDRl5C_XMg9R6H1YGmG6V0ubT8ZyqHSdWA";

const hotelsData = [
  {
    id: 1,
    name: "The Oberoi, Mumbai",
    city: "mumbai",
    location: "Mumbai, Maharashtra",
    price: "₹12,500/night",
    rating: 5,
    image: oberoi,
    phone: "+91 22 6632 5757",
    email: "reservations@oberoi.com",
    attractions: ["Gateway of India", "Marine Drive", "Elephanta Caves"],
    desc: "A luxurious 5-star hotel overlooking the Arabian Sea, offering world-class dining, elegant rooms, and breathtaking sea views."
  },
  {
    id: 2,
    name: "Taj Mahal Palace",
    city: "mumbai",
    location: "Mumbai, Maharashtra",
    price: "₹18,000/night",
    rating: 5,
    image: tajlake,
    phone: "+91 22 6665 3366",
    email: "taj.reservations@tajhotels.com",
    attractions: ["Colaba Causeway", "Crawford Market", "Girgaum Chowpatty"],
    desc: "An iconic heritage hotel that combines Indian tradition with modern luxury, located by the famous Gateway of India."
  },
  {
    id: 3,
    name: "The Leela Palace",
    city: "bengaluru",
    location: "Bengaluru, Karnataka",
    price: "₹10,000/night",
    rating: 4,
    image: leela,
    phone: "+91 80 2521 1234",
    email: "reservations.blr@theleela.com",
    attractions: ["Cubbon Park", "Bangalore Palace", "Lalbagh Garden"],
    desc: "A royal experience blending traditional Indian architecture with modern amenities, surrounded by lush greenery."
  },
  {
    id: 4,
    name: "Radisson Blu Resort Goa",
    city: "goa",
    location: "Goa",
    price: "₹7,500/night",
    rating: 4,
    image: radisson,
    phone: "+91 832 880 2000",
    email: "reservations@radissonblu.com",
    attractions: ["Baga Beach", "Dudhsagar Falls", "Fort Aguada"],
    desc: "A beachside paradise with a perfect blend of modern comfort and Goan charm. Ideal for relaxation and family getaways."
  },
  {
    id: 5,
    name: "JW Marriott Juhu",
    city: "mumbai",
    location: "Juhu, Mumbai, Maharashtra",
    price: "₹14,000/night",
    rating: 5,
    image: "https://dynamic-media-cdn.tripadvisor.com/media/photo-o/1b/85/52/bd/jw-marriott-mumbai-juhu.jpg",
    phone: "+91 22 6693 3000",
    email: "reservations.juhu@marriott.com",
    attractions: ["Juhu Beach", "ISKCON Temple", "Versova Beach"],
    desc: "A luxurious beachfront resort offering serene sea views, fine dining, and a relaxing spa experience."
  },
  {
    id: 6,
    name: "ITC Grand Chola",
    city: "chennai",
    location: "Chennai, Tamil Nadu",
    price: "₹11,500/night",
    rating: 5,
    image: "https://dynamic-media-cdn.tripadvisor.com/media/photo-o/1a/70/09/06/itc-grand-chola-chennai.jpg",
    phone: "+91 44 2220 0000",
    email: "reservations.chola@itchotels.in",
    attractions: ["Marina Beach", "Phoenix Market City", "Kapaleeshwar Temple"],
    desc: "An architectural marvel in Chennai offering royal luxury and signature ITC hospitality."
  },
  {
    id: 7,
    name: "The Lalit Jaipur",
    city: "jaipur",
    location: "Jaipur, Rajasthan",
    price: "₹9,000/night",
    rating: 4,
    image: "https://cf.bstatic.com/xdata/images/hotel/max1024x768/333796438.jpg",
    phone: "+91 141 664 7777",
    email: "reservations.jaipur@thelalit.com",
    attractions: ["Hawa Mahal", "City Palace", "Amber Fort"],
    desc: "A royal blend of Rajasthani architecture and contemporary comfort, perfect for heritage explorers."
  },
  {
    id: 8,
    name: "Novotel Hyderabad Convention Centre",
    city: "hyderabad",
    location: "Hyderabad, Telangana",
    price: "₹8,000/night",
    rating: 4,
    image: "https://cf.bstatic.com/xdata/images/hotel/max1024x768/24076775.jpg",
    phone: "+91 40 6682 4422",
    email: "reservations.hyd@novotel.com",
    attractions: ["Charminar", "Golconda Fort", "Hussain Sagar"],
    desc: "A business and leisure paradise offering modern comfort near the HITEC City area."
  },
  {
    id: 9,
    name: "Windflower Resort and Spa",
    city: "mysuru",
    location: "Mysuru, Karnataka",
    price: "₹6,500/night",
    rating: 4,
    image: "https://cf.bstatic.com/xdata/images/hotel/max1024x768/134185837.jpg",
    phone: "+91 821 252 2500",
    email: "reservations@thewindflower.com",
    attractions: ["Mysore Palace", "Chamundi Hill", "Brindavan Gardens"],
    desc: "A tranquil escape nestled in Mysuru, ideal for wellness retreats and peaceful holidays."
  }
];


export default function StayDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const hotel = hotelsData.find((h) => h.id === parseInt(id));

  const [booking, setBooking] = useState({
    date: "",
    nights: 1,
    guests: 2,
  });

  if (!hotel) {
    return <h2 className="text-center text-warning mt-5">Hotel not found!</h2>;
  }

  const handleBookStay = async () => {
    if (!booking.date) {
      Swal.fire("⚠️ Missing Info", "Please select your check-in date.", "warning");
      return;
    }

    try {
      const payload = {
        user: { id: 1 }, // test user for now
        stay: { id: parseInt(id) }, // ✅ corrected key
        checkInDate: booking.date,
        nights: parseInt(booking.nights),
        guests: parseInt(booking.guests),
      };
      
      

      await addStayBooking(payload);

      Swal.fire("🎉 Booking Confirmed!", "Your stay is successfully booked!", "success")
        .then(() => navigate("/stays"));
    } catch (error) {
      console.error("Booking failed:", error);
      Swal.fire("❌ Error", "Unable to complete booking. Try again later!", "error");
    }
  };

  return (
    <div className="container py-5 text-light">
      <div className="card bg-dark border-warning shadow-lg">
        <img
          src={hotel.image}
          alt={hotel.name}
          className="card-img-top rounded-3"
          style={{ height: "400px", objectFit: "cover" }}
        />
        <div className="card-body">
          <h2 className="text-warning fw-bold">{hotel.name}</h2>
          <p>📍 {hotel.location}</p>
          <p>💰 {hotel.price}</p>
          <p>📞 {hotel.phone}</p>
          <p>📧 {hotel.email}</p>
          <p>{"⭐".repeat(hotel.rating)}</p>

          <div className="mt-3">
            <label className="text-warning">🗓 Select Check-in Date</label>
            <input
              type="date"
              className="form-control bg-dark text-light border-warning"
              value={booking.date}
              onChange={(e) => setBooking({ ...booking, date: e.target.value })}
            />
          </div>

          <div className="mt-3">
            <label className="text-warning">🏨 Number of Nights</label>
            <input
              type="number"
              min="1"
              className="form-control bg-dark text-light border-warning"
              value={booking.nights}
              onChange={(e) => setBooking({ ...booking, nights: e.target.value })}
            />
          </div>

          <div className="mt-3">
            <label className="text-warning">👥 Number of Guests</label>
            <input
              type="number"
              min="1"
              className="form-control bg-dark text-light border-warning"
              value={booking.guests}
              onChange={(e) => setBooking({ ...booking, guests: e.target.value })}
            />
          </div>

          <button
            className="btn btn-warning fw-bold w-100 mt-4"
            onClick={handleBookStay}
          >
            Book Your Stay ✨
          </button>
        </div>
      </div>
    </div>
  );
}
