import React, { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import "./ChatBox.css";

export default function ChatBox() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    { sender: "bot", text: "👋 Hi! I’m Wanderly Assistant. How can I help you today?" },
  ]);
  const [input, setInput] = useState("");
  const [typing, setTyping] = useState(false);
  const [position, setPosition] = useState({ x: 20, y: 20 });
  const [dragging, setDragging] = useState(false);
  const dragRef = useRef(null);
  const navigate = useNavigate();

  const sendMessage = (msgText) => {
    if (!msgText.trim()) return;

    const userMsg = { sender: "user", text: msgText };
    setMessages((prev) => [...prev, userMsg]);

    let botReply = "🤔 I didn't quite get that. Try asking about flights, stays, or cabs.";
    const lower = msgText.toLowerCase();

    if (lower.includes("flight")) {
      botReply = "✈️ Redirecting you to Flights...";
      setTimeout(() => navigate("/flights"), 1500);
    } else if (lower.includes("stay")) {
      botReply = "🏨 Let’s check Stays...";
      setTimeout(() => navigate("/stays"), 1500);
    } else if (lower.includes("cab")) {
      botReply = "🚖 Taking you to Cabs...";
      setTimeout(() => navigate("/cabs"), 1500);
    } else if (lower.includes("package")) {
      botReply = "🎒 Showing you Travel Packages...";
      setTimeout(() => navigate("/packages"), 1500);
    } else if (lower.includes("trip")) {
      botReply = "📌 Opening your saved trips...";
      setTimeout(() => navigate("/mytrips"), 1500);
    } else if (lower.includes("about")) {
      botReply = "ℹ️ Opening About Us...";
      setTimeout(() => navigate("/about"), 1500);
    }

    setTyping(true);

    setTimeout(() => {
      setTyping(false);
      setMessages((prev) => [...prev, { sender: "bot", text: botReply }]);
    }, 1200);

    setInput("");
  };

  const handleSend = () => sendMessage(input);

  // Dragging
  const handleMouseDown = (e) => {
    setDragging(true);
    dragRef.current = { startX: e.clientX, startY: e.clientY, ...position };
  };

  const handleMouseMove = (e) => {
    if (!dragging) return;
    const dx = e.clientX - dragRef.current.startX;
    const dy = e.clientY - dragRef.current.startY;
    setPosition({ x: dragRef.current.x + dx, y: dragRef.current.y + dy });
  };

  const handleMouseUp = () => setDragging(false);

  return (
    <div
      className="chatbox-container"
      style={{
        position: "fixed",
        bottom: position.y,
        right: position.x,
        zIndex: 2000,
      }}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
    >
      {!isOpen && (
        <button className="chatbox-toggle bounce-btn" onClick={() => setIsOpen(true)}>
          💬
        </button>
      )}

      {isOpen && (
        <div className="chatbox-window bounce-in">
          {/* Header */}
          <div
            className="chatbox-header"
            onMouseDown={handleMouseDown}
            style={{ cursor: "grab" }}
          >
            <span>🤖 Wanderly Assistant</span>
            <button onClick={() => setIsOpen(false)} className="close-btn">✖</button>
          </div>

          {/* Messages */}
          <div className="chatbox-messages">
            {messages.map((msg, i) => (
              <div key={i} className={`chat-row ${msg.sender}`}>
                <div className={`chat-msg ${msg.sender}`}>{msg.text}</div>
              </div>
            ))}

            {typing && (
              <div className="chat-row bot">
                <div className="chat-msg bot typing-indicator">
                  <span></span><span></span><span></span>
                </div>
              </div>
            )}
          </div>

          {/* Quick Suggestions */}
          <div className="chat-suggestions">
            {["Flights", "Stays", "Cabs", "Packages", "My Trips", "About Us"].map((opt, i) => (
              <button key={i} onClick={() => sendMessage(opt)}>
                {opt}
              </button>
            ))}
          </div>

          {/* Input */}
          <div className="chatbox-input">
            <input
              type="text"
              placeholder="Type a message..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSend()}
            />
            <button onClick={handleSend}>➤</button>
          </div>
        </div>
      )}
    </div>
  );
}
