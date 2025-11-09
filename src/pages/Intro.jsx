import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./Intro.css";
// 🎬 Use public folder path for videos
const introVideo = "/videos/travelintrobg.mp4";




export default function Intro() {
  const navigate = useNavigate();

  useEffect(() => {
    // 🎥 Adjust video playback speed for cinematic feel
    const video = document.querySelector(".intro-bg-video");
    if (video) video.playbackRate = 1;

    // 🫧 Hide vertical navbar during intro
    const navbar = document.querySelector(".vertical-navbar");
    if (navbar) navbar.style.display = "none";

    // ✅ Restore navbar after intro is left
    return () => {
      if (navbar) navbar.style.display = "flex";
    };
  }, []);

  const handleExplore = () => {
    const overlay = document.querySelector(".intro-overlay");
    overlay.classList.add("fade-out");

    // 🩵 Add fade to video as well for smoother transition
    const video = document.querySelector(".intro-bg-video");
    if (video) video.classList.add("fade-out");

    setTimeout(() => navigate("/register"), 1000); // smooth redirect
  };

  return (
    <div className="intro-page">
      {/* 🎥 Background Video */}
      <video
  className="intro-bg-video"
  autoPlay
  muted
  loop
  playsInline
  preload="auto"
  onLoadedData={() => console.log("✅ Video loaded successfully")}
  onError={(e) => console.error("❌ Video load error:", e)}
>
  <source src={introVideo} type="video/mp4" />
  Your browser does not support the video tag.
</video>


      {/* 🌈 Cinematic Overlay */}
      <div className="intro-overlay">
        <h1 className="intro-title">
          Welcome to <span>Wanderly</span>
        </h1>
        <p className="intro-sub">Begin your dream journey 🌍</p>

        <div className="intro-box">
          <button className="intro-btn" onClick={handleExplore}>
            Start Exploring ✨
          </button>
        </div>
      </div>
    </div>
  );
}
