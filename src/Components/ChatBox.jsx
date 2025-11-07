import React, {
  useState,
  useRef,
  forwardRef,
  useImperativeHandle,
  useEffect,
} from "react";
import "./ChatBox.css";

const OPEN_WEATHER_KEY = "42c677b12e95fae7a92140f32c2e6b12";

// ✨ Small Component for Destination Cards
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
        "🌍 Hey traveler! I’m your Wanderly Travel Companion.\n\nI can help you plan adventures, find cool-weather escapes, or explore hidden gems.\n\nWhere do you want to wander today?",
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

  // 🌦️ Weather Fetcher
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

  // 🌍 Preset Destination Cards
  const PRESETS = {
    cool: [
      {
        title: "Manali",
        meta: "Snow peaks & cafés",
        img: "https://images.unsplash.com/photo-1562062569-8a9a3d1a5c22?q=80&w=800&auto=format&fit=crop",
        badge: "❄️ Cool",
        onClick: () => sendMessage("Best spots in Manali"),
      },
      {
        title: "Coorg",
        meta: "Coffee hills & mist",
        img: "https://images.unsplash.com/photo-1593697820934-71b69c8d1b57?q=80&w=800&auto=format&fit=crop",
        badge: "🌿 Nature",
        onClick: () => sendMessage("Best spots in Coorg"),
      },
      {
        title: "Ooty",
        meta: "Lakes & toy train",
        img: "https://images.unsplash.com/photo-1543997385-22fe6f9c9020?q=80&w=800&auto=format&fit=crop",
        badge: "🚂 Scenic",
        onClick: () => sendMessage("Best spots in Ooty"),
      },
    ],
    adventure: [
      {
        title: "Rishikesh",
        meta: "Rafting & bungee",
        img: "https://images.unsplash.com/photo-1593697821527-f5a7d86c7a2f?q=80&w=800&auto=format&fit=crop",
        badge: "🧗‍♂️ Thrill",
        onClick: () => sendMessage("Plan trip Rishikesh"),
      },
      {
        title: "Leh",
        meta: "Iconic bike trails",
        img: "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?q=80&w=800&auto=format&fit=crop",
        badge: "🏍️ High",
        onClick: () => sendMessage("Weather in Leh"),
      },
      {
        title: "Sikkim",
        meta: "Epic trekking",
        img: "https://images.unsplash.com/photo-1500534314209-a25ddb2bd429?q=80&w=800&auto=format&fit=crop",
        badge: "🏞️ Trails",
        onClick: () => sendMessage("Best spots in Sikkim"),
      },
    ],
    heritage: [
      {
        title: "Jaipur",
        meta: "Forts & colors",
        img: "https://images.unsplash.com/photo-1512453979798-5ea266f8880c?q=80&w=800&auto=format&fit=crop",
        badge: "🏰 Royal",
        onClick: () => sendMessage("Weather in Jaipur"),
      },
      {
        title: "Hampi",
        meta: "Ruins & legends",
        img: "https://images.unsplash.com/photo-1602751584644-7b57a798edc2?q=80&w=800&auto=format&fit=crop",
        badge: "🗿 Ancient",
        onClick: () => sendMessage("Recent visits Hampi"),
      },
      {
        title: "Varanasi",
        meta: "Ghats & divinity",
        img: "https://images.unsplash.com/photo-1548013146-72479768bada?q=80&w=800&auto=format&fit=crop",
        badge: "🕉️ Sacred",
        onClick: () => sendMessage("Best spots in Varanasi"),
      },
    ],
    beach: [
      {
        title: "Goa",
        meta: "Sands & nightlife",
        img: "https://images.unsplash.com/photo-1519046904884-53103b34b206?q=80&w=800&auto=format&fit=crop",
        badge: "🏖️ Beach",
        onClick: () => sendMessage("Weather in Goa"),
      },
      {
        title: "Varkala",
        meta: "Cliffs & calm",
        img: "https://images.unsplash.com/photo-1540541338287-41700207dee6?q=80&w=800&auto=format&fit=crop",
        badge: "🧘‍♀️ Zen",
        onClick: () => sendMessage("Plan trip Varkala"),
      },
      {
        title: "Pondicherry",
        meta: "French vibes & cafés",
        img: "https://images.unsplash.com/photo-1491553895911-0055eca6402d?q=80&w=800&auto=format&fit=crop",
        badge: "🇫🇷 Chic",
        onClick: () => sendMessage("Best spots in Pondicherry"),
      },
    ],
    hidden: [
      {
        title: "Gokarna",
        meta: "Temples & tides",
        img: "https://images.unsplash.com/photo-1526485797147-6a104e62eeb7?q=80&w=800&auto=format&fit=crop",
        badge: "💎 Quiet",
        onClick: () => sendMessage("Recent visits Gokarna"),
      },
      {
        title: "Auroville",
        meta: "Peace & purpose",
        img: "https://images.unsplash.com/photo-1500534314209-a25ddb2bd429?q=80&w=800&auto=format&fit=crop",
        badge: "☀️ Mindful",
        onClick: () => sendMessage("Weather in Auroville"),
      },
      {
        title: "Ziro Valley",
        meta: "Tribal meadows",
        img: "https://images.unsplash.com/photo-1500534318627-06770bbff3d2?q=80&w=800&auto=format&fit=crop",
        badge: "🎶 Fest",
        onClick: () => sendMessage("Best spots in Ziro Valley"),
      },
    ],
  };

  // 💬 Chat Logic
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

    if (lower.includes("cool")) {
      reply =
        "❄️ *Chilly escapes calling you!*\n\nManali • Coorg • Ooty — pick one 👇";
      suggestions = ["Weather in Manali", "Recent visits Manali", "Best spots Ooty"];
      cards = PRESETS.cool;
    } else if (lower.includes("adventure")) {
      reply = "🧗‍♂️ *For thrill seekers!* — Rishikesh • Leh • Sikkim";
      suggestions = ["Weather in Leh", "Plan trip Rishikesh", "Best spots Sikkim"];
      cards = PRESETS.adventure;
    } else if (lower.includes("heritage")) {
      reply = "🏰 *Stories carved in stone!* — Jaipur • Hampi • Varanasi";
      suggestions = ["Weather in Jaipur", "Recent visits Hampi", "Best spots Varanasi"];
      cards = PRESETS.heritage;
    } else if (lower.includes("beach")) {
      reply = "🏖️ *Let’s chase the waves!* — Goa • Varkala • Pondicherry";
      suggestions = ["Weather in Goa", "Plan trip Varkala", "Best spots Pondicherry"];
      cards = PRESETS.beach;
    } else if (lower.includes("hidden")) {
      reply = "💎 *Offbeat treasures await!* — Gokarna • Auroville • Ziro Valley";
      suggestions = ["Weather in Auroville", "Recent visits Gokarna", "Best spots Ziro Valley"];
      cards = PRESETS.hidden;
    } else if (lower.includes("weather")) {
      const city = msgText.split("in")[1]?.trim() || "India";
      reply = await fetchWeather(city);
      suggestions = ["Plan trip " + city, "Best spots " + city];
    } else {
      reply =
        "✨ I can help you explore destinations, check weather, or plan your next journey.\n\nTry asking:\n- 'Cool Places'\n- 'Weather in Goa'\n- 'Plan trip to Manali'";
      suggestions = [
        "Cool Places ❄️",
        "Adventure 🧗‍♂️",
        "Heritage 🏰",
        "Beach Getaways 🏖️",
        "Hidden Gems 💎",
      ];
    }

    setTimeout(() => {
      setTyping(false);
      setMessages((prev) => [
        ...prev,
        { sender: "bot", text: reply, suggestions, cards },
      ]);
    }, 800);
  };

  // ✨ UI Rendering
  return (
    <div className="chatbox-container">
      {!isOpen && (
        <button
          className="chatbox-toggle"
          onClick={() => {
            setIsOpen(true);
            onToggle?.(true);
          }}
          title="Ask Wanderly"
        >
          💬
        </button>
      )}

      {isOpen && (
        <div className="chatbox-window">
          <div className="chatbox-header">
            <span>🌟 Wanderly Travel Companion</span>
            <button className="close-btn" onClick={() => setIsOpen(false)}>
              ✖
            </button>
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
                  <span></span><span></span><span></span>
                </div>
              </div>
            )}
            <div ref={chatEndRef} />
          </div>

          <div className="chatbox-input">
            <input
              type="text"
              placeholder="Ask me about your next trip..."
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
