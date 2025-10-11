import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import "leaflet/dist/leaflet.css";

import "./index.css";
import "./i18n";

// ✅ Import Bootstrap CSS
import "bootstrap/dist/css/bootstrap.min.css";

// ✅ Import Bootstrap Icons
import "bootstrap-icons/font/bootstrap-icons.css";

// ✅ Import Bootstrap JS (for dropdowns, modals etc.)
import "bootstrap/dist/js/bootstrap.bundle.min.js";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
