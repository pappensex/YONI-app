"use client";

import { useState, useEffect } from "react";

export default function GoddessMode() {
  const [isGoddessMode, setIsGoddessMode] = useState(false);

  useEffect(() => {
    // Check if GODDESSMODE is saved in localStorage
    const saved = localStorage.getItem("yoni-goddessmode");
    if (saved === "true") {
      setIsGoddessMode(true);
      enableGoddessMode();
    }
  }, []);

  const enableGoddessMode = () => {
    if (typeof document !== "undefined") {
      document.body.classList.add("goddessmode-active");
    }
  };

  const disableGoddessMode = () => {
    if (typeof document !== "undefined") {
      document.body.classList.remove("goddessmode-active");
    }
  };

  const toggleGoddessMode = () => {
    const newState = !isGoddessMode;
    setIsGoddessMode(newState);
    localStorage.setItem("yoni-goddessmode", String(newState));

    if (newState) {
      enableGoddessMode();
    } else {
      disableGoddessMode();
    }
  };

  return (
    <div className="goddessmode-toggle">
      <button
        onClick={toggleGoddessMode}
        className={`goddessmode-button ${isGoddessMode ? "active" : ""}`}
        title={
          isGoddessMode ? "GODDESSMODE+ aktiviert" : "GODDESSMODE+ aktivieren"
        }
      >
        <span className="goddess-icon">{isGoddessMode ? "✨" : "🌙"}</span>
        <span className="goddess-text">
          {isGoddessMode ? "GODDESSMODE+" : "GODDESSMODE+"}
        </span>
      </button>

      <style jsx>{`
        .goddessmode-toggle {
          position: fixed;
          top: 20px;
          right: 20px;
          z-index: 1000;
        }

        .goddessmode-button {
          background: ${isGoddessMode
            ? "linear-gradient(135deg, var(--brand-amethyst) 0%, var(--hl-gold) 100%)"
            : "rgba(255, 255, 255, 0.1)"};
          color: var(--text);
          border: 2px solid
            ${isGoddessMode ? "var(--hl-gold)" : "rgba(255, 255, 255, 0.2)"};
          border-radius: 24px;
          padding: 10px 18px;
          cursor: pointer;
          display: flex;
          align-items: center;
          gap: 8px;
          font-size: 14px;
          font-weight: 600;
          transition: all 0.3s var(--anim-ease-cosmic);
          box-shadow: ${isGoddessMode ? "var(--glow-gold)" : "none"};
        }

        .goddessmode-button:hover {
          transform: scale(1.05);
          box-shadow: ${isGoddessMode
            ? "0 0 35px var(--hl-gold)"
            : "0 0 20px rgba(255, 255, 255, 0.3)"};
        }

        .goddessmode-button.active {
          animation: goddess-pulse 2s var(--anim-ease-gentle) infinite;
        }

        @keyframes goddess-pulse {
          0%,
          100% {
            box-shadow: var(--glow-gold);
          }
          50% {
            box-shadow:
              0 0 40px var(--hl-gold),
              0 0 60px var(--brand-amethyst);
          }
        }

        .goddess-icon {
          font-size: 18px;
          animation: ${isGoddessMode
            ? "goddess-sparkle 1.5s ease-in-out infinite"
            : "none"};
        }

        @keyframes goddess-sparkle {
          0%,
          100% {
            transform: scale(1) rotate(0deg);
          }
          25% {
            transform: scale(1.2) rotate(5deg);
          }
          50% {
            transform: scale(1.1) rotate(-5deg);
          }
          75% {
            transform: scale(1.15) rotate(3deg);
          }
        }

        .goddess-text {
          letter-spacing: 0.5px;
          text-shadow: ${isGoddessMode ? "0 0 10px var(--hl-gold)" : "none"};
        }

        @media (max-width: 640px) {
          .goddessmode-toggle {
            top: 10px;
            right: 10px;
          }

          .goddessmode-button {
            padding: 8px 14px;
            font-size: 12px;
          }

          .goddess-icon {
            font-size: 16px;
          }
        }
      `}</style>
    </div>
  );
}
