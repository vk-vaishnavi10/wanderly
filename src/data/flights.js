import indigo from "../images/flights/indigo.jpg";
import airindia from "../images/flights/airindia.jpg";
import vistara from "../images/flights/vistara.jpg";
import spicejet from "../images/flights/spicejet.jpg";

const flights = [
  {
    id: 1,
    airline: "IndiGo",
    from: "Mumbai",
    to: "Delhi",
    price: "₹4,500",
    duration: "2h 15m",
    image: indigo,
    stops: [
      { city: "Jaipur", airport: "JAI", delay: "30m" }
    ]
  },
  {
    id: 2,
    airline: "Air India",
    from: "Bengaluru",
    to: "Kolkata",
    price: "₹5,200",
    duration: "2h 30m",
    image: airindia,
    stops: [
      { city: "Hyderabad", airport: "HYD", delay: "20m" }
    ]
  },
  {
    id: 3,
    airline: "Vistara",
    from: "Delhi",
    to: "Hyderabad",
    price: "₹6,000",
    duration: "2h",
    image: vistara,
    stops: [
      { city: "Nagpur", airport: "NAG", delay: "25m" }
    ]
  },
  {
    id: 4,
    airline: "SpiceJet",
    from: "Chennai",
    to: "Goa",
    price: "₹3,800",
    duration: "1h 45m",
    image: spicejet,
    stops: [
      { city: "Pune", airport: "PNQ", delay: "15m" }
    ]
  },
  {
    id: 5,
    airline: "IndiGo",
    from: "Ahmedabad",
    to: "Pune",
    price: "₹3,200",
    duration: "1h 20m",
    image: indigo,
    stops: [
      { city: "Mumbai", airport: "BOM", delay: "10m" }
    ]
  },
  {
    id: 6,
    airline: "Air India",
    from: "Kolkata",
    to: "Goa",
    price: "₹6,500",
    duration: "3h 10m",
    image: airindia,
    stops: [
      { city: "Bengaluru", airport: "BLR", delay: "35m" }
    ]
  },
  {
    id: 7,
    airline: "Vistara",
    from: "Hyderabad",
    to: "Chennai",
    price: "₹4,000",
    duration: "1h 25m",
    image: vistara,
    stops: [
      { city: "Bengaluru", airport: "BLR", delay: "20m" }
    ]
  },
  {
    id: 8,
    airline: "SpiceJet",
    from: "Delhi",
    to: "Jaipur",
    price: "₹2,500",
    duration: "1h",
    image: spicejet,
    stops: [
      { city: "Agra", airport: "AGR", delay: "15m" }
    ]
  },
  {
    id: 9,
    airline: "IndiGo",
    from: "Pune",
    to: "Hyderabad",
    price: "₹3,000",
    duration: "1h 15m",
    image: indigo,
    stops: [
      { city: "Nagpur", airport: "NAG", delay: "25m" }
    ]
  },
  {
    id: 10,
    airline: "Air India",
    from: "Goa",
    to: "Mumbai",
    price: "₹2,800",
    duration: "1h 10m",
    image: airindia,
    stops: [
      { city: "Pune", airport: "PNQ", delay: "15m" }
    ]
  }
];

export default flights;

