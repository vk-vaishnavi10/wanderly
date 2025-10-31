import React, {
  useState,
  useRef,
  forwardRef,
  useImperativeHandle,
  useEffect,
} from "react";
import "./ChatBox.css";

const OPEN_WEATHER_KEY = "42c677b12e95fae7a92140f32c2e6b12";

const ChatBox = forwardRef(({ onToggle }, ref) => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    {
      sender: "bot",
      text: "🌍 Hey traveler! I’m your Wanderly Travel Companion. Where do you want to go next?",
      suggestions: ["Cool weather", "Adventure", "Beach trips"],
    },
  ]);
  const [input, setInput] = useState("");
  const [typing, setTyping] = useState(false);
  const [resetting, setResetting] = useState(false);
  const chatEndRef = useRef(null);

  // Auto-scroll
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

  // 🌦️ Weather API
  const fetchWeather = async (city) => {
    try {
      const res = await fetch(
        `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=${OPEN_WEATHER_KEY}`
      );
      const data = await res.json();
      if (data.cod !== 200) return `⚠️ Couldn't find weather for "${city}".`;

      const temp = data.main.temp;
      const feels = data.main.feels_like;
      const desc = data.weather[0].description;
      const icon = getWeatherEmoji(desc);

      return `${icon} Weather in ${city}: ${temp}°C, feels like ${feels}°C — ${desc}.`;
    } catch {
      return "⚠️ Unable to fetch weather right now.";
    }
  };

  const getWeatherEmoji = (desc) => {
    desc = desc.toLowerCase();
    if (desc.includes("rain")) return "🌧️";
    if (desc.includes("cloud")) return "☁️";
    if (desc.includes("clear")) return "☀️";
    if (desc.includes("snow")) return "❄️";
    if (desc.includes("storm")) return "🌩️";
    if (desc.includes("mist") || desc.includes("fog")) return "🌫️";
    return "🌤️";
  };

  // 💬 Chat Logic
  const sendMessage = async (msgText) => {
    if (!msgText.trim()) return;

    const userMsg = { sender: "user", text: msgText };
    setMessages((prev) => [...prev, userMsg]);
    setTyping(true);
    setInput("");

    const lower = msgText.toLowerCase();
    let reply = "";
    let suggestions = [];

    // 🌦️ Weather
    if (lower.includes("weather")) {
      const city = msgText.split("in")[1]?.trim() || "India";
      reply = await fetchWeather(city);
      suggestions = ["Plan trip", "Nearby attractions"];
    }

    // ❄️ Cool weather
    else if (lower.includes("cool weather")) {
      reply =
        "❄️ Here are some cool-weather destinations: Manali, Ooty, Coorg, Shimla!";
      suggestions = ["Weather in Manali", "Plan Manali 3 days", "Hill stations"];
    }

    // 🏖️ Beach trips
    else if (lower.includes("beach")) {
      reply =
        "🏖️ These are perfect for beaches: Goa, Gokarna, Varkala, and Pondicherry!";
      suggestions = ["Weather in Goa", "Plan Goa 4 days", "Beach cafés"];
    }

    // 🧗 Adventure
    else if (lower.includes("adventure")) {
      reply =
        "🧗 Adventure hotspots: Rishikesh (rafting), Ladakh (biking), Auli (skiing), Coorg (trekking)!";
      suggestions = ["Plan Rishikesh trip", "Weather in Ladakh", "South adventure"];
    }

    // 🏰 Heritage
    else if (lower.includes("heritage") || lower.includes("culture")) {
      reply =
        "🏰 For heritage lovers: Jaipur, Hampi, Varanasi, and Mysore — full of stories and traditions!";
      suggestions = ["Plan Jaipur 3 days", "Weather in Hampi", "Cultural tours"];
    }

    // 🌴 South India
    else if (lower.includes("south")) {
      reply =
        "🌴 Explore South India: Kerala’s backwaters, Pondicherry’s charm, and Coorg’s hills!";
      suggestions = ["Plan Kerala 4 days", "Weather in Coorg", "Beach trips"];
    }

    // 🏔️ North India
    else if (lower.includes("north")) {
      reply =
        "🏔️ North India: Shimla, Manali, and Kashmir — snow, mountains & magic!";
      suggestions = ["Plan Manali 3 days", "Weather in Kashmir", "Hill stations"];
    }

    // 🗓️ Trip planner
    else if (lower.includes("plan")) {
      const words = lower.split(" ");
      const dest = words.find((w, i) => words[i - 1] === "to") || words[1] || "Goa";
      const daysMatch = lower.match(/\d+/);
      const days = daysMatch ? parseInt(daysMatch[0]) : 3;

      reply = generateSmartTripPlan(dest, days);
      suggestions = ["Weather in " + dest, "Hotels in " + dest, "Food spots in " + dest];
    }

    // ✨ Default fallback
    else {
      reply =
        "✨ I can help you plan trips, check weather, or suggest destinations! Try 'Cool weather' or 'Plan Goa 3 days'.";
      suggestions = ["Cool weather", "Adventure", "Beach trips", "North India", "South India"];
    }

    setTimeout(() => {
      setTyping(false);
      setMessages((prev) => [...prev, { sender: "bot", text: reply, suggestions }]);
    }, 900);
  };

  // 🧠 Smart Trip Plan Generator
  const generateSmartTripPlan = (dest, days) => {
    const type = detectPlaceType(dest);
    let plan = "";

    switch (type) {
      case "beach":
        plan = `🌊 ${days}-Day Beach Trip for ${capitalize(dest)}:\n
🌅 Day 1: Relax at ${dest}'s beaches.\n
🏄 Day 2: Try water sports & cafés.\n
🍛 Day 3: Seafood & local markets.\n
🎶 Day 4: Sunset and shacks.\n
💡 Tip: Don’t miss the sunrise!`;
        break;

      case "hill":
        plan = `⛰️ ${days}-Day Hill Getaway for ${capitalize(dest)}:\n
🌄 Day 1: Visit viewpoints & waterfalls.\n
🔥 Day 2: Go trekking.\n
🍵 Day 3: Explore tea estates.\n
🎁 Day 4: Bonfire & relaxation.\n
💡 Tip: Carry warm clothes!`;
        break;

      case "heritage":
        plan = `🏰 ${days}-Day Heritage Trip for ${capitalize(dest)}:\n
📜 Day 1: Visit forts & museums.\n
🕌 Day 2: Temples & monuments.\n
🍲 Day 3: Local cuisine & markets.\n
💡 Tip: Best photos in morning light!`;
        break;

      default:
        plan = `🧭 ${days}-Day City Trip for ${capitalize(dest)}:\n
🏙️ Day 1: Explore top attractions.\n
🎨 Day 2: Visit markets & cafés.\n
🍲 Day 3: Food crawl & nightlife.\n
💡 Tip: Take local transport for fun!`;
    }

    return plan;
  };

  const detectPlaceType = (place) => {
    place = place.toLowerCase();
    if (["goa", "gokarna", "varkala", "pondicherry"].includes(place)) return "beach";
    if (["manali", "ooty", "coorg", "munnar", "darjeeling", "shimla"].includes(place))
      return "hill";
    if (["jaipur", "hampi", "varanasi", "agra", "mysore"].includes(place))
      return "heritage";
    return "city";
  };

  const capitalize = (word) =>
    word.charAt(0).toUpperCase() + word.slice(1).toLowerCase();

  const handleSuggestionClick = (text) => sendMessage(text);

  // ✨ Reset Chat
  const resetChat = () => {
    setResetting(true);
    setTimeout(() => {
      setMessages([
        {
          sender: "bot",
          text: "🌍 Ready for another journey? Tell me your next dream destination!",
          suggestions: ["Cool weather", "Adventure", "Beach trips", "Plan trip"],
        },
      ]);
      setResetting(false);
    }, 800);
  };

  return (
    <div
      className="chatbox-container"
      style={{
        position: "fixed",
        bottom: "25px",
        right: "25px",
        zIndex: 2000,
      }}
    >
      {!isOpen && (
        <button
          className="chatbox-toggle bounce-btn"
          title="Ask Wanderly"
          onClick={() => {
            setIsOpen(true);
            onToggle?.(true);
          }}
        >
          🧭
        </button>
      )}

      {isOpen && (
        <div className={`chatbox-window bounce-in ${resetting ? "fade-out" : "fade-in"}`}>
          <div className="chatbox-header">
            <span>🧭 Wanderly Travel Companion</span>
            <button
              onClick={() => {
                setIsOpen(false);
                onToggle?.(false);
              }}
              className="close-btn"
            >
              ✖
            </button>
          </div>

          <div className="chatbox-messages">
            {messages.map((msg, i) => (
              <div key={i} className={`chat-row ${msg.sender}`}>
                <div className={`chat-msg ${msg.sender}`}>{msg.text}</div>
                {msg.suggestions && (
                  <div className="chat-suggestions">
                    {msg.suggestions.map((s, j) => (
                      <button key={j} onClick={() => handleSuggestionClick(s)}>
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
            <div ref={chatEndRef}></div>
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

          {/* 🔁 Reset button */}
          <div style={{ textAlign: "center", margin: "10px 0" }}>
            <button
              onClick={resetChat}
              className="btn btn-warning fw-bold"
              style={{
                borderRadius: "20px",
                padding: "6px 18px",
                background: "#FFD43B",
                color: "#000",
                boxShadow: "0 0 10px #FFD43B",
              }}
            >
              🔁 Start New Journey
            </button>
          </div>
        </div>
      )}
    </div>
  );
});

export default ChatBox;
