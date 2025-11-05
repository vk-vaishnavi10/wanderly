// src/context/UserContext.jsx
import React, { createContext, useState, useEffect } from "react";

export const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(
    JSON.parse(localStorage.getItem("wanderUser")) || null
  );

  useEffect(() => {
    if (user) localStorage.setItem("wanderUser", JSON.stringify(user));
  }, [user]);

  const login = (userData) => {
    setUser(userData);
    localStorage.setItem("wanderUser", JSON.stringify(userData));
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("wanderUser");
  };

  return (
    <UserContext.Provider value={{ user, setUser, login, logout }}>
      {children}
    </UserContext.Provider>
  );
};
