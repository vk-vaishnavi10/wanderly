import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./Intro.css";

// background video
const introVideo = "/videos/travelintrobg.mp4";

// 🐶 mascot image
import dog from "../assets/dog.png";

export default function Intro() {
  const navigate = useNavigate();

  useEffect(() => {
    const video = document.querySelector(".intro-bg-video");
    if (video) video.playbackRate = 1;

    const navbar = document.querySelector(".vertical-navbar");
    if (navbar) navbar.style.display = "none";

    return () => {
      if (navbar) navbar.style.display = "flex";
    };
  }, []);

  const handleExplore = () => {
    const overlay = document.querySelector(".intro-overlay");
    overlay.classList.add("fade-out");

    const video = document.querySelector(".intro-bg-video");
    if (video) video.classList.add("fade-out");

    setTimeout(() => navigate("/register"), 1000);
  };

  return (
    <div className="intro-page">
      <video
        className="intro-bg-video"
        autoPlay
        muted
        loop
        playsInline
        preload="auto"
      >
        <source src={introVideo} type="video/mp4" />
      </video>

      <div className="intro-overlay">
        <h1 className="intro-title">
          Welcome to <span>Wanderly</span>
        </h1>

        <p className="intro-sub">Begin your dream journey 🌍</p>

        {/* 🐶 Dog + bubble container */}
        <div className="dog-container">
          <img src={dog} alt="Dog" className="intro-dog" />

          {/* 💬 speech bubble */}
          <div className="speech-bubble">
            Welcome to Wanderly! ✨
          </div>
        </div>

        <div className="intro-box">
          <button className="intro-btn" onClick={handleExplore}>
            Start Exploring ✨
          </button>
        </div>
      </div>
    </div>
  );
}
