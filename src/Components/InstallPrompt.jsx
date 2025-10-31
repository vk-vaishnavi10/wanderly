// src/components/InstallPrompt.jsx
import React, { useEffect, useState } from "react";
import "./InstallPrompt.css";

export default function InstallPrompt() {
  const [deferredPrompt, setDeferredPrompt] = useState(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const handler = (e) => {
      e.preventDefault();
      setDeferredPrompt(e);
      setVisible(true); // 👀 Show prompt popup
    };

    window.addEventListener("beforeinstallprompt", handler);

    return () => window.removeEventListener("beforeinstallprompt", handler);
  }, []);

  const installApp = async () => {
    if (!deferredPrompt) return;

    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;

    if (outcome === "accepted") {
      console.log("✅ User accepted the install prompt");
    } else {
      console.log("❌ User dismissed the install prompt");
    }

    setDeferredPrompt(null);
    setVisible(false);
  };

  if (!visible) return null;

  return (
    <div className="install-prompt">
      <div className="install-card glassy">
        <h4>🌟 Install Wanderly</h4>
        <p>Get offline access and a faster app-like experience!</p>
        <div className="install-actions">
          <button className="btn-install" onClick={installApp}>
            🧭 Install App
          </button>
          <button className="btn-cancel" onClick={() => setVisible(false)}>
            ✖ Later
          </button>
        </div>
      </div>
    </div>
  );
}
