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
      text: "🌍 Hey traveler! I’m your Wanderly Travel Companion.\n\nI can help you plan adventures, find cool-weather escapes, or explore hidden gems.\n\nWhere do you want to wander today?",
      suggestions: [
        "Cool Places ❄️",
        "Adventure 🧗‍♂️",
        "Heritage 🏰",
        "Beach Getaways 🏖️",
        "Hidden Gems 💎",
      ],
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

  // 🌦️ Weather Fetch
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

  // 💬 Message Handler
  const sendMessage = async (msgText) => {
    if (!msgText.trim()) return;
    const userMsg = { sender: "user", text: msgText };
    setMessages((prev) => [...prev, userMsg]);
    setTyping(true);
    setInput("");

    const lower = msgText.toLowerCase();
    let reply = "";
    let suggestions = [];

    // 🌍 Categories
    if (lower.includes("cool")) {
      reply =
        "❄️ *Chilly escapes calling you!*\n\n🏔️ **Manali** — snow peaks & riverside cafés\n🌿 **Coorg** — coffee hills & misty trails\n🚂 **Ooty** — lakes & toy train charm\n\nWhat do you want to check next?";
      suggestions = ["Weather in Manali", "Recent visits Manali", "Best spots Ooty"];
    } else if (lower.includes("adventure")) {
      reply =
        "🧗‍♂️ *For the thrill seekers!*\n\n🌄 **Rishikesh** — rafting, bungee & spiritual vibes\n🏍️ **Leh** — bike trails to heaven\n🏞️ **Sikkim** — scenic trekking routes\n\nWhat would you like to explore?";
      suggestions = ["Weather in Leh", "Plan trip Rishikesh", "Best spots Sikkim"];
    } else if (lower.includes("heritage")) {
      reply =
        "🏰 *Stories carved in stone await you!*\n\n🎨 **Jaipur** — forts & colors\n🕌 **Hampi** — ruins and legends\n🕉️ **Varanasi** — ghats and divinity\n\nWhat shall we uncover?";
      suggestions = ["Weather in Jaipur", "Recent visits Hampi", "Best spots Varanasi"];
    } else if (lower.includes("beach")) {
      reply =
        "🏖️ *Let’s chase the waves!*\n\n🌅 **Goa** — golden sands & nightlife\n🧘‍♀️ **Varkala** — cliffs & calm yoga vibes\n🏄 **Pondicherry** — French charm & sea cafés\n\nWhat would you like to explore?";
      suggestions = ["Weather in Goa", "Best spots Pondicherry", "Plan trip Varkala"];
    } else if (lower.includes("hidden") || lower.includes("gem")) {
      reply =
        "💎 *Offbeat treasures for quiet souls!*\n\n🌿 **Gokarna** — temples & tides\n☀️ **Auroville** — peace & purpose\n🏕️ **Ziro Valley** — tribal music & meadows\n\nCurious about the weather or best time to visit?";
      suggestions = ["Weather in Auroville", "Recent visits Gokarna", "Best spots Ziro Valley"];
    }

    // 🌦️ Weather
    else if (lower.includes("weather")) {
      const city = msgText.split("in")[1]?.trim() || "India";
      reply = await fetchWeather(city);
      suggestions = ["Plan trip " + city, "Best spots " + city];
    }

    // 📅 Recent Visits
    else if (lower.includes("recent")) {
      const city = msgText.split("visits")[1]?.trim() || "India";
      reply =
        `📊 *Recent traveler activity in ${city}:*\n\n🔥 Peak months: December - February\n👨‍👩‍👧 Most visitors: couples & backpackers\n💬 Top feedback: “Peaceful & scenic!”`;
      suggestions = ["Weather in " + city, "Best spots " + city];
    }

    // 🏞️ Best Spots
    else if (lower.includes("best spots") || lower.includes("best place")) {
      const city = msgText.split("in")[1]?.trim() || "India";
      reply =
        `🗺️ *Top attractions in ${city}:*\n\n⭐ 1. Central viewpoint\n🌅 2. Local market & street cafés\n🌄 3. Cultural museum\n🍲 4. Try local cuisine!\n\nWould you like me to plan a trip?`;
      suggestions = ["Plan trip " + city, "Weather in " + city];
    }

    // 🗓️ Trip Planner
    else if (lower.includes("plan")) {
      const dest = msgText.split("trip")[1]?.trim() || "Goa";
      reply =
        `🧭 *Here’s a 3-day travel plan for ${dest}:*\n\n🌅 **Day 1:** Explore local landmarks & cafés\n🏖️ **Day 2:** Adventure activities or relaxation\n🍲 **Day 3:** Food crawl & souvenir shopping\n\n💡 Tip: Try sunrise views for perfect pictures!`;
      suggestions = ["Weather in " + dest, "Best spots " + dest];
    }

    // ✨ Default Fallback
    else {
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
      setMessages((prev) => [...prev, { sender: "bot", text: reply, suggestions }]);
    }, 900);
  };

  const handleSuggestionClick = (text) => sendMessage(text);

  const resetChat = () => {
    setMessages([
      {
        sender: "bot",
        text:
          "🌍 Ready for another journey?\n\nI can help you explore destinations, check weather, or plan adventures again!",
        suggestions: [
          "Cool Places ❄️",
          "Adventure 🧗‍♂️",
          "Heritage 🏰",
          "Beach Getaways 🏖️",
          "Hidden Gems 💎",
        ],
      },
    ]);
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
          style={{
            backgroundColor: "#FFD700",
            color: "#000",
            boxShadow: "0 0 12px #FFD700",
            fontWeight: "bold",
          }}
          onClick={() => {
            setIsOpen(true);
            onToggle?.(true);
          }}
        >
          💬
        </button>
      )}

      {isOpen && (
        <div
          className="chatbox-window glassy"
          style={{
            background: "rgba(0, 0, 0, 0.9)",
            color: "#FFD700",
            border: "1px solid #FFD700",
            boxShadow: "0 0 15px rgba(255, 215, 0, 0.6)",
          }}
        >
          <div className="chatbox-header">
            <span>🌟 Wanderly Travel Companion</span>
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
                <div className={`chat-msg ${msg.sender}`}>
                  {msg.text.split("\n").map((line, j) => (
                    <div key={j}>{line}</div>
                  ))}
                </div>
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
