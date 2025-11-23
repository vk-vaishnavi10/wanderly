// 🌍 src/pages/Settings.jsx
import React, { useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import "./Settings.css";
import { UserContext } from "../context/UserContext.jsx";

// ⭐ Your cute anime image
import settingImg from "../assets/setting.png";

export default function Settings() {
  const { user, updateUser } = useContext(UserContext);

  const [theme, setTheme] = useState("royal");
  const [notifications, setNotifications] = useState(true);
  const [emailAlerts, setEmailAlerts] = useState(true);
  const [sound, setSound] = useState(false);
  const [focusMode, setFocusMode] = useState(false);
  const [glow, setGlow] = useState("normal");
  const [language, setLanguage] = useState("English");
  const [quote, setQuote] = useState("");
  const [profileImage, setProfileImage] = useState(
    localStorage.getItem("wanderlyProfilePic") || ""
  );

  const navigate = useNavigate();

  const quotes = [
    "Wander often, wonder always ✨",
    "Adventure is out there 🌍",
    "Take only memories, leave only footprints 💫",
    "Live your life by a compass, not a clock 🧭",
    "Jobs fill your pockets, adventures fill your soul 💜",
  ];

  useEffect(() => {
    setQuote(quotes[Math.floor(Math.random() * quotes.length)]);
  }, []);

  // ⭐ Upload profile picture
  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onloadend = () => {
      setProfileImage(reader.result);
      localStorage.setItem("wanderlyProfilePic", reader.result);
    };
    reader.readAsDataURL(file);
  };

  // ⭐ Save profile
  const handleSaveProfile = () => {
    if (profileImage) {
      localStorage.setItem("wanderlyProfilePic", profileImage);
      updateUser({
        ...user,
        profilePic: profileImage,
      });
    }
    alert("✅ Profile updated!");
  };

  /* 🌈 THEME CONFIG */
  const themeStyles = {
    royal: {
      "--primary-bg": "linear-gradient(180deg, #050013 0%, #0d022e 100%)",
      "--accent": "#f15bb5",
      "--card-bg": "rgba(255,255,255,0.05)",
      "--button-gradient": "linear-gradient(90deg,#9b5de5,#f15bb5,#00e1ff)"
    },
    ocean: {
      "--primary-bg": "linear-gradient(180deg,#00111f 0%,#004466 100%)",
      "--accent": "#00e1ff",
      "--card-bg": "rgba(0,35,55,0.25)",
      "--button-gradient": "linear-gradient(90deg,#2193b0,#6dd5ed)"
    },
    sunset: {
      "--primary-bg": "linear-gradient(180deg,#331a00 0%,#994d00 100%)",
      "--accent": "#ff9a00",
      "--card-bg": "rgba(255,170,50,0.1)",
      "--button-gradient": "linear-gradient(90deg,#ee9ca7,#ffdde1)"
    },
    galaxy: {
      "--primary-bg": "linear-gradient(180deg,#0f0c29 0%,#302b63 50%,#24243e 100%)",
      "--accent": "#b2f5ea",
      "--card-bg": "rgba(25,15,55,0.3)",
      "--button-gradient": "linear-gradient(90deg,#0f2027,#203a43,#2c5364)"
    }
  };

  /* APPLY THEME */
  const applyTheme = () => {
    const selected = themeStyles[theme];
    Object.entries(selected).forEach(([key, value]) =>
      document.documentElement.style.setProperty(key, value)
    );

    const intensity = glow === "low" ? 0.5 : glow === "high" ? 1.5 : 1.0;
    document.documentElement.style.setProperty("--glow-strength", intensity);

    localStorage.setItem("wanderlyTheme", theme);
    localStorage.setItem("wanderlyGlow", glow);

    const toast = document.createElement("div");
    toast.textContent = `🌈 ${theme} theme applied!`;
    toast.className = "theme-toast";
    document.body.appendChild(toast);
    setTimeout(() => toast.remove(), 2000);
  };

  /* LOAD THEME */
  useEffect(() => {
    const savedTheme = localStorage.getItem("wanderlyTheme");
    const savedGlow = localStorage.getItem("wanderlyGlow");

    if (savedTheme) setTheme(savedTheme);
    if (savedGlow) setGlow(savedGlow);

    if (savedTheme && themeStyles[savedTheme]) {
      Object.entries(themeStyles[savedTheme]).forEach(([k, v]) =>
        document.documentElement.style.setProperty(k, v)
      );
    }
  }, []);

  return (
    <section className="settings-section">
      
      {/* 🖼️ Cute Anime Image */}
      <div className="settings-img-wrapper">
        <img src={settingImg} alt="settings mascot" className="settings-img" />
      </div>

      <p className="wander-quote">“{quote}”</p>

      <h1 className="settings-title">⚙️ Account Settings</h1>
      <p className="settings-subtitle">
        Customize your Wanderly experience, manage preferences, and stay secure.
      </p>

      <div className="settings-container">

        {/* PROFILE CARD */}
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
            {profileImage && (
              <img
                src={profileImage}
                className="settings-profile-preview"
                alt="preview"
              />
            )}
            <input type="file" accept="image/*" onChange={handleImageUpload} />
          </div>

          <button className="settings-btn" onClick={handleSaveProfile}>
            Save Changes
          </button>
        </div>

        {/* PERSONALIZATION */}
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

            <div
              className="theme-preview"
              style={{ background: themeStyles[theme]["--accent"] }}
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

          <button className="settings-btn" onClick={applyTheme}>
            Apply Theme
          </button>
        </div>

        {/* NOTIFICATIONS */}
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

        {/* SECURITY */}
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

        {/* DATA */}
        <div className="settings-card glassy">
          <h2>🧳 Data & Privacy</h2>

          <button className="settings-btn">Download My Data</button>
          <button className="settings-btn">Clear Local Cache</button>
          <button className="settings-btn">Delete My Account</button>
        </div>

        {/* QUICK ACCESS */}
        <div className="settings-card glassy">
          <h2>✈️ Quick Access</h2>

          <button className="settings-btn" onClick={() => navigate("/mytrips")}>
            My Trips
          </button>

          <button className="settings-btn" onClick={() => navigate("/memories")}>
            Memories
          </button>

          <button className="settings-btn" onClick={() => navigate("/budget")}>
            Budget
          </button>
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
