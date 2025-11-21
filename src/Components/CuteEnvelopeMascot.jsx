// src/Components/CuteEnvelopeMascot.jsx
import React from "react";
import "./cuteEnvelopeMascot.css";

export default function CuteEnvelopeMascot({ onClick }) {
  return (
    <div className="mascot-wrapper" onClick={onClick}>
      
      {/* ENVELOPE */}
      <div className="mini-envelope">
        <div className="envelope-top"></div>
        <div className="envelope-body"></div>
      </div>

      {/* CAT */}
      <div className="mini-cat">
        <div className="cat-ear ear-left"></div>
        <div className="cat-ear ear-right"></div>

        <div className="cat-face">
          <div className="eye eye-left"></div>
          <div className="eye eye-right"></div>
          <div className="mouth"></div>
        </div>

        <div className="cat-body"></div>
        <div className="cat-tail"></div>
      </div>

    </div>
  );
}
