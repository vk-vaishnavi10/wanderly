import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";

import "leaflet/dist/leaflet.css";
import "./index.css";
import "./i18n";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap-icons/font/bootstrap-icons.css";
import "bootstrap/dist/js/bootstrap.bundle.min.js";

import { BrowserRouter } from "react-router-dom";
import { UserProvider } from "./context/UserContext.jsx";

// ❌ REMOVE THIS → registerSW({ immediate: true });
// ❌ No PWA import anymore

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <BrowserRouter>
      <UserProvider>
        <App />
      </UserProvider>
    </BrowserRouter>
  </React.StrictMode>
);
