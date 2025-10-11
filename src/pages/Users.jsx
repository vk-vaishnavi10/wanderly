import React, { useState } from "react";
import axios from "axios";

const API_BASE = "http://localhost:8081/api/users";

export default function Users() {
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
  });
  const [message, setMessage] = useState("");

  // Handle form input
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Register user
  const handleRegister = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(`${API_BASE}/register`, formData);
      setMessage("✅ User registered successfully!");
      console.log(response.data);
    } catch (err) {
      console.error(err);
      setMessage("❌ Registration failed. Check console for details.");
    }
  };

  // Fetch all users
  const fetchUsers = async () => {
    try {
      const res = await axios.get(API_BASE);
      console.log(res.data);
      setMessage("✅ Users fetched successfully! Check console.");
    } catch (error) {
      console.error("Error fetching users:", error);
      setMessage("❌ Error fetching users.");
    }
  };

  return (
    <div style={{ maxWidth: "400px", margin: "auto", textAlign: "center" }}>
      <h2>Register User</h2>
      <form onSubmit={handleRegister}>
        <input
          type="text"
          name="username"
          placeholder="Username"
          value={formData.username}
          onChange={handleChange}
          required
        /><br /><br />

        <input
          type="email"
          name="email"
          placeholder="Email"
          value={formData.email}
          onChange={handleChange}
          required
        /><br /><br />

        <input
          type="password"
          name="password"
          placeholder="Password"
          value={formData.password}
          onChange={handleChange}
          required
        /><br /><br />

        <button type="submit">Register</button>
      </form>

      <br />
      <button onClick={fetchUsers}>Fetch All Users</button>
      <p>{message}</p>
    </div>
  );
}
