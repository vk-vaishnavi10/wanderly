// src/components/ChatBox/ChatBox.jsx
import React, {
  useState,
  useRef,
  forwardRef,
  useImperativeHandle,
  useEffect,
} from "react";
import { chatWithAI } from "../../services/api"; // adjust if your services path differs
import "./ChatBox.css";
import BookingModal from "./BookingModal";
import SeatPicker from "./SeatPicker";
import ThemeToggle from "./ThemeToggle";
import { exportChatAsText, exportChatAsPrintable } from "./utils/exportChat";


/**
 * Wanderly Genie — All-in-one ChatBox
 *
 * Features:
 * - AI chat (via chatWithAI)
 * - Local quick intents: weather, stays, flights, itinerary
 * - Map preview (OpenStreetMap)
 * - 3D cards categories (cool, beach, adventure, heritage)
 * - Voice input / speech output
 * - Booking modal & simple seat picker hooks
 * - Export conversation (TXT / Print -> PDF via browser Print)
 *
 * Usage:
 * <ChatBox ref={chatRef} onToggle={(open) => ...} />
 */

const SpeechRec =
  (typeof window !== "undefined" &&
    (window.SpeechRecognition || window.webkitSpeechRecognition)) ||
  null;

// pick a friendly voice if available
const speakText = (text, speak = true) => {
  if (!speak || typeof window === "undefined" || !("speechSynthesis" in window))
    return;
  try {
    window.speechSynthesis.cancel();
    const ut = new SpeechSynthesisUtterance(text);
    ut.lang = "en-US";
    const voices = window.speechSynthesis.getVoices();
    const pref = voices.find((v) =>
      /female|zira|karen|samantha|google/i.test(v.name)
    );
    if (pref) ut.voice = pref;
    window.speechSynthesis.speak(ut);
  } catch (err) {
    // ignore
    // console.warn("speak failed", err);
  }
};

/* --------------------------
   Preset cards for quick picks
   -------------------------- */
const PRESETS = {
  cool: [
    {
      title: "Manali",
      meta: "Snow peaks & cosy cafés",
      img: "https://images.unsplash.com/photo-1562062569-8a9a3d1a5c22?q=80&w=800",
      badge: "❄️ Cool",
      query: "Best spots in Manali",
    },
    {
      title: "Coorg",
      meta: "Coffee hills & mist",
      img: "https://images.unsplash.com/photo-1593697820934-71b69c8d1b57?q=80&w=800",
      badge: "🌿 Nature",
      query: "Best spots in Coorg",
    },
    {
      title: "Ooty",
      meta: "Lakes & toy train",
      img: "https://images.unsplash.com/photo-1543997385-22fe6f9c9020?q=80&w=800",
      badge: "🚂 Scenic",
      query: "Best spots in Ooty",
    },
  ],
  beach: [
    {
      title: "Goa",
      meta: "Beaches & parties",
      img: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?q=80&w=800",
      badge: "🏖️ Beach",
      query: "Best beaches in Goa",
    },
    {
      title: "Andaman",
      meta: "Crystal waters & coral",
      img: "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?q=80&w=800",
      badge: "🌊 Island",
      query: "Best spots in Andaman",
    },
  ],
  adventure: [
    {
      title: "Rishikesh",
      meta: "River rafting & yoga",
      img: "https://images.unsplash.com/photo-1526772662000-3f88f10405ff?q=80&w=800",
      badge: "🧗 Adventure",
      query: "Adventure activities in Rishikesh",
    },
    {
      title: "Leh-Ladakh",
      meta: "Trek & high passes",
      img: "https://images.unsplash.com/photo-1518684079-5da0b6b0a4f3?q=80&w=800",
      badge: "🏔 Adventure",
      query: "Best routes in Leh Ladakh",
    },
  ],
  heritage: [
    {
      title: "Jaipur",
      meta: "Palaces & forts",
      img: "https://images.unsplash.com/photo-1505238680356-667803448bb6?q=80&w=800",
      badge: "🏰 Heritage",
      query: "Top heritage sites in Jaipur",
    },
    {
      title: "Varanasi",
      meta: "Ganga & ghats",
      img: "https://images.unsplash.com/photo-1549880338-65ddcdfd017b?q=80&w=800",
      badge: "🕉 Heritage",
      query: "Spiritual things to do in Varanasi",
    },
  ],
};

/* --------------------------
   Map preview component
   -------------------------- */
const MapPreview = ({ q }) => {
  if (!q) return null;
  const url = `https://www.openstreetmap.org/export/embed.html?search=${encodeURIComponent(
    q
  )}&layer=mapnik`;
  return (
    <div className="map-preview">
      <iframe
        title={`map-${q}`}
        src={url}
        loading="lazy"
        referrerPolicy="no-referrer"
      />
      <a
        className="map-link"
        href={`https://www.openstreetmap.org/search?query=${encodeURIComponent(q)}`}
        target="_blank"
        rel="noreferrer"
      >
        Open in OpenStreetMap
      </a>
    </div>
  );
};

/* --------------------------
   Dest cards UI
   -------------------------- */
const DestCards = ({ items = [], onCardClick }) => {
  if (!items || items.length === 0) return null;
  return (
    <div className="dest-cards">
      {items.map((it, idx) => (
        <div
          key={idx}
          className="dest-card-3d"
          onClick={() => onCardClick?.(it.query || it.title)}
          role="button"
        >
          <div className="dest-card-inner">
            <div
              className="dest-img"
              style={{ backgroundImage: `url(${it.img})` }}
              aria-hidden
            />
            <div className="dest-info">
              <div className="dest-badge">{it.badge}</div>
              <div className="dest-title">{it.title}</div>
              <div className="dest-meta">{it.meta}</div>
              <button
                className="dest-cta"
                onClick={(e) => {
                  e.stopPropagation();
                  onCardClick?.(it.query || it.title);
                }}
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

/* --------------------------
   Main ChatBox component
   -------------------------- */
const ChatBox = forwardRef(({ onToggle }, ref) => {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState([
    {
      sender: "bot",
      text:
        "🌍 Hi! I'm your Wanderly Genie ✨ — I can plan trips, show weather, fetch stays & flights, and build itineraries. Try 'Plan a 3 day trip to Goa' or tap a suggestion!",
      suggestions: ["Plan a Goa trip for 5 days", "Weather in Manali", "Cool places"],
      cards: PRESETS.cool,
    },
  ]);
  const [input, setInput] = useState("");
  const [typing, setTyping] = useState(false);
  const [listening, setListening] = useState(false);
  const [speakOn, setSpeakOn] = useState(false);
  const [showBooking, setShowBooking] = useState(false);
  const [bookingInfo, setBookingInfo] = useState(null);
  const recognitionRef = useRef(null);
  const endRef = useRef(null);
  const [seatPickerOpen, setSeatPickerOpen] = useState(false);
  const [lastCardRaw, setLastCardRaw] = useState(null); // placeholder for future raw object

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, typing]);

  useImperativeHandle(ref, () => ({
    triggerMessage: (t) => {
      setOpen(true);
      onToggle?.(true);
      setTimeout(() => sendMessage(t), 200);
    },
    open: () => setOpen(true),
    close: () => setOpen(false),
  }));

  /* --------------------------
     Voice recognition
     -------------------------- */
  const startListening = () => {
    if (!SpeechRec) {
      alert("Speech Recognition not supported in this browser.");
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
        try {
          rec.stop();
        } catch {}
        setInput(text);
        sendMessage(text);
      };
      rec.onerror = () => {
        setListening(false);
        try {
          rec.stop();
        } catch {}
      };
      rec.onend = () => setListening(false);
      rec.start();
      recognitionRef.current = rec;
    } catch (err) {
      console.warn("voice error", err);
      setListening(false);
    }
  };

  const stopListening = () => {
    try {
      recognitionRef.current?.stop();
    } catch {}
    setListening(false);
  };

  /* --------------------------
     Helpers
     -------------------------- */
  const push = (m) => setMessages((prev) => [...prev, m]);

  // small weather helper using Open-Meteo + Nominatim (no API key)
  const fetchWeatherSimple = async (city) => {
    try {
      const geo = await fetch(
        `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(
          city
        )}&format=json&limit=1`
      ).then((r) => r.json());
      if (!geo || !geo.length) return `⚠️ Couldn't find "${city}" for weather.`;
      const { lat, lon } = geo[0];
      const w = await fetch(
        `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current_weather=true&timezone=auto`
      ).then((r) => r.json());
      if (!w?.current_weather) return "⚠️ Weather data unavailable.";
      const cw = w.current_weather;
      return `🌤 Weather in ${city}: ${cw.temperature}°C, wind ${cw.windspeed} km/h.`;
    } catch {
      return "⚠️ Unable to fetch weather right now.";
    }
  };

  /* --------------------------
     Core: sendMessage
     -------------------------- */
  const sendMessage = async (rawText) => {
    const text = (rawText || "").trim();
    if (!text) return;
    push({ sender: "user", text });
    setInput("");
    setTyping(true);

    const lower = text.toLowerCase();

    // 1) weather
    if (lower.startsWith("weather") || lower.includes("weather in")) {
      const city = text.split("in")[1]?.trim() || text.split("weather")[1]?.trim() || "your area";
      const reply = await fetchWeatherSimple(city);
      setTimeout(() => {
        push({ sender: "bot", text: reply });
        speakText(reply, speakOn);
        setTyping(false);
      }, 400);
      return;
    }

    // 2) quick cards: categories
    if (/cool|beach|advent|heritage|hidden|gems|scenic/i.test(lower)) {
      const cat = /beach/i.test(lower)
        ? "beach"
        : /advent/i.test(lower)
        ? "adventure"
        : /heritage/i.test(lower)
        ? "heritage"
        : "cool";
      const cards = PRESETS[cat] || PRESETS.cool;
      setTimeout(() => {
        push({
          sender: "bot",
          text: "Here are some curated suggestions — tap any card to explore.",
          cards,
        });
        speakText("Here are some suggestions. Tap a card to explore.", speakOn);
        setTyping(false);
      }, 300);
      return;
    }

    // 3) itinerary / plan
    if (/plan|itinerary|itinerar/i.test(lower)) {
      let days = 3;
      const daysMatch = text.match(/(\d+)\s*(day|days)/i);
      if (daysMatch) days = Number(daysMatch[1]);
      const destMatch = text.match(/(?:to|in)\s+([A-Za-z\s]+)/i);
      const dest = (destMatch && destMatch[1]) ? destMatch[1].trim() : "this place";

      // ask your AI first
      try {
        const aiResp = await chatWithAI([
          { role: "system", content: "You are Wanderly Genie - create a short day-by-day itinerary." },
          { role: "user", content: text },
        ]);
        const reply = aiResp?.reply || aiResp?.content;
        if (reply) {
          push({ sender: "bot", text: reply });
          speakText(reply, speakOn);
          setTyping(false);
          return;
        }
      } catch {
        // fallback deterministic plan
        const plan = [
          `Day 1 — Arrival & local exploring in ${dest}.`,
          `Day 2 — Main highlights and cultural visits.`,
          `Day 3 — Slow day, food & shopping.`,
        ];
        // extend if days > 3
        for (let i = 4; i <= days; i++) plan.push(`Day ${i} — Optional activities and leisure.`);
        const reply = `🧳 ${days}-day plan for ${dest}:\n\n${plan.map((p, i) => `${i + 1}. ${p}`).join("\n\n")}`;
        push({ sender: "bot", text: reply });
        speakText(reply, speakOn);
        setTyping(false);
        return;
      }
    }

    // 4) booking keywords (book stay / book flight)
    if (/book.*stay|reserve.*hotel|book.*hotel|book.*stay/i.test(lower)) {
      const reply = "Opening booking modal — fill details and confirm.";
      push({ sender: "bot", text: reply });
      setBookingInfo({ title: text, price: "From ₹2,500", type: "stay" });
      setShowBooking(true);
      speakText(reply, speakOn);
      setTyping(false);
      return;
    }

    if (/book.*flight|reserve.*seat|choose.*seat/i.test(lower)) {
      push({ sender: "bot", text: "Opening seat picker for you — choose a seat." });
      setSeatPickerOpen(true);
      speakText("Choose your seat.", speakOn);
      setTyping(false);
      return;
    }

    // 5) fallback to AI chat endpoint
    try {
      const history = [
        { role: "system", content: "You are Wanderly Genie: a helpful travel assistant" },
        ...messages.slice(-8).map((m) => ({
          role: m.sender === "bot" ? "assistant" : "user",
          content: m.text,
        })),
        { role: "user", content: text },
      ];
      const aiResp = await chatWithAI(history);
      const reply = aiResp?.reply || aiResp?.content || "⚠️ AI didn't reply. Try a simpler question.";
      // Try to detect a place in AI reply for map preview
      const placeMatch = reply.match(/(?:in|for)\s+([A-Za-z\s]{2,40})/i);
      const mapQuery = placeMatch ? placeMatch[1].trim() : null;
      push({ sender: "bot", text: reply, mapQuery });
      speakText(reply, speakOn);
      setTyping(false);
      return;
    } catch (err) {
      const fallback = `⚠️ AI unavailable — try "Plan a 3 day trip to Goa" or "Weather in Manali".`;
      push({ sender: "bot", text: fallback });
      speakText(fallback, speakOn);
      setTyping(false);
      return;
    }
  };

  // card click -> send the query or open booking
  const handleCardClick = (query) => {
    // if query looks like "Book stay X" we could open booking; currently send as message
    sendMessage(query);
  };

  // seat selected by SeatPicker
  const onSeatSelected = (seat) => {
    setSeatPickerOpen(false);
    push({ sender: "bot", text: `✅ Seat ${seat} reserved (temporary). Proceed to payment when ready.` });
  };

  // booking confirm
  const onConfirmBooking = (payload) => {
    setShowBooking(false);
    push({
      sender: "bot",
      text: `🎉 Booking requested: ${payload.title || "Booking"} — Guests: ${payload.guests || 1} — Check-in: ${payload.checkIn || "N/A"}`,
    });
  };

  /* Exports */
  const onExportText = () => {
    exportChatAsText(messages);
  };
  const onExportPrint = () => {
    exportChatAsPrintable(messages);
  };

  return (
    <div className="chatbox-container" aria-live="polite">
      {!open && (
        <button
          className="chatbox-toggle"
          title="Ask Wanderly Genie"
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
              <ThemeToggle
                onToggle={(val) => {
                  // Theme toggle simply toggles speech here for demo; you can persist theme in localStorage or root CSS
                  setSpeakOn(val);
                }}
              />
              <button
                className={`mic-btn ${listening ? "listening" : ""}`}
                onClick={() => (listening ? stopListening() : startListening())}
                title={listening ? "Stop voice" : "Voice input"}
              >
                {listening ? "🎙️" : "🎤"}
              </button>

              <button
                className="reset-btn"
                onClick={() =>
                  setMessages([
                    {
                      sender: "bot",
                      text:
                        "✨ Chat reset! I'm your Wanderly Genie again. Try: 'Plan a Goa trip' or 'Weather in Manali'.",
                      suggestions: ["Plan a Goa trip for 5 days", "Weather in Manali", "Hidden gems"],
                      cards: PRESETS.cool,
                    },
                  ])
                }
                title="Reset chat"
              >
                🔁
              </button>

              <button
                className="export-btn"
                onClick={() => {
                  onExportText();
                }}
                title="Export chat (TXT)"
              >
                ⤓
              </button>

              <button className="print-btn" onClick={onExportPrint} title="Print (or save as PDF)">
                🖨
              </button>

              <button className="close-btn" onClick={() => setOpen(false)} title="Close">
                ✖
              </button>
            </div>
          </div>

          <div className="chatbox-messages">
            {messages.map((m, i) => (
              <div key={i} className={`chat-row ${m.sender}`}>
                <div className={`chat-msg ${m.sender}`}>
                  <div style={{ whiteSpace: "pre-line" }}>{m.text}</div>

                  {/* Map preview */}
                  {m.mapQuery && <MapPreview q={m.mapQuery} />}

                  {/* Cards */}
                  {m.cards?.length > 0 && <DestCards items={m.cards} onCardClick={handleCardClick} />}

                  {/* Suggestions */}
                  {m.suggestions?.length > 0 && (
                    <div className="chat-suggestions">
                      {m.suggestions.map((s, j) => (
                        <button key={j} onClick={() => sendMessage(s)}>
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
            <button onClick={() => sendMessage(input)} title="Send">
              ➤
            </button>
          </div>
        </div>
      )}

      {/* Booking modal */}
      {showBooking && (
        <BookingModal
          data={bookingInfo}
          onClose={() => setShowBooking(false)}
          onConfirm={(p) => onConfirmBooking(p)}
        />
      )}

      {/* Seat picker (overlay) */}
      {seatPickerOpen && <SeatPicker onClose={() => setSeatPickerOpen(false)} onSelect={onSeatSelected} />}
    </div>
  );
});

export default ChatBox;
