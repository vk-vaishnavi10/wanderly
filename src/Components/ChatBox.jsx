// src/components/ChatBox.jsx
import React, {
  useState,
  useRef,
  forwardRef,
  useImperativeHandle,
  useEffect,
} from "react";
import { chatWithAI } from "../services/api"; // your API wrapper (already provided)
import "./ChatBox.css";

/**
 * Wanderly Genie — All-in-one upgraded ChatBox.jsx
 *
 * Features included:
 * - Weather cards (Open-Meteo + Nominatim)
 * - Stays fetch (/api/stays)
 * - Flights search demo fetch (/api/flights or local fallback)
 * - AI chat (chatWithAI)
 * - Itinerary generator (AI first, fallback deterministic)
 * - Voice input (SpeechRecognition) & Speech output
 * - Map preview (OpenStreetMap embed)
 * - 3D destination cards & dynamic categories
 * - Suggestions, loading states, robust fallbacks
 *
 * NOTE:
 * - chatWithAI must return { reply } or { content }.
 * - Backend endpoints used:
 *    GET /api/stays
 *    GET /api/flights?query=...
 *    GET /api/flights/:id
 *  If your endpoints differ, replace URLs below.
 */

const SpeechRec =
  (typeof window !== "undefined" &&
    (window.SpeechRecognition || window.webkitSpeechRecognition)) ||
  null;

// small utility: speak text
const speakText = (text) => {
  try {
    if (!("speechSynthesis" in window)) return;
    window.speechSynthesis.cancel();
    const ut = new SpeechSynthesisUtterance(text);
    ut.lang = "en-US";
    ut.rate = 1;
    ut.pitch = 1;
    // pick a friendly voice if available
    const voices = window.speechSynthesis.getVoices();
    if (voices && voices.length) {
      const pref = voices.find((v) =>
        /female|zira|karen|samantha|google/i.test(v.name)
      );
      if (pref) ut.voice = pref;
    }
    window.speechSynthesis.speak(ut);
  } catch (err) {
    // swallow
    // console.warn("speech failed:", err);
  }
};

const generateItineraryFallback = (destination = "this place", days = 3) => {
  const d = Number(days) || 3;
  const base = [
    `Arrive and settle in. Walk the main street, try a local cafe, and relax.`,
    `Full-day highlight: visit the top landmark, enjoy a guided tour, and sunset viewpoint.`,
    `Local immersion: market visit, food tasting, and a leisure walk.`
  ];
  const extra = [
    `Optional day trip to a nearby scenic spot.`,
    `Hidden gems & offbeat neighborhoods exploration.`,
    `Adventure or wellness day: trek / spa / water activities.`,
    `Slow goodbye: relaxed breakfast, souvenirs, depart.`,
  ];
  let result = [];
  for (let i = 0; i < Math.min(d, base.length); i++) {
    result.push(`Day ${i + 1}: ${base[i]}`);
  }
  if (d > base.length) {
    for (let i = 0; i < d - base.length; i++) {
      result.push(`Day ${base.length + i + 1}: ${extra[i % extra.length]}`);
    }
  }
  return result;
};

// PRESETS for quick cards
const PRESETS = {
  cool: [
    { title: "Manali", meta: "Snow peaks & cafés", img: "https://images.unsplash.com/photo-1562062569-8a9a3d1a5c22?q=80&w=800", badge: "❄️ Cool", query: "Manali" },
    { title: "Coorg", meta: "Coffee hills & mist", img: "https://images.unsplash.com/photo-1593697820934-71b69c8d1b57?q=80&w=800", badge: "🌿 Nature", query: "Coorg" },
    { title: "Ooty", meta: "Lakes & toy train", img: "https://images.unsplash.com/photo-1543997385-22fe6f9c9020?q=80&w=800", badge: "🚂 Scenic", query: "Ooty" },
  ],
  beach: [
    { title: "Goa", meta: "Beaches & parties", img: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?q=80&w=800", badge: "🏖️ Beach", query: "Goa" },
    { title: "Andaman", meta: "Crystal waters & coral", img: "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?q=80&w=800", badge: "🌊 Island", query: "Andaman" },
  ],
  adventure: [
    { title: "Rishikesh", meta: "River rafting & yoga", img: "https://images.unsplash.com/photo-1526772662000-3f88f10405ff?q=80&w=800", badge: "🧗 Adventure", query: "Rishikesh" },
    { title: "Leh-Ladakh", meta: "Trek & high passes", img: "https://images.unsplash.com/photo-1518684079-5da0b6b0a4f3?q=80&w=800", badge: "🏔 Adventure", query: "Leh" },
  ],
};

const DestCards = ({ items = [], onCardClick }) => {
  if (!items || !items.length) return null;
  return (
    <div className="dest-cards">
      {items.map((it, i) => (
        <div key={i} className="dest-card-3d" onClick={() => onCardClick(it.query || it.title)}>
          <div className="dest-card-inner">
            <div className="dest-img" style={{ backgroundImage: `url(${it.img})` }} />
            <div className="dest-info">
              <div className="dest-badge">{it.badge}</div>
              <div className="dest-title">{it.title}</div>
              <div className="dest-meta">{it.meta}</div>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onCardClick(it.query || it.title);
                }}
                className="dest-cta"
              >
                Explore →
              </button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

const MapPreview = ({ q }) => {
  if (!q) return null;
  const url = `https://www.openstreetmap.org/export/embed.html?search=${encodeURIComponent(q)}&layer=mapnik`;
  return (
    <div className="map-preview">
      <iframe title={`map-${q}`} src={url} loading="lazy" referrerPolicy="no-referrer" />
      <a className="map-link" href={`https://www.openstreetmap.org/search?query=${encodeURIComponent(q)}`} target="_blank" rel="noreferrer">Open in OpenStreetMap</a>
    </div>
  );
};

const ChatBox = forwardRef(({ onToggle }, ref) => {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState([
    {
      sender: "bot",
      text: "🌍 Hi — I'm your Wanderly Genie ✨ — I can plan trips, fetch hotels, flights, weather, and build itineraries. Try 'Plan a 3 day trip to Goa' or tap a suggestion!",
      suggestions: ["Plan a Goa trip for 5 days", "Weather in Manali", "Cool places"],
      cards: PRESETS.cool,
    },
  ]);
  const [input, setInput] = useState("");
  const [typing, setTyping] = useState(false);
  const [listening, setListening] = useState(false);
  const recognizerRef = useRef(null);
  const endRef = useRef(null);
  const [loadingActions, setLoadingActions] = useState({}); // map of action -> boolean

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, typing]);

  useImperativeHandle(ref, () => ({
    triggerMessage: (t) => {
      setOpen(true);
      onToggle?.(true);
      setTimeout(() => sendMessage(t), 200);
    },
  }));

  // Voice functions
  const startListening = () => {
    if (!SpeechRec) {
      alert("SpeechRecognition not supported in this browser.");
      return;
    }
    try {
      const rec = new SpeechRec();
      rec.continuous = false;
      rec.interimResults = false;
      rec.lang = "en-US";
      rec.onstart = () => setListening(true);
      rec.onresult = (e) => {
        const text = e.results[0][0].transcript;
        setListening(false);
        rec.stop();
        setInput(text);
        sendMessage(text);
      };
      rec.onerror = () => {
        setListening(false);
        try { rec.stop(); } catch {}
      };
      rec.onend = () => setListening(false);
      rec.start();
      recognizerRef.current = rec;
    } catch (err) {
      console.warn("voice error", err);
      setListening(false);
    }
  };

  const stopListening = () => {
    try {
      recognizerRef.current?.stop();
    } catch {}
    setListening(false);
  };

  // helper: add message
  const pushMessage = (m) => setMessages((prev) => [...prev, m]);

  // fetch weather via Nominatim + Open-Meteo
  const fetchWeather = async (city) => {
    try {
      setLoadingActions((s) => ({ ...s, weather: true }));
      const geo = await fetch(`https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(city)}&format=json&limit=1`).then(r => r.json());
      if (!geo || !geo.length) {
        return `⚠️ Couldn't find "${city}" for weather.`;
      }
      const { lat, lon } = geo[0];
      const w = await fetch(`https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current_weather=true&timezone=auto`).then(r => r.json());
      setLoadingActions((s) => ({ ...s, weather: false }));
      if (!w?.current_weather) return "⚠️ Weather data unavailable.";
      const cw = w.current_weather;
      return `🌤 Weather in ${city}: ${cw.temperature}°C, wind ${cw.windspeed} km/h, direction ${cw.winddirection}°.`;
    } catch (err) {
      setLoadingActions((s) => ({ ...s, weather: false }));
      return "⚠️ Unable to fetch weather right now.";
    }
  };

  // fetch stays from backend
  const fetchStays = async (query = "") => {
    try {
      setLoadingActions((s) => ({ ...s, stays: true }));
      const url = query ? `/api/stays?search=${encodeURIComponent(query)}` : `/api/stays`;
      const res = await fetch(url).then(r => r.json());
      setLoadingActions((s) => ({ ...s, stays: false }));
      return Array.isArray(res) ? res : (res?.data || []);
    } catch (err) {
      setLoadingActions((s) => ({ ...s, stays: false }));
      return [];
    }
  };

  // fetch flights (search-ish)
  const fetchFlights = async (query = "") => {
    try {
      setLoadingActions((s) => ({ ...s, flights: true }));
      const url = query ? `/api/flights?search=${encodeURIComponent(query)}` : `/api/flights`;
      const res = await fetch(url).then(r => {
        if (!r.ok) return r.json().catch(() => null);
        return r.json();
      });
      setLoadingActions((s) => ({ ...s, flights: false }));
      return Array.isArray(res) ? res : (res?.data || []);
    } catch (err) {
      setLoadingActions((s) => ({ ...s, flights: false }));
      return [];
    }
  };

  // core sendMessage
  const sendMessage = async (rawText) => {
    const text = (rawText || "").trim();
    if (!text) return;
    // push user message
    pushMessage({ sender: "user", text });
    setInput("");
    setTyping(true);

    const lower = text.toLowerCase();

    // Quick local intents
    // 1) weather
    if (lower.startsWith("weather") || lower.includes("weather in")) {
      // parse "in"
      const city = (text.split("in")[1] || text.split("weather")[1] || "").trim() || "your area";
      const w = await fetchWeather(city);
      pushMessage({ sender: "bot", text: w });
      speakText(w);
      setTyping(false);
      return;
    }

    // 2) show stays / hotels
    if (lower.includes("hotel") || lower.includes("stay") || lower.includes("hotels")) {
      // allow "hotels in coorg"
      const q = (text.match(/in\s+([A-Za-z\s]+)/i) || [null, ""])[1]?.trim() || "";
      const stays = await fetchStays(q);
      if (stays.length) {
        // transform stays to cards
        const cards = stays.slice(0, 6).map(s => ({
          title: s.name || s.title || "Stay",
          meta: s.location || s.city || `${s.stars || ""} ${s.type || ""}`,
          img: s.image || s.photo || "/assets/placeholder-hotel.jpg",
          badge: `🏨 ${s.stars || ""}`.trim(),
          query: `Book stay ${s.id || s.name}`,
          raw: s,
        }));
        pushMessage({ sender: "bot", text: `Found ${stays.length} stays${q ? " in " + q : ""}.`, cards });
        speakText(`I found ${stays.length} stays${q ? " in " + q : ""}.`);
      } else {
        pushMessage({ sender: "bot", text: `Sorry — couldn't find stays right now. Try "stays in Goa".` });
        speakText("Sorry, no stays found.");
      }
      setTyping(false);
      return;
    }

    // 3) flights search
    if (lower.includes("flight") || lower.includes("flights") || lower.includes("fly")) {
      const q = (text.match(/to\s+([A-Za-z\s]+)/i) || [null, ""])[1] || "";
      const flights = await fetchFlights(q);
      if (flights.length) {
        const cards = flights.slice(0, 6).map(f => ({
          title: f.airline || f.airlineName || "Flight",
          meta: `${f.from || f.src} → ${f.to || f.dest} • ${f.duration || ""}`,
          img: f.image || "/assets/flight.png",
          badge: `✈️ ${f.class || "Economy"}`,
          query: `Book flight ${f.id || f.flightNo}`,
          raw: f,
        }));
        pushMessage({ sender: "bot", text: `I found ${flights.length} flights${q ? " to " + q : ""}.`, cards });
        speakText(`I found ${flights.length} flights${q ? " to " + q : ""}.`);
      } else {
        pushMessage({ sender: "bot", text: `Couldn't fetch flights right now. You can try "flights to Goa".` });
        speakText("Couldn't fetch flights.");
      }
      setTyping(false);
      return;
    }

    // 4) itinerary / plan
    if (/plan|itinerary|itinerar/i.test(lower)) {
      // parse days if possible
      let days = 3;
      const daysMatch = text.match(/(\d+)\s+(day|days)/i);
      if (daysMatch) days = Number(daysMatch[1]);
      // parse destination
      const destMatch = text.match(/(?:to|in)\s+([A-Za-z\s]+)/i);
      const dest = (destMatch && destMatch[1]) ? destMatch[1].trim() : text.split(" ")[1] || "the place";
      // try AI
      try {
        const chatHistory = [
          { role: "system", content: "You are Wanderly Genie - a friendly travel planner that gives concise day-by-day itineraries." },
          { role: "user", content: text },
        ];
        const aiResp = await chatWithAI(chatHistory);
        const reply = aiResp?.reply || aiResp?.content;
        if (reply) {
          pushMessage({ sender: "bot", text: reply });
          speakText(reply);
          setTyping(false);
          return;
        }
      } catch (err) {
        // fallback
        const plan = generateItineraryFallback(dest, days);
        const reply = `🧳 ${days}-day plan for ${dest}:\n\n${plan.map((p, i) => `${i + 1}. ${p}`).join("\n\n")}`;
        pushMessage({ sender: "bot", text: reply });
        speakText(reply);
        setTyping(false);
        return;
      }
    }

    // 5) category cards (cool / beach / adventure / heritage)
    if (/(cool|beach|advent|heritage|hidden|gems|scenic)/i.test(lower)) {
      const cat = /beach/i.test(lower) ? "beach" : /advent/i.test(lower) ? "adventure" : /heritage/i.test(lower) ? "adventure" : "cool";
      const cards = PRESETS[cat] || PRESETS.cool;
      pushMessage({ sender: "bot", text: "Here are some suggestions — tap any card to explore.", cards });
      speakText("Here are suggestions, tap a card to explore.");
      setTyping(false);
      return;
    }

    // Default: ask AI for a rich response
    try {
      // Build a compact chat history of last messages
      const history = [
        { role: "system", content: "You are Wanderly Genie — a helpful, friendly travel assistant. Provide suggestions, cards, and map queries where appropriate." },
        ...messages.slice(-8).map(m => ({ role: m.sender === "bot" ? "assistant" : "user", content: m.text })),
        { role: "user", content: text },
      ];

      const aiResp = await chatWithAI(history);
      const reply = aiResp?.reply || aiResp?.content || (typeof aiResp === "string" ? aiResp : null);

      if (reply) {
        // attempt to parse locations mentioned by AI to show a map
        const placeMatch = reply.match(/(?:in|for)\s+([A-Za-z\s]{2,40})/i);
        const mapQuery = placeMatch ? placeMatch[1].trim() : null;

        // attempt to parse suggestions or lists from AI - naive detection for "Recommended stays" etc.
        // We'll just pass the AI text and optionally show a map
        pushMessage({ sender: "bot", text: reply, mapQuery });
        speakText(reply);
        setTyping(false);
        return;
      } else {
        throw new Error("AI returned empty");
      }
    } catch (err) {
      // Final fallback: helpful suggestion
      const fallback = `⚠️ AI unavailable. Try: "Plan a 3 day trip to Goa", "Weather in Manali", "Hotels in Coorg", or "Flights to Delhi".`;
      pushMessage({ sender: "bot", text: fallback });
      speakText(fallback);
      setTyping(false);
      return;
    }
  };

  // Handler when clicking a card (query)
  const handleCardClick = (query) => {
    // if query looks like "Book stay {id}" we could open a page - but here we just send message text
    sendMessage(query);
  };

  // small UI to present raw object (stay/flight) when received in a card click - if `raw` exists
  const handleCardAction = (raw) => {
    // if stay, open new tab to stay details; if flight, open flights/book
    if (!raw) return;
    if (raw.id && raw.name) {
      // open stay
      if (raw.id) window.open(`/stays/${raw.id}`, "_self");
    } else if (raw.id && raw.airline) {
      window.open(`/flights/book/${raw.id}`, "_self");
    } else {
      // fallback: display JSON
      pushMessage({ sender: "bot", text: `Details:\n${JSON.stringify(raw, null, 2)}` });
    }
  };

  return (
    <div className="chatbox-container">
      {!open && (
        <button
          className="chatbox-toggle"
          title="Open Wanderly Genie"
          onClick={() => {
            setOpen(true);
            onToggle?.(true);
          }}
        >
          💬
        </button>
      )}

      {open && (
        <div className="chatbox-window" role="dialog" aria-label="Wanderly Genie">
          <div className="chatbox-header">
            <div className="header-left">
              <span className="genie-icon">🌟</span>
              <span className="genie-title">Wanderly Genie</span>
            </div>
            <div className="header-controls">
              <button
                title={listening ? "Stop voice input" : "Start voice input"}
                className={`mic-btn ${listening ? "listening" : ""}`}
                onClick={() => (listening ? stopListening() : startListening())}
              >
                {listening ? "🎙️" : "🎤"}
              </button>
              <button
                title="Reset chat"
                className="reset-btn"
                onClick={() => {
                  setMessages([
                    {
                      sender: "bot",
                      text: "✨ Chat reset! I'm your Wanderly Genie again. Try asking: 'Plan a Goa trip' or 'Weather in Manali'.",
                      suggestions: ["Plan a Goa trip for 5 days", "Weather in Manali", "Cool places"],
                      cards: PRESETS.cool,
                    },
                  ]);
                }}
              >
                🔁
              </button>
              <button title="Close" className="close-btn" onClick={() => setOpen(false)}>✖</button>
            </div>
          </div>

          <div className="chatbox-messages" aria-live="polite">
            {messages.map((m, i) => (
              <div key={i} className={`chat-row ${m.sender}`}>
                <div className={`chat-msg ${m.sender}`}>
                  <div style={{ whiteSpace: "pre-line" }}>{m.text}</div>

                  {/* Map */}
                  {m.mapQuery && <MapPreview q={m.mapQuery} />}

                  {/* Cards */}
                  {m.cards && m.cards.length > 0 && (
                    <div style={{ marginTop: 10 }}>
                      <DestCards items={m.cards} onCardClick={(q) => handleCardClick(q)} />
                    </div>
                  )}

                  {/* Suggestions */}
                  {m.suggestions && m.suggestions.length > 0 && (
                    <div className="chat-suggestions">
                      {m.suggestions.map((s, idx) => (
                        <button
                          key={idx}
                          onClick={() => sendMessage(s)}
                        >
                          {s}
                        </button>
                      ))}
                    </div>
                  )}

                </div>
              </div>
            ))}

            {typing && (
              <div className="chat-row bot">
                <div className="chat-msg bot typing-indicator" aria-hidden>
                  <span />
                  <span />
                  <span />
                </div>
              </div>
            )}

            <div ref={endRef} />
          </div>

          <div className="chatbox-input">
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && sendMessage(input)}
              placeholder="Try: 'Plan a 3 day trip to Goa' or 'Hotels in Coorg'"
            />
            <button onClick={() => sendMessage(input)} title="Send">➤</button>
          </div>
        </div>
      )}
    </div>
  );
});

export default ChatBox;
