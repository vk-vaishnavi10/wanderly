import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./Settings.css";

export default function Settings() {
  const [theme, setTheme] = useState("royal");
  const [notifications, setNotifications] = useState(true);
  const [emailAlerts, setEmailAlerts] = useState(true);
  const [sound, setSound] = useState(false);
  const [focusMode, setFocusMode] = useState(false);
  const [glow, setGlow] = useState("normal");
  const [language, setLanguage] = useState("English");
  const [quote, setQuote] = useState("");
  const navigate = useNavigate();

  const quotes = [
    "Wander often, wonder always ✨",
    "Adventure is out there 🌍",
    "Take only memories, leave only footprints 💫",
    "Live your life by a compass, not a clock 🧭",
    "Jobs fill your pockets, adventures fill your soul 💜",
  ];

  useEffect(() => {
    const random = quotes[Math.floor(Math.random() * quotes.length)];
    setQuote(random);
  }, []);

  return (
    <section className="settings-section">
      {/* 🌈 Daily Wander Quote */}
      <p className="wander-quote">“{quote}”</p>

      <h1 className="settings-title">⚙️ Account Settings</h1>
      <p className="settings-subtitle">
        Customize your Wanderly experience, manage preferences, and stay secure.
      </p>

      <div className="settings-container">
        {/* 👤 Profile */}
        <div className="settings-card glassy">
          <h2>👤 Profile</h2>
          <div className="settings-row">
            <label>Name:</label>
            <input type="text" placeholder="Vaishnavi K" />
          </div>
          <div className="settings-row">
            <label>Email:</label>
            <input type="email" placeholder="vk@wanderly.com" />
          </div>
          <div className="settings-row">
            <label>Profile Picture:</label>
            <input type="file" />
          </div>
          <button className="settings-btn">Save Changes</button>
        </div>

        {/* 🎨 Personalization */}
        <div className="settings-card glassy">
          <h2>🎨 Personalization</h2>
          <div className="settings-row">
            <label>Theme:</label>
            <select
              value={theme}
              onChange={(e) => setTheme(e.target.value)}
              className="settings-select"
            >
              <option value="royal">💜 Royal Aurora</option>
              <option value="ocean">🌊 Ocean Mist</option>
              <option value="sunset">🌅 Sunset Glow</option>
              <option value="galaxy">🌌 Galaxy Night</option>
            </select>

            {/* 🌈 Live Preview */}
            <div
              className="theme-preview"
              style={{
                background:
                  theme === "royal"
                    ? "linear-gradient(90deg, #9b5de5, #f15bb5)"
                    : theme === "ocean"
                    ? "linear-gradient(90deg, #2193b0, #6dd5ed)"
                    : theme === "sunset"
                    ? "linear-gradient(90deg, #ee9ca7, #ffdde1)"
                    : "linear-gradient(90deg, #0f2027, #203a43, #2c5364)",
              }}
            ></div>
          </div>

          <div className="settings-row">
            <label>Language:</label>
            <select
              value={language}
              onChange={(e) => setLanguage(e.target.value)}
              className="settings-select"
            >
              <option>English</option>
              <option>Spanish</option>
              <option>French</option>
            </select>
          </div>

          <div className="settings-row toggle">
            <label>Sound Effects:</label>
            <input
              type="checkbox"
              checked={sound}
              onChange={() => setSound(!sound)}
            />
          </div>

          <div className="settings-row">
            <label>Glow Intensity:</label>
            <select
              value={glow}
              onChange={(e) => setGlow(e.target.value)}
              className="settings-select"
            >
              <option value="low">Low</option>
              <option value="normal">Normal</option>
              <option value="high">High</option>
            </select>
          </div>

          <button className="settings-btn">Apply Theme</button>
        </div>

        {/* 🔔 Notifications */}
        <div className="settings-card glassy">
          <h2>🔔 Notifications</h2>
          <div className="settings-row toggle">
            <label>Email Alerts</label>
            <input
              type="checkbox"
              checked={emailAlerts}
              onChange={() => setEmailAlerts(!emailAlerts)}
            />
          </div>

          <div className="settings-row toggle">
            <label>Push Notifications</label>
            <input
              type="checkbox"
              checked={notifications}
              onChange={() => setNotifications(!notifications)}
            />
          </div>

          <div className="settings-row toggle">
            <label>🧘‍♀️ Focus Mode</label>
            <input
              type="checkbox"
              checked={focusMode}
              onChange={() => setFocusMode(!focusMode)}
            />
          </div>

          <button className="settings-btn">Update Preferences</button>
        </div>

        {/* 🔐 Security */}
        <div className="settings-card glassy">
          <h2>🔐 Security</h2>
          <div className="settings-row">
            <label>Change Password:</label>
            <input type="password" placeholder="Enter new password" />
          </div>
          <div className="settings-row">
            <label>Confirm Password:</label>
            <input type="password" placeholder="Confirm password" />
          </div>
          <button className="settings-btn">Update Password</button>

          <div className="session-box">
            <h3>🖥 Active Sessions</h3>
            <ul>
              <li>MacBook Air · Hyderabad · Active now</li>
              <li>iPhone 15 · Yesterday</li>
            </ul>
          </div>
        </div>

        {/* 🧳 Data & Privacy */}
        <div className="settings-card glassy">
          <h2>🧳 Data & Privacy</h2>
          <div className="settings-row">
            <button className="settings-btn">Download My Data</button>
          </div>
          <div className="settings-row">
            <button className="settings-btn">Clear Local Cache</button>
          </div>
          <div className="settings-row">
            <button className="settings-btn">Delete My Account</button>
          </div>
        </div>

        {/* ✈️ Quick Access */}
        <div className="settings-card glassy">
          <h2>✈️ Quick Access</h2>
          <div className="shortcut-links">
            <button
              className="settings-btn"
              onClick={() => navigate("/mytrips")}
            >
              My Trips
            </button>
            <button
              className="settings-btn"
              onClick={() => navigate("/memories")}
            >
              Memories
            </button>
            <button
              className="settings-btn"
              onClick={() => navigate("/budget")}
            >
              Budget
            </button>
          </div>
        </div>
      </div>

      <footer className="settings-footer">
        <p>
          💫 Ready for your next adventure?{" "}
          <span className="wanderly-link">Wanderly awaits!</span>
        </p>
      </footer>
    </section>
  );
}
