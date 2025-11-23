// src/components/EventDogMascot.jsx
import React from "react";
import "./EventDogMascot.css";

export default function EventDogMascot() {
  return (
    <div className="event-dog-mascot" aria-hidden="true">
      <div className="edog-wrapper">
        {/* Music notes */}
        <div className="edog-note n1">🎵</div>
        <div className="edog-note n2">🎶</div>
        <div className="edog-note n3">🎧</div>

        {/* Dog */}
        <div className="edog-dog">
          {/* Headphones */}
          <div className="edog-headphones">
            <div className="edog-band" />
            <div className="edog-cup cup-left" />
            <div className="edog-cup cup-right" />
          </div>

          {/* Ears */}
          <div className="edog-ear ear-left" />
          <div className="edog-ear ear-right" />

          {/* Head + Face */}
          <div className="edog-head">
            <div className="edog-face">
              <div className="edog-eye eye-left" />
              <div className="edog-eye eye-right" />
              <div className="edog-blush blush-left" />
              <div className="edog-blush blush-right" />

              <div className="edog-snout">
                <div className="edog-nose" />
                <div className="edog-mouth" />
              </div>
            </div>
          </div>

          {/* Body */}
          <div className="edog-body">
            <div className="edog-belly" />

            {/* Sitting paws */}
            <div className="edog-paw paw-left" />
            <div className="edog-paw paw-right" />

            {/* Waving paw */}
            <div className="edog-paw paw-wave">
              <div className="edog-paw-pad" />
            </div>
          </div>

          {/* Tail */}
          <div className="edog-tail" />
        </div>

        {/* Speech bubble */}
        <div className="edog-bubble">
          🎫 Hey party lover! <br />
          Book your <strong>event tickets</strong> &amp; dance with me 🎉
        </div>
      </div>
    </div>
  );
}
