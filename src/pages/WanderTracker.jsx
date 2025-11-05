import React, { useEffect, useState } from "react";
import axios from "axios";

export default function WanderTracker() {
  const [steps, setSteps] = useState(0);
  const [distance, setDistance] = useState(0);
  const [status, setStatus] = useState("🧭 Tracking your travel steps...");
  const [isMoving, setIsMoving] = useState(false);
  const [syncStatus, setSyncStatus] = useState("🕓 Offline mode active...");
  const [lastSync, setLastSync] = useState(null);

  // 🌐 Track motion using DeviceMotionEvent
  useEffect(() => {
    if (window.DeviceMotionEvent) {
      let lastAccel = { x: 0, y: 0, z: 0 };
      let stepBuffer = 0;

      window.addEventListener("devicemotion", (event) => {
        const { x, y, z } = event.accelerationIncludingGravity;
        const diff =
          Math.abs(x - lastAccel.x) +
          Math.abs(y - lastAccel.y) +
          Math.abs(z - lastAccel.z);

        if (diff > 3) {
          stepBuffer++;
          if (stepBuffer >= 3) {
            setSteps((prev) => prev + 1);
            setDistance((prev) => parseFloat((prev + 0.0008).toFixed(3)));
            stepBuffer = 0;
            setIsMoving(true);
            setTimeout(() => setIsMoving(false), 300);
          }
        }
        lastAccel = { x, y, z };
      });
    } else {
      setStatus("⚠️ Motion tracking not supported on this device.");
    }
  }, []);

  // 💾 Save progress locally every few seconds
  useEffect(() => {
    const saveData = () => {
      const wanderData = {
        steps,
        distance,
        date: new Date().toISOString(),
      };
      localStorage.setItem("wander-tracker-data", JSON.stringify(wanderData));
    };

    const interval = setInterval(saveData, 5000); // save every 5 seconds
    return () => clearInterval(interval);
  }, [steps, distance]);

  // 🔄 Auto sync when online
  useEffect(() => {
    const syncData = async () => {
      const savedData = JSON.parse(localStorage.getItem("wander-tracker-data"));
      if (!savedData) return;

      try {
        const response = await axios.post("http://localhost:8080/api/wander-tracker/save", savedData);
        console.log("✅ Synced with server:", response.data);
        setSyncStatus("✅ Synced successfully!");
        setLastSync(new Date().toLocaleTimeString());
        localStorage.removeItem("wander-tracker-data");
      } catch (error) {
        console.warn("⚠️ Sync failed. Will retry when online.");
        setSyncStatus("⚠️ Offline — will auto-sync when connected.");
      }
    };

    // Run immediately when online
    window.addEventListener("online", syncData);
    return () => window.removeEventListener("online", syncData);
  }, []);

  return (
    <div
      style={{
        textAlign: "center",
        background: "linear-gradient(to bottom, #000, #111)",
        color: "#FFD700",
        paddingTop: "100px",
        minHeight: "100vh",
        fontFamily: "'Poppins', sans-serif",
      }}
    >
      <h2 className="fw-bold mb-3 glow-text">🌍 Wander Tracker</h2>
      <p>{status}</p>

      {/* Step Counter Circle */}
      <div
        style={{
          margin: "40px auto",
          width: "260px",
          height: "260px",
          border: "4px solid #FFD700",
          borderRadius: "50%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: isMoving
            ? "radial-gradient(circle, #FFD700, #000)"
            : "radial-gradient(circle, #222, #000)",
          transition: "all 0.3s ease-in-out",
          boxShadow: isMoving
            ? "0 0 30px #FFD700, 0 0 60px #FFD700"
            : "0 0 10px #FFD700",
        }}
      >
        <div>
          <h1 className="fw-bold glow-text mb-2">{steps}</h1>
          <h5 className="text-light">Journey Steps</h5>
        </div>
      </div>

      {/* Stats Section */}
      <div style={{ marginTop: "30px" }}>
        <h4 className="glow-text">🚶 Distance: {distance.toFixed(2)} km</h4>
        <p className="text-light mt-2">Keep exploring — every step counts in your adventure!</p>
      </div>

      {/* Sync Info */}
      <div style={{ marginTop: "30px", color: "#aaa", fontSize: "0.9rem" }}>
        <p>{syncStatus}</p>
        {lastSync && <p>Last synced at: {lastSync}</p>}
      </div>

      <div style={{ marginTop: "40px", opacity: 0.9 }}>
        <p>
          “The world reveals itself to those who travel on foot.” — <i>Wanderly</i>
        </p>
      </div>

      <style>
        {`
          .glow-text {
            text-shadow: 0 0 10px #FFD700, 0 0 25px #FFD700;
          }
        `}
      </style>
    </div>
  );
}

