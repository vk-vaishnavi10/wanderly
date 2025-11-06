import React, { useState } from "react";
import { NavLink } from "react-router-dom";
import confetti from "canvas-confetti";
import "./HelpSubpages.css";

export default function LiveChat() {
  const [messages, setMessages] = useState([
    { sender: "bot", text: "👋 Hi there! How can we help you today?" },
  ]);
  const [input, setInput] = useState("");

  const handleSend = () => {
    if (!input.trim()) return;

    // Add user message
    const newMessages = [...messages, { sender: "user", text: input }];
    setMessages(newMessages);
    setInput("");

    // ✨ Confetti and fake bot reply
    confetti({
      particleCount: 60,
      spread: 70,
      origin: { y: 0.7 },
    });

    setTimeout(() => {
      setMessages((prev) => [
        ...prev,
        { sender: "bot", text: "💜 Got it! Our support team will contact you shortly." },
      ]);
    }, 1000);
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") handleSend();
  };

  return (
    <div className="help-subpage">
      <NavLink to="/help" className="back-btn">
        ⬅️ Back to Help Center
      </NavLink>

      <h1>💬 Live Chat Support</h1>
      <p>Connect instantly with our Wanderly support specialists!</p>

      <div className="chat-window">
        {messages.map((msg, i) => (
          <div
            key={i}
            className={`chat-message ${msg.sender === "user" ? "user-msg" : "bot-msg"}`}
          >
            {msg.text}
          </div>
        ))}
      </div>

      <div className="chat-input-box">
        <input
          type="text"
          placeholder="Type your message..."
          className="chat-input"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyPress={handleKeyPress}
        />
        <button className="chat-send-btn" onClick={handleSend}>
          🚀 Send
        </button>
      </div>
    </div>
  );
}
