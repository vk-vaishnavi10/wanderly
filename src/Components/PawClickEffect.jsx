import React, { useEffect } from "react";
import "./PawClickEffect.css";

export default function PawClickEffect() {
  useEffect(() => {
    const handleClick = (e) => {
      const paw = document.createElement("div");
      paw.className = "paw-print";

      paw.style.left = `${e.pageX - 20}px`;
      paw.style.top = `${e.pageY - 20}px`;

      document.body.appendChild(paw);

      
    };

    window.addEventListener("click", handleClick);

    return () => window.removeEventListener("click", handleClick);
  }, []);

  return null;
}
