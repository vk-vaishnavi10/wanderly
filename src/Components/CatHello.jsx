// src/components/CatHello.jsx
import React from "react";
import "./CatHello.css";

export default function CatHello({ message = "hello!" }) {
  return (
    <div className="cat-float">
      <div className="cat">
        <div className="cat-head">
          <div className="cat-ear ear-left"></div>
          <div className="cat-ear ear-right"></div>

          <div className="cat-face">
            <div className="eye eye-left"></div>
            <div className="eye eye-right"></div>
            <div className="nose"></div>
            <div className="mouth"></div>
            <div className="whiskers whisker-left"></div>
            <div className="whiskers whisker-right"></div>
          </div>
        </div>

        <div className="cat-body">
          <div className="arm arm-left"></div>
          <div className="arm arm-right"></div>
          <div className="envelope"></div>
        </div>
      </div>

      <div className="cat-bubble">{message}</div>
    </div>
  );
}
