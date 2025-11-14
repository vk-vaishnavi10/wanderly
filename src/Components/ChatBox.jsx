// src/components/ChatBox.jsx
import React, {
  useState,
  useRef,
  forwardRef,
  useImperativeHandle,
  useEffect,
} from "react";
import { chatWithAI } from "../services/api"; // your api wrapper
import "./ChatBox.css";

/**
 * Wanderly Genie — Ultimate Pack
 *
 * Features:
 * - Chat UI with suggestions
 * - Voice input (SpeechRecognition) with mic toggle
 * - Speech output (speechSynthesis)
 * - Map preview (OpenStreetMap iframe)
 * - 3D destination cards
 * - Itinerary generator (3/5/7 day fallback)
 *
 * NOTE:
 * - chatWithAI(messages) should return an object with `.reply` or `.content` (like your api util).
 * - Works offline (fallback logic) if AI missing.
 */

/* ---------------------------
   Utilities
   --------------------------- */
const supportsSpeechRecognition =
  typeof window !== "undefined" &&
  (window.SpeechRecognition || window.webkitSpeechRecognition);

const SpeechRec =
  (window.SpeechRecognition || window.webkitSpeechRecognition) || null;

const speakText = (text) => {
  try {
    if (!("speechSynthesis" in window)) return;
    const utter = new SpeechSynthesisUtterance(text);
    utter.lang = "en-US";
    utter.rate = 1;
    utter.pitch = 1;
    // small voice selection: prefer female-ish if available
    const voices = window.speechSynthesis.getVoices();
    if (voices && voices.length) {
      const pref = voices.find((v) =>
        /female|zira|karen|samantha|google/i.test(v.name)
      );
      if (pref) utter.voice = pref;
    }
    window.speechSynthesis.cancel();
    window.speechSynthesis.speak(utter);
  } catch (err) {
    console.warn("Speech output not available", err);
  }
};

const generateItineraryFallback = (destination, days = 3) => {
  // deterministic friendly fallback itinerary generator
  const daysCount = Number(days) || 3;
  const base = [
    `Day 1 — Arrival & local exploring in ${destination}: settle in, visit a top local site and try a recommended cafe.`,
    `Day 2 — Experience the highlight of ${destination}: half-day tour, local market, and a sunset viewpoint.`,
    `Day 3 — Relax & cultural immersion: museum or temple visit, local food tasting.`,
    `Optional Excursion — Nearby day trip to scenic spot or historic town.`,
  ];
  if (daysCount <= 3) return base.slice(0, 3);
  if (daysCount === 5) return [base[0], base[1], base[2], base[3], `Day 5 — Leisure day & shopping`];
  if (daysCount >= 7)
    return [
      base[0],
      base[1],
      base[2],
      base[3],
      `Day 5 — Hidden gems & offbeat neighborhoods.`,
      `Day 6 — Adventure (trek / watersport) or wellness day.`,
      `Day 7 — Farewell: slow breakfast, souvenir hunt, depart.`,
    ];
  // default
  return base.slice(0, Math.min(daysCount, base.length));
};

const PRESETS = {
  cool: [
    {
      title: "Manali",
      meta: "Snow peaks & cafés",
      img: "https://images.unsplash.com/photo-1562062569-8a9a3d1a5c22?q=80&w=800",
      badge: "❄️ Cool",
      onClickText: "Best spots in Manali",
    },
    {
      title: "Coorg",
      meta: "Coffee hills & mist",
      img: "https://images.unsplash.com/photo-1593697820934-71b69c8d1b57?q=80&w=800",
      badge: "🌿 Nature",
      onClickText: "Best spots in Coorg",
    },
    {
      title: "Ooty",
      meta: "Lakes & toy train",
      img: "https://images.unsplash.com/photo-1543997385-22fe6f9c9020?q=80&w=800",
      badge: "🚂 Scenic",
      onClickText: "Best spots in Ooty",
    },
  ],
  beach: [
    {
      title: "Goa",
      meta: "Beaches & parties",
      img: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?q=80&w=800",
      badge: "🏖️ Beach",
      onClickText: "Best beaches in Goa",
    },
    {
      title: "Andaman",
      meta: "Crystal waters & coral",
      img: "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?q=80&w=800",
      badge: "🌊 Island",
      onClickText: "Best spots in Andaman",
    },
  ],
};

/* ---------------------------
   Child UI pieces
   --------------------------- */
const DestCards = ({ items = [], onCardClick }) => {
  if (!items.length) return null;
  return (
    <div className="dest-cards">
      {items.map((d, i) => (
        <div
          key={i}
          className="dest-card-3d"
          onClick={() => onCardClick?.(d.onClickText || d.title)}
          role="button"
        >
          <div className="dest-card-inner">
            <div
              className="dest-img"
              style={{ backgroundImage: `url(${d.img})` }}
              aria-hidden
            />
            <div className="dest-info">
              <div className="dest-badge">{d.badge}</div>
              <div className="dest-title">{d.title}</div>
              <div className="dest-meta">{d.meta}</div>
              <button
                className="dest-cta"
                onClick={(e) => {
                  e.stopPropagation();
                  onCardClick?.(d.onClickText || d.title);
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

/* ---------------------------
   Main ChatBox
   --------------------------- */
const ChatBox = forwardRef(({ onToggle }, ref) => {
  const [isOpen, setIsOpen] = useState(false);
  const [listening, setListening] = useState(false);
  const [messages, setMessages] = useState([
    {
      sender: "bot",
      text:
        "🌍 Hi! I'm your Wanderly Genie ✨ — I can plan trips, show weather, and create itineraries. Try 'Plan a Goa trip' or tap a suggestion!",
      suggestions: ["Plan a Goa trip 🏖️", "Weather in Manali ❄️", "Cool places"],
      cards: PRESETS.cool,
    },
  ]);
  const [input, setInput] = useState("");
  const [typing, setTyping] = useState(false);
  const recognitionRef = useRef(null);
  const chatEndRef = useRef(null);

  useEffect(() => {
    if (isOpen) onToggle?.(true);
  }, [isOpen, onToggle]);

  useEffect(() => {
    // auto scroll
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, typing]);

  useImperativeHandle(ref, () => ({
    triggerMessage: (text) => {
      setIsOpen(true);
      onToggle?.(true);
      setTimeout(() => sendMessage(text), 300);
    },
  }));

  /* ---------------------------
     Voice recognition
     --------------------------- */
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

      rec.onstart = () => {
        setListening(true);
      };

      rec.onresult = (e) => {
        const text = e.results[0][0].transcript;
        setListening(false);
        rec.stop();
        setInput(text);
        sendMessage(text);
      };

      rec.onerror = () => {
        setListening(false);
        rec.stop();
      };

      rec.onend = () => setListening(false);

      rec.start();
      recognitionRef.current = rec;
    } catch (err) {
      console.warn("Voice start error", err);
      setListening(false);
    }
  };

  const stopListening = () => {
    try {
      recognitionRef.current?.stop();
      setListening(false);
    } catch {}
  };

  /* ---------------------------
     Helpers
     --------------------------- */
  const pushMessage = (m) => setMessages((prev) => [...prev, m]);

  const fetchWeatherSimple = async (city) => {
    // small, unauthenticated weather fallback using Open-Meteo (no key)
    try {
      // geocode using nominatim
      const g = await fetch(
        `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(
          city
        )}&format=json&limit=1`
      ).then((r) => r.json());
      if (!g || !g.length) return `⚠️ Couldn't locate "${city}" for weather.`;
      const { lat, lon } = g[0];
      const weather = await fetch(
        `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current_weather=true`
      ).then((r) => r.json());
      if (!weather?.current_weather) return "⚠️ Weather data unavailable.";
      const cw = weather.current_weather;
      return `🌤 Weather in ${city}: ${cw.temperature}°C, wind ${cw.windspeed} km/h.`;
    } catch (err) {
      return "⚠️ Unable to fetch weather right now.";
    }
  };

  /* ---------------------------
     Map preview component generator
     --------------------------- */
  const MapPreview = ({ q }) => {
    if (!q) return null;
    // use OpenStreetMap embed with search query
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

  /* ---------------------------
     Core: sendMessage
     --------------------------- */
  const sendMessage = async (msgText) => {
    const text = (msgText || "").trim();
    if (!text) return;

    // add user message
    pushMessage({ sender: "user", text });
    setInput("");
    setTyping(true);

    const lower = text.toLowerCase();
    // quick local handlers:
    if (lower.startsWith("weather") || lower.includes("weather in")) {
      // parse city
      const city = text.split("in")[1]?.trim() || text.split("weather")[1]?.trim() || "your area";
      const wres = await fetchWeatherSimple(city);
      setTimeout(() => {
        pushMessage({ sender: "bot", text: wres });
        speakText(wres);
        setTyping(false);
      }, 600);
      return;
    }

    if (lower.includes("itinerary") || lower.startsWith("plan") || lower.startsWith("create")) {
      // try to parse days/destination
      let days = 3;
      const daysMatch = text.match(/(\d+)\s*(day|days)/i);
      if (daysMatch) days = parseInt(daysMatch[1], 10);
      // find destination (naive)
      const destMatch = text.match(/(?:in|to)\s+([A-Za-z\s]+)/i);
      const dest =
        (destMatch && destMatch[1] && destMatch[1].trim()) ||
        (text.split(" ")[1] || "this place");
      // attempt AI first
      try {
        const chatHistory = [
          { role: "system", content: "You are Wanderly Genie - friendly travel planner." },
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
      } catch (e) {
        // fallback
        const plan = generateItineraryFallback(dest, days);
        const reply = `🧳 Here is a ${days}-day plan for ${dest}:\n\n${plan
          .map((d, i) => `${i + 1}. ${d}`)
          .join("\n\n")}`;
        pushMessage({ sender: "bot", text: reply });
        speakText(reply);
        setTyping(false);
        return;
      }
    }

    if (lower.includes("cool") || lower.includes("places") || lower.includes("beach")) {
      // show cards
      setTimeout(() => {
        pushMessage({
          sender: "bot",
          text: `Here are some suggestions — tap to explore.`,
          cards: lower.includes("beach") ? PRESETS.beach : PRESETS.cool,
        });
        speakText("I found some great places, tap any card to explore.");
        setTyping(false);
      }, 500);
      return;
    }

    // Default: try AI chat endpoint
    try {
      const chatHistory = [
        { role: "system", content: "You are Wanderly Genie, a friendly travel planner." },
        ...messages
          .filter((m) => m.sender)
          .slice(-8)
          .map((m) => ({
            role: m.sender === "bot" ? "assistant" : "user",
            content: m.text,
          })),
        { role: "user", content: text },
      ];

      const aiResp = await chatWithAI(chatHistory);

      const reply =
        aiResp?.reply ||
        aiResp?.content ||
        (typeof aiResp === "string" ? aiResp : null);

      if (reply) {
        // optionally parse map requests (if AI says "Here is a map for Goa")
        const cards = [];
        const suggestions = [];

        // If reply mentions places, produce map preview automatically for last word after 'in' or 'for'
        const placeMatch = reply.match(/(?:in|for)\s+([A-Za-z\s]{2,30})/i);
        const mapQuery = placeMatch ? placeMatch[1].trim() : null;

        pushMessage({ sender: "bot", text: reply, cards, suggestions, mapQuery });
        speakText(reply);
        setTyping(false);
        return;
      } else {
        throw new Error("AI empty");
      }
    } catch (err) {
      // final fallback response
      const fallback = `⚠️ AI is currently unavailable. Here's a quick suggestion: try "Plan a 3 day trip to Goa" or "Weather in Manali".`;
      pushMessage({ sender: "bot", text: fallback });
      speakText(fallback);
      setTyping(false);
    }
  };

  /* ---------------------------
     UI actions
     --------------------------- */
  const handleCardClick = (query) => {
    sendMessage(query);
  };

  return (
    <div className="chatbox-container">
      {!isOpen && (
        <button
          className="chatbox-toggle"
          onClick={() => {
            setIsOpen(true);
            onToggle?.(true);
          }}
          title="Ask Wanderly Genie"
        >
          💬
        </button>
      )}

      {isOpen && (
        <div className="chatbox-window" role="dialog" aria-label="Wanderly Genie">
          <div className="chatbox-header">
            <div className="header-left">
              <span className="genie-icon">🌟</span>
              <span className="genie-title">Wanderly Genie</span>
            </div>

            <div className="header-controls">
              <button
                className={`mic-btn ${listening ? "listening" : ""}`}
                onClick={() => (listening ? stopListening() : startListening())}
                title={listening ? "Stop listening" : "Voice input"}
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
                        "✨ Chat reset! I'm your Wanderly Genie again 🌍 Ask me anything — weather, trip ideas, or destinations!",
                      suggestions: ["Plan a Goa trip 🏖️", "Weather in Manali ❄️", "Hidden gems 💎"],
                      cards: PRESETS.cool,
                    },
                  ])
                }
                title="Reset chat"
              >
                🔁
              </button>

              <button className="close-btn" onClick={() => setIsOpen(false)} title="Close">
                ✖
              </button>
            </div>
          </div>

          <div className="chatbox-messages" aria-live="polite">
            {messages.map((msg, i) => (
              <div key={i} className={`chat-row ${msg.sender}`}>
                <div className={`chat-msg ${msg.sender}`}>
                  <div style={{ whiteSpace: "pre-line" }}>{msg.text}</div>

                  {/* mapQuery support */}
                  {msg.mapQuery && <MapPreview q={msg.mapQuery} />}

                  {/* cards */}
                  {msg.cards?.length > 0 && (
                    <DestCards items={msg.cards} onCardClick={handleCardClick} />
                  )}

                  {/* suggestions */}
                  {msg.suggestions?.length > 0 && (
                    <div className="chat-suggestions">
                      {msg.suggestions.map((s, j) => (
                        <button
                          key={j}
                          onClick={() => {
                            sendMessage(s);
                          }}
                        >
                          {s}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            ))}

            {/* typing indicator */}
            {typing && (
              <div className="chat-row bot">
                <div className="chat-msg bot typing-indicator" aria-hidden>
                  <span />
                  <span />
                  <span />
                </div>
              </div>
            )}

            <div ref={chatEndRef} />
          </div>

          <div className="chatbox-input">
            <input
              type="text"
              placeholder="Ask me anything — try 'Plan a Goa trip for 5 days'"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && sendMessage(input)}
            />
            <button onClick={() => sendMessage(input)} title="Send">
              ➤
            </button>
          </div>
        </div>
      )}
    </div>
  );
});

export default ChatBox;
