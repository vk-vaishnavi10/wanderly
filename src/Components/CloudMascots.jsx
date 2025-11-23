import React from "react";
import "./CloudMascots.css";

export default function CloudMascots() {
  const clouds = [
    { id: 1, top: "10%", left: "12%", msg: "Hello traveller! ☁️✨" },
    { id: 2, top: "25%", right: "10%", msg: "Ready to explore? 🌍" },
    { id: 3, top: "55%", left: "8%", msg: "Let’s book your ride! 🚖" },
    { id: 4, bottom: "18%", right: "15%", msg: "Comfort awaits! 💜" },
    { id: 5, bottom: "8%", left: "40%", msg: "Pick your cab! ✨" },
  ];

  return (
    <div className="transport-cloud-layer">
      {clouds.map((c) => (
        <div
          key={c.id}
          className={`transport-cloud-mascot m${c.id}`}
          style={c}
        >
          <div className="transport-cloud">
            <div className="puff p1" />
            <div className="puff p2" />
            <div className="puff p3" />

            <div className="transport-cloud-face">
              <div className="transport-cloud-eye e1" />
              <div className="transport-cloud-eye e2" />
              <div className="transport-cloud-mouth" />
            </div>
          </div>

          <div className="transport-cloud-bubble">{c.msg}</div>
        </div>
      ))}
    </div>
  );
}
