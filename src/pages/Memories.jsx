import React, { useState, useEffect } from "react";
import axios from "axios";
import PanZoom from "react-easy-panzoom";
import "./Memories.css";

export default function Memories() {
  const [memories, setMemories] = useState([]);
  const [timeCapsules, setTimeCapsules] = useState([]);
  const [image, setImage] = useState(null);
  const [caption, setCaption] = useState("");
  const [status, setStatus] = useState("✨ Relive your favorite travel moments...");
  const [selectedImage, setSelectedImage] = useState(null);
  const [selectMode, setSelectMode] = useState(false);
  const [selectedItems, setSelectedItems] = useState([]);
  const [zoom, setZoom] = useState(1);

  // 🌐 Load Memories
  useEffect(() => {
    axios.get("http://localhost:8080/api/memories")
      .then((res) => setMemories(res.data))
      .catch(() => setStatus("⚠️ Offline — showing cached memories."));

    axios.get("http://localhost:8080/api/memories/timecapsule")
      .then((res) => setTimeCapsules(res.data))
      .catch(() => {});
  }, []);

  // 📤 Upload Memory
  const handleUpload = async (e) => {
    e.preventDefault();
    if (!image) return alert("Please select a photo!");

    const formData = new FormData();
    formData.append("caption", caption);
    formData.append("file", image);

    try {
      const res = await axios.post("http://localhost:8080/api/memories/upload", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      const newMemory = res.data;
      setMemories([newMemory, ...memories]);
      setCaption("");
      setImage(null);
      setStatus("✅ Memory uploaded successfully!");
    } catch (err) {
      setStatus("📸 Saved offline — will sync when online.");
    }
  };

  // Selection & Delete
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

  return (
    <div className="memories-page">
      <h2 className="memories-title">📸 Wanderly Memories</h2>
      <p className="status-text">{status}</p>

      {/* ⏳ Time Capsule Notification */}
      {timeCapsules.length > 0 && (
        <div className="timecapsule-banner">
          ✨ One year ago, you captured this moment 🌄
          <img src={timeCapsules[0].imageUrl} alt="Old memory" />
          <p>{timeCapsules[0].caption}</p>
        </div>
      )}

      {/* Upload Box */}
      <form onSubmit={handleUpload} className="upload-box">
        <input type="file" accept="image/*" onChange={(e) => setImage(e.target.files[0])} className="memory-input" />
        <input type="text" placeholder="Write a short memory..." value={caption} onChange={(e) => setCaption(e.target.value)} className="memory-input" />
        <button type="submit" className="btn-glow">Upload Memory 🌟</button>
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

      {/* Gallery */}
      <div className="memory-gallery">
        {memories.map((m, index) => (
          <div
            key={index}
            className={`memory-card ${selectedItems.includes(index) ? "selected" : ""}`}
            style={{ border: `2px solid ${m.color}`, boxShadow: `0 0 15px ${m.color}` }}
            onClick={() => (selectMode ? toggleSelectItem(index) : openImage(m))}
          >
            <img src={m.imageUrl} alt="Memory" />
            <div className="memory-info">
              <p className="memory-caption">{m.caption}</p>
              <small>{m.emotion} • {m.date}</small>
            </div>
          </div>
        ))}
      </div>

      {/* Fullscreen Zoom */}
      {selectedImage && (
        <div className="lightbox-overlay" onClick={() => { setSelectedImage(null); setZoom(1); }}>
          <div className="lightbox-content" onClick={(e) => e.stopPropagation()}>
            <PanZoom minZoom={1} maxZoom={5} zoom={zoom} onZoomChange={setZoom} enablePan={true}>
              <img src={selectedImage.imageUrl} alt="Zoomed memory" className="lightbox-image" />
            </PanZoom>
            <p className="lightbox-caption">{selectedImage.caption}</p>
            <button className="btn-close-glow" onClick={() => setSelectedImage(null)}>✕</button>
          </div>
        </div>
      )}
    </div>
  );
}

