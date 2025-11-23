// src/components/CatMouseMascot.jsx

import "./CatMouseMascot.css";

export default function CatMouseMascot() {
  return (
    <div className="catmouse-mascot">

      {/* CAT */}
      <div className="cm-cat">
        <div className="cm-cat-head">
          <div className="cm-cat-ear cm-cat-ear-left" />
          <div className="cm-cat-ear cm-cat-ear-right" />

          <div className="cm-cat-face">
            <div className="cm-cat-eye cm-cat-eye-left" />
            <div className="cm-cat-eye cm-cat-eye-right" />

            <div className="cm-cat-cheek cm-cat-cheek-left" />
            <div className="cm-cat-cheek cm-cat-cheek-right" />

            <div className="cm-cat-mouth" />
          </div>
        </div>

        <div className="cm-cat-paws">
          <div className="cm-cat-paw" />
          <div className="cm-cat-paw" />
        </div>
      </div>

      {/* MOUSE */}
      <div className="cm-mouse">
        <div className="cm-mouse-head">
          <div className="cm-mouse-ear cm-mouse-ear-left" />
          <div className="cm-mouse-ear cm-mouse-ear-right" />

          <div className="cm-mouse-face">
            <div className="cm-mouse-eye cm-mouse-eye-left" />
            <div className="cm-mouse-eye cm-mouse-eye-right" />
            <div className="cm-mouse-mouth" />
          </div>

          <div className="cm-mouse-arm" />
        </div>
      </div>

      <div className="cm-bubble">
        🍽️ Ready to feast?<br />Let’s reserve!
      </div>

    </div>
  );
}
