// 🌏 Local image imports
import aaImg from "../images/aa.webp";         // Angkor Wat
import acImg from "../images/ac.jpg";          // Acropolis of Athens
import bkImg from "../images/bk.jpeg";         // Burj Khalifa
import cbImg from "../images/cb.jpeg";         // Christ the Redeemer
import ccImg from "../images/cc.jpg";          // Colosseum
import greatImg from "../images/great.jpg";    // Great Wall of China
import outImg from "../images/py.jpg";       // Outstation placeholder (Pyramids)
import petraImg from "../images/petra.jpeg";   // Petra
import sydImg from "../images/syd.jpg";        // Sydney Opera House
import meImg from "../images/me.jpg";          // Mount Everest
import mfImg from "../images/mf.jpeg";         // Mount Fuji
import mkImg from "../images/mk.webp";         // Mount Kilimanjaro
import ssImg from "../images/ss.webp";         // Statue of Liberty
import pyImg from "../images/py.jpg";
import trImg from "../images/travel2.jpg";
import efImg from "../images/eiff.jpg";
import chinImg from "../images/chin.jpg";
import mmImg from "../images/mm.avif";
import stImg from "../images/st.avif";

// 🏞️ Attraction Data
const attractions = [
  {
    id: "eiffel-tower",
    name: "Eiffel Tower",
    location: "Paris, France",
    description:
      "An iconic symbol of France and one of the most visited landmarks in the world.",
    image: efImg,
  },
  {
    id: "taj-mahal",
    name: "Taj Mahal",
    location: "Agra, India",
    description:
      "A UNESCO World Heritage Site and symbol of love, built in the 17th century.",
    image: trImg,
  },
  {
    id: "great-wall",
    name: "Great Wall of China",
    location: "China",
    description:
      "One of the seven wonders of the world, stretching over 21,000 km.",
    image: greatImg,
  },
  {
    id: "machu-picchu",
    name: "Machu Picchu",
    location: "Peru",
    description:
      "An Incan citadel set high in the Andes Mountains, a UNESCO World Heritage Site.",
    image: mmImg,
  },
  {
    id: "colosseum",
    name: "Colosseum",
    location: "Rome, Italy",
    description:
      "An oval amphitheatre in Rome, one of the greatest works of Roman architecture.",
    image: ccImg,
  },
  {
    id: "petra",
    name: "Petra",
    location: "Jordan",
    description:
      "The Rose City carved into pink sandstone cliffs, a UNESCO World Heritage site.",
    image: petraImg,
  },
  {
    id: "christ-redeemer",
    name: "Christ the Redeemer",
    location: "Rio de Janeiro, Brazil",
    description:
      "A massive statue of Jesus Christ overlooking Rio, one of the New Seven Wonders.",
    image: cbImg,
  },
  {
    id: "angkor-wat",
    name: "Angkor Wat",
    location: "Siem Reap, Cambodia",
    description:
      "The largest religious monument in the world, originally built as a Hindu temple.",
    image: aaImg,
  },
  {
    id: "stonehenge",
    name: "Stonehenge",
    location: "Wiltshire, England",
    description:
      "A prehistoric monument of standing stones, built 3000–2000 BC.",
    image: ssImg,
  },
  {
    id: "pyramids-giza",
    name: "Pyramids of Giza",
    location: "Cairo, Egypt",
    description:
      "The only surviving wonder of the Ancient World, built as tombs for pharaohs.",
    image: pyImg,
  },
  {
    id: "acropolis-athens",
    name: "Acropolis of Athens",
    location: "Athens, Greece",
    description:
      "Ancient citadel on a rocky outcrop above Athens, containing the Parthenon.",
    image: acImg,
  },
  {
    id: "chichen-itza",
    name: "Chichen Itza",
    location: "Yucatán, Mexico",
    description:
      "A large pre-Columbian city built by the Maya people, featuring the El Castillo pyramid.",
    image: chinImg,
  },
  {
    id: "mount-fuji",
    name: "Mount Fuji",
    location: "Honshu, Japan",
    description:
      "Japan’s highest mountain, a cultural icon and pilgrimage site.",
    image: mfImg,
  },
  {
    id: "sydney-opera-house",
    name: "Sydney Opera House",
    location: "Sydney, Australia",
    description:
      "An architectural masterpiece and one of the most iconic performing arts centers.",
    image: sydImg,
  },
  {
    id: "statue-liberty",
    name: "Statue of Liberty",
    location: "New York, USA",
    description:
      "A gift from France, symbolizing freedom and democracy.",
    image: stImg,
  },
  {
    id: "mount-kilimanjaro",
    name: "Mount Kilimanjaro",
    location: "Tanzania",
    description:
      "Africa’s highest peak and a UNESCO natural World Heritage site.",
    image: mkImg,
  },
  {
    id: "everest",
    name: "Mount Everest",
    location: "Nepal/China",
    description:
      "The world’s highest mountain, part of the Himalayas.",
    image: meImg,
  },
  {
    id: "burj-khalifa",
    name: "Burj Khalifa",
    location: "Dubai, UAE",
    description:
      "The tallest building in the world, standing at 828m.",
    image: bkImg,
  },
];

export default attractions;
