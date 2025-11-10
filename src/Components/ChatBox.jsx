import React, {
  useState,
  useRef,
  forwardRef,
  useImperativeHandle,
  useEffect,
} from "react";
import { chatWithAI } from "../services/api";
import "./ChatBox.css";

const OPEN_WEATHER_KEY = "42c677b12e95fae7a92140f32c2e6b12";

const DestCards = ({ items = [] }) => {
  if (!items.length) return null;
  return (
    <div className="dest-cards">
      {items.map((d, i) => (
        <div key={i} className="dest-card">
          <span className="dest-badge">{d.badge}</span>
          <img src={d.img} alt={d.title} />
          <div className="dest-body">
            <div className="dest-title">{d.title}</div>
            <div className="dest-meta">{d.meta}</div>
            <button className="dest-cta" onClick={() => d.onClick?.()}>
              Explore →
            </button>
          </div>
        </div>
      ))}
    </div>
  );
};

const ChatBox = forwardRef(({ onToggle }, ref) => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    {
      sender: "bot",
      text:
        "🌍 Hey traveler! I’m your *Wanderly Genie* ✨\n\nI can help you explore destinations, check weather, or plan your next trip.\n\nWhere would you like to wander today?",
      suggestions: [
        "Cool Places ❄️",
        "Adventure 🧗‍♂️",
        "Heritage 🏰",
        "Beach Getaways 🏖️",
        "Hidden Gems 💎",
      ],
      cards: [],
    },
  ]);
  const [input, setInput] = useState("");
  const [typing, setTyping] = useState(false);
  const chatEndRef = useRef(null);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, typing]);

  useImperativeHandle(ref, () => ({
    triggerMessage: (text) => {
      setIsOpen(true);
      onToggle?.(true);
      setTimeout(() => sendMessage(text), 400);
    },
  }));

  const resetChat = () => {
    setMessages([
      {
        sender: "bot",
        text:
          "✨ Chat reset! I'm your Wanderly Genie again 🌍\n\nAsk me anything — weather, trip ideas, or destinations!",
        suggestions: [
          "Plan a Goa trip 🏖️",
          "Weather in Manali ❄️",
          "Hidden gems 💎",
        ],
        cards: [],
      },
    ]);
  };

  const fetchWeather = async (city) => {
    try {
      const res = await fetch(
        `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=${OPEN_WEATHER_KEY}`
      );
      const data = await res.json();
      if (data.cod !== 200) return `⚠️ Couldn't find weather for "${city}".`;
      const { temp, feels_like } = data.main;
      const desc = data.weather[0].description;
      return `🌤️ Weather in ${city}: ${temp}°C, feels like ${feels_like}°C — ${desc}.`;
    } catch {
      return "⚠️ Unable to fetch weather right now.";
    }
  };

  const PRESETS = {
    cool: [
      {
        title: "Manali",
        meta: "Snow peaks & cafés",
        img: "https://images.unsplash.com/photo-1562062569-8a9a3d1a5c22?q=80&w=800",
        badge: "❄️ Cool",
        onClick: () => sendMessage("Best spots in Manali"),
      },
      {
        title: "Coorg",
        meta: "Coffee hills & mist",
        img: "https://images.unsplash.com/photo-1593697820934-71b69c8d1b57?q=80&w=800",
        badge: "🌿 Nature",
        onClick: () => sendMessage("Best spots in Coorg"),
      },
      {
        title: "Ooty",
        meta: "Lakes & toy train",
        img: "https://images.unsplash.com/photo-1543997385-22fe6f9c9020?q=80&w=800",
        badge: "🚂 Scenic",
        onClick: () => sendMessage("Best spots in Ooty"),
      },
    ],
  };

  const sendMessage = async (msgText) => {
    if (!msgText?.trim()) return;

    const userMsg = { sender: "user", text: msgText };
    setMessages((prev) => [...prev, userMsg]);
    setTyping(true);
    setInput("");

    const lower = msgText.toLowerCase();
    let reply = "";
    let suggestions = [];
    let cards = [];

    if (lower.includes("weather")) {
      const city = msgText.split("in")[1]?.trim() || "India";
      reply = await fetchWeather(city);
      suggestions = ["Plan trip " + city, "Best spots " + city];
    } else if (lower.includes("cool")) {
      reply = "❄️ Chill vibes! Choose one 👇";
      suggestions = ["Weather in Manali", "Best spots Ooty"];
      cards = PRESETS.cool;
    } else {
      try {
        const chatHistory = [
          { role: "system", content: "You are Wanderly Genie, a fun travel planner." },
          ...messages.map((m) => ({
            role: m.sender === "bot" ? "assistant" : "user",
            content: m.text,
          })),
          { role: "user", content: msgText },
        ];
        const aiResponse = await chatWithAI(chatHistory);
        reply =
          aiResponse?.reply ||
          aiResponse?.content ||
          "⚠️ AI server is taking a coffee break ☕ Please try again shortly.";
      } catch {
        reply = "⚠️ AI server is taking a coffee break ☕ Please try again shortly.";
      }
    }

    setTimeout(() => {
      setTyping(false);
      setMessages((prev) => [
        ...prev,
        { sender: "bot", text: reply, suggestions, cards },
      ]);
    }, 800);
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
        <div className="chatbox-window">
          <div className="chatbox-header">
            <span>🌟 Wanderly Genie</span>
            <div className="header-buttons">
              <button className="reset-btn" onClick={resetChat} title="Restart Chat">
                🔄
              </button>
              <button className="close-btn" onClick={() => setIsOpen(false)}>
                ✖
              </button>
            </div>
          </div>

          <div className="chatbox-messages">
            {messages.map((msg, i) => (
              <div key={i} className={`chat-row ${msg.sender}`}>
                <div className={`chat-msg ${msg.sender}`}>
                  <div style={{ whiteSpace: "pre-line" }}>{msg.text}</div>
                  {msg.cards?.length > 0 && <DestCards items={msg.cards} />}
                </div>

                {msg.suggestions?.length > 0 && (
                  <div className="chat-suggestions">
                    {msg.suggestions.map((s, j) => (
                      <button key={j} onClick={() => sendMessage(s)}>
                        {s}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            ))}

            {typing && (
              <div className="chat-row bot">
                <div className="chat-msg bot typing-indicator">
                  <span></span>
                  <span></span>
                  <span></span>
                </div>
              </div>
            )}
            <div ref={chatEndRef} />
          </div>

          <div className="chatbox-input">
            <input
              type="text"
              placeholder="Ask me anything — try 'Plan a Goa trip'"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && sendMessage(input)}
            />
            <button onClick={() => sendMessage(input)}>➤</button>
          </div>
        </div>
      )}
    </div>
  );
});

export default ChatBox;
