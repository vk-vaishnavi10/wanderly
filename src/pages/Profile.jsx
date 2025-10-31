import React, { useContext, useState } from "react";
import { UserContext } from "../context/UserContext.jsx";
import "./Profile.css";

export default function Profile() {
  const { user: ctxUser, setUser } = useContext(UserContext);

  // fallback user if nothing in storage/context yet
  const fallback = {
    fullName: "Kavanoor Vaishnavi",
    email: "vihanis@gmail.com",
    phone: "9390681891",
    profilePic: null,
  };

  const initial = ctxUser || JSON.parse(localStorage.getItem("user")) || fallback;

  const [user, setLocalUser] = useState(initial);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({ ...initial });
  const [toast, setToast] = useState(null);

  const triggerToast = (msg) => {
    setToast(msg);
    setTimeout(() => setToast(null), 2500);
  };

  const handleChange = (e) =>
    setFormData((p) => ({ ...p, [e.target.name]: e.target.value }));

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () =>
      setFormData((p) => ({ ...p, profilePic: reader.result }));
    reader.readAsDataURL(file);
  };

  const handleSave = () => {
    // persist
    localStorage.setItem("user", JSON.stringify(formData));
    setLocalUser(formData);

    // 🔥 update context so Navbar reacts instantly
    setUser(formData);

    setIsEditing(false);
    triggerToast("✅ Profile updated successfully!");
  };

  const handleCancel = () => {
    setFormData({ ...user });
    setIsEditing(false);
  };

  const handleLogout = () => {
    localStorage.removeItem("user");
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
            <img src={formData.profilePic} alt="Profile" className="profile-photo" />
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
