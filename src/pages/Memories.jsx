import React, { useState, useEffect } from "react";
import axios from "axios";
import PanZoom from "react-easy-panzoom";
import confetti from "canvas-confetti";
import "./Memories.css";

export default function Memories() {
  const [memories, setMemories] = useState([]);
  const [timeCapsules, setTimeCapsules] = useState([]);
  const [image, setImage] = useState(null);
  const [caption, setCaption] = useState("");
  const [location, setLocation] = useState("");
  const [story, setStory] = useState("");
  const [emotion, setEmotion] = useState("💛 Joyful");
  const [status, setStatus] = useState("✨ Relive your favorite travel moments...");
  const [selectedImage, setSelectedImage] = useState(null);
  const [selectMode, setSelectMode] = useState(false);
  const [selectedItems, setSelectedItems] = useState([]);
  const [zoom, setZoom] = useState(1);
  const [user, setUser] = useState({
    name: "Vaishnavi 🌸",
    bio: "Collecting places, not things — one memory at a time.",
    photo: "/assets/profile-avatar.png", // 🌈 local fallback instead of http
  });

  // 🌐 Load Memories & Profile Info
  useEffect(() => {
    axios
      .get("http://localhost:8085/api/memories")
      .then((res) => setMemories(res.data))
      .catch(() => setStatus("⚠️ Offline — showing cached memories."));

    axios
      .get("http://localhost:8085/api/memories/timecapsule")
      .then((res) => setTimeCapsules(res.data))
      .catch(() => {});

    axios
      .get(`http://localhost:8085/api/user/profile?ts=${Date.now()}`)
      .then((res) => {
        if (res.data) {
          setUser({
            name: res.data.name,
            bio: res.data.bio,
            photo: res.data.photo
              ? `${res.data.photo}?t=${Date.now()}`
              : "/assets/profile-avatar.png",
          });
          localStorage.setItem("userName", res.data.name);
          localStorage.setItem("userBio", res.data.bio);
          localStorage.setItem("userPhoto", res.data.photo);
        }
      })
      .catch(() => {
        const storedUser = {
          name: localStorage.getItem("userName") || "Vaishnavi 🌸",
          bio:
            localStorage.getItem("userBio") ||
            "Collecting places, not things — one memory at a time.",
          photo:
            localStorage.getItem("userPhoto") || "/assets/profile-avatar.png",
        };
        setUser(storedUser);
      });
  }, []);

  // 📤 Upload Memory
  const handleUpload = async (e) => {
    e.preventDefault();
    if (!image) return alert("Please select a photo!");

    const formData = new FormData();
    formData.append("caption", caption);
    formData.append("location", location);
    formData.append("story", story);
    formData.append("emotion", emotion);
    formData.append("file", image);

    try {
      const res = await axios.post(
        "http://localhost:8085/api/memories/upload",
        formData,
        { headers: { "Content-Type": "multipart/form-data" } }
      );

      const newMemory = res.data;
      setMemories([newMemory, ...memories]);
      setCaption("");
      setLocation("");
      setStory("");
      setEmotion("💛 Joyful");
      setImage(null);
      setStatus("✅ Memory uploaded successfully!");

      // 🎉 Confetti celebration
      confetti({
        particleCount: 120,
        spread: 70,
        origin: { y: 0.8 },
        colors: ["#9b5de5", "#f15bb5", "#00e1ff", "#ffd700"],
      });
    } catch {
      setStatus("📸 Saved offline — will sync when online.");
    }
  };

  // ✨ Select/Delete Memories
  const toggleSelectMode = () => {
    setSelectMode(!selectMode);
    setSelectedItems([]);
  };

  const toggleSelectItem = (index) => {
    if (selectedItems.includes(index))
      setSelectedItems(selectedItems.filter((i) => i !== index));
    else setSelectedItems([...selectedItems, index]);
  };

  const handleDeleteSelected = () => {
    const filtered = memories.filter((_, i) => !selectedItems.includes(i));
    setMemories(filtered);
    localStorage.setItem("wander-memories", JSON.stringify(filtered));
    setSelectedItems([]);
    setSelectMode(false);
  };

  const openImage = (m) => !selectMode && setSelectedImage(m);

  // 💫 Dynamic mood background
  const getEmotionGradient = () => {
    switch (emotion) {
      case "💛 Joyful":
  return "linear-gradient(180deg, #f9d976, #f39f86, #d76d77)";

      case "🌅 Peaceful":
        return "linear-gradient(180deg, #00e1ff, #b2f5ea)";
      case "🎉 Excited":
        return "linear-gradient(180deg, #9b5de5, #f15bb5)";
      case "🌧️ Nostalgic":
        return "linear-gradient(180deg, #3b3b98, #182848)";
      case "💖 Loved":
        return "linear-gradient(180deg, #f15bb5, #ff9a9e)";
      default:
        return "linear-gradient(180deg, #9b5de5, #f15bb5)";
    }
  };

  return (
    <div
      className="memories-page"
      style={{ background: `${getEmotionGradient()}` }}
    >
      {/* 🌟 Profile Header */}
      <div className="profile-header">
        <img
          src={
            user.photo?.startsWith("data:image")
              ? user.photo
              : `${user.photo}?t=${Date.now()}`
          }
          alt={user.name}
          className="profile-pic"
        />
        <div>
          <h2 className="profile-name">{user.name}</h2>
          <p className="profile-bio">“{user.bio}”</p>
          <p className="profile-stats">{memories.length} moments captured ✨</p>
        </div>
      </div>

      <h2 className="memories-title">📸 Wanderly Memories</h2>
      <p className="status-text">{status}</p>

      {/* ⏳ Time Capsule Banner */}
      {timeCapsules.length > 0 && (
        <div className="timecapsule-banner">
          <h4>💫 One Year Ago...</h4>
          <img src={timeCapsules[0].imageUrl} alt="Old memory" />
          <p className="timecapsule-text">{timeCapsules[0].caption}</p>
        </div>
      )}

      {/* Upload Form */}
      <form onSubmit={handleUpload} className="upload-box">
        <input
          type="file"
          accept="image/*"
          onChange={(e) => setImage(e.target.files[0])}
          className="memory-input"
        />
        <input
          type="text"
          placeholder="Write a short caption..."
          value={caption}
          onChange={(e) => setCaption(e.target.value)}
          className="memory-input"
        />
        <input
          type="text"
          placeholder="Add location..."
          value={location}
          onChange={(e) => setLocation(e.target.value)}
          className="memory-input"
        />
        <input
          type="text"
          placeholder="Write your story..."
          value={story}
          onChange={(e) => setStory(e.target.value)}
          className="memory-input"
        />
        <select
          value={emotion}
          onChange={(e) => setEmotion(e.target.value)}
          className="memory-input"
        >
          <option value="💛 Joyful">💛 Joyful</option>
          <option value="🌅 Peaceful">🌅 Peaceful</option>
          <option value="🎉 Excited">🎉 Excited</option>
          <option value="🌧️ Nostalgic">🌧️ Nostalgic</option>
          <option value="💖 Loved">💖 Loved</option>
        </select>
        <button type="submit" className="btn-glow">
          Upload Memory 🌟
        </button>
      </form>

      {/* Controls */}
      <div className="memory-controls">
        <button onClick={toggleSelectMode} className="btn-outline-glow">
          {selectMode ? "❌ Cancel Selection" : "🪄 Select Memories"}
        </button>
        {selectMode && selectedItems.length > 0 && (
          <button onClick={handleDeleteSelected} className="btn-danger-glow">
            🗑️ Delete Selected ({selectedItems.length})
          </button>
        )}
      </div>

      {/* Memory Gallery */}
      <div className="memory-gallery">
        {memories.map((m, index) => (
          <div
            key={index}
            className={`memory-card ${
              selectedItems.includes(index) ? "selected" : ""
            }`}
            onClick={() => (selectMode ? toggleSelectItem(index) : openImage(m))}
          >
            <img src={m.imageUrl} alt="Memory" />
            <div className="memory-info">
              <p className="memory-caption">“{m.caption}”</p>
              <p className="memory-story">{m.story}</p>
              <p className="memory-location">📍 {m.location}</p>
              <small className="memory-date">
                {m.date} • {m.emotion}
              </small>
            </div>
          </div>
        ))}
      </div>

      {/* Fullscreen Zoom */}
      {selectedImage && (
        <div
          className="lightbox-overlay"
          onClick={() => {
            setSelectedImage(null);
            setZoom(1);
          }}
        >
          <div
            className="lightbox-content"
            onClick={(e) => e.stopPropagation()}
          >
            <PanZoom
              minZoom={1}
              maxZoom={5}
              zoom={zoom}
              onZoomChange={setZoom}
              enablePan={true}
            >
              <img
                src={selectedImage.imageUrl}
                alt="Zoomed memory"
                className="lightbox-image"
              />
            </PanZoom>
            <p className="lightbox-caption">
              “{selectedImage.caption}” <br />
              <em>{selectedImage.story}</em> <br />
              <small>{selectedImage.location}</small> <br />
              {selectedImage.emotion}
            </p>
            <button
              className="btn-close-glow"
              onClick={() => setSelectedImage(null)}
            >
              ✕
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
