import React, { useContext, useState, useEffect } from "react";
import axios from "axios";
import { UserContext } from "../context/UserContext.jsx";
import "./Profile.css";

export default function Profile() {
  const { user: ctxUser, setUser } = useContext(UserContext);

  const fallback = {
    fullName: "Kavanoor Vaishnavi",
    email: "vihanis@gmail.com",
    phone: "9390681891",
    profilePic:
      localStorage.getItem("userPhoto") ||
      "https://i.pravatar.cc/150?img=14",
  };

  const initial =
    ctxUser || JSON.parse(localStorage.getItem("user")) || fallback;

  const [user, setLocalUser] = useState(initial);
  const [formData, setFormData] = useState({ ...initial });
  const [isEditing, setIsEditing] = useState(false);
  const [toast, setToast] = useState(null);

  const triggerToast = (msg) => {
    setToast(msg);
    setTimeout(() => setToast(null), 2500);
  };

  // Load latest profile from backend (in case backend restarted)
  useEffect(() => {
    axios
      .get(`http://localhost:8085/api/user/profile?ts=${Date.now()}`)
      .then((res) => {
        if (res.data) {
          const latest = {
            fullName: res.data.name,
            email: localStorage.getItem("userEmail") || fallback.email,
            phone: localStorage.getItem("userPhone") || fallback.phone,
            profilePic:
              res.data.photo?.startsWith("http") || res.data.photo?.startsWith("data:")
                ? `${res.data.photo}?t=${Date.now()}`
                : fallback.profilePic,
          };
          setLocalUser(latest);
          setFormData(latest);
          setUser(latest);

          // Store locally
          localStorage.setItem("user", JSON.stringify(latest));
          localStorage.setItem("userName", latest.fullName);
          localStorage.setItem("userPhoto", latest.profilePic);
        }
      })
      .catch(() => console.log("⚠️ Using local profile cache"));
  }, []);

  const handleChange = (e) =>
    setFormData((p) => ({ ...p, [e.target.name]: e.target.value }));

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () =>
      setFormData((p) => ({
        ...p,
        profilePic: reader.result,
        photoFile: file,
      }));
    reader.readAsDataURL(file);
  };

  // 🌸 Save Profile (local + backend)
  const handleSave = async () => {
    try {
      const data = new FormData();
      data.append("name", formData.fullName);
      data.append(
        "bio",
        "Collecting places, not things — one memory at a time."
      );
      if (formData.photoFile) data.append("photo", formData.photoFile);

      const res = await axios.post(
        "http://localhost:8085/api/user/update",
        data,
        {
          headers: { "Content-Type": "multipart/form-data" },
        }
      );

      if (res.data) {
        const updatedUser = {
          fullName: res.data.name,
          email: formData.email,
          phone: formData.phone,
          profilePic:
            res.data.photo?.startsWith("http") ||
            res.data.photo?.startsWith("data:")
              ? `${res.data.photo}?t=${Date.now()}`
              : fallback.profilePic,
        };

        // Update state + localStorage
        setLocalUser(updatedUser);
        setUser(updatedUser);
        setFormData(updatedUser);

        localStorage.setItem("user", JSON.stringify(updatedUser));
        localStorage.setItem("userName", updatedUser.fullName);
        localStorage.setItem("userBio", "Collecting places, not things — one memory at a time.");
        localStorage.setItem("userPhoto", updatedUser.profilePic);

        setIsEditing(false);
        triggerToast("✅ Profile updated successfully!");
      }
    } catch (err) {
      console.error("Profile update failed:", err);
      triggerToast("⚠️ Could not sync profile to server.");
    }
  };

  const handleCancel = () => {
    setFormData({ ...user });
    setIsEditing(false);
  };

  const handleLogout = () => {
    ["user", "userName", "userBio", "userPhoto"].forEach((key) =>
      localStorage.removeItem(key)
    );
    setUser(null);
    window.location.href = "/signin";
  };

  return (
    <div className="profile-container">
      {toast && <div className="toast-notification">{toast}</div>}

      <div className="profile-card">
        {/* Avatar */}
        <div className="avatar-circle">
          {formData.profilePic ? (
            <img
              src={formData.profilePic}
              alt="Profile"
              className="profile-photo"
            />
          ) : (
            <i className="bi bi-person-fill"></i>
          )}

          <label className="upload-btn" title="Update photo">
            <i className="bi bi-camera"></i>
            <input
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              style={{ display: "none" }}
            />
          </label>
        </div>

        <h2 className="profile-title">
          <span className="glow">My Profile</span>
        </h2>

        {!isEditing ? (
          <>
            <div className="profile-info">
              <p>
                <strong>Full Name:</strong> {user.fullName}
              </p>
              <p>
                <strong>Email:</strong> {user.email}
              </p>
              <p>
                <strong>Phone:</strong> {user.phone}
              </p>
            </div>

            <div className="d-flex justify-content-center gap-2 mt-3">
              <button className="edit-btn" onClick={() => setIsEditing(true)}>
                ✏️ Edit Profile
              </button>
              <button className="logout-btn" onClick={handleLogout}>
                🚪 Logout
              </button>
            </div>
          </>
        ) : (
          <>
            <input
              type="text"
              name="fullName"
              value={formData.fullName}
              onChange={handleChange}
              className="profile-input"
              placeholder="Full Name"
            />
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="profile-input"
              placeholder="Email"
            />
            <input
              type="tel"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              className="profile-input"
              placeholder="Phone"
            />

            <div className="d-flex justify-content-center gap-2 mt-3">
              <button className="save-btn" onClick={handleSave}>
                💾 Save
              </button>
              <button className="cancel-btn" onClick={handleCancel}>
                ❌ Cancel
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
