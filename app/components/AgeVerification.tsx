"use client";

import { useState, useEffect } from "react";

interface AgeVerificationProps {
  onVerified: () => void;
}

export default function AgeVerification({ onVerified }: AgeVerificationProps) {
  const [isVerified, setIsVerified] = useState(false);

  useEffect(() => {
    // Check if user has already verified
    const verified = localStorage.getItem("yoni-age-verified");
    if (verified === "true") {
      setIsVerified(true);
      onVerified();
    }
  }, [onVerified]);

  const handleVerify = (is18Plus: boolean) => {
    if (is18Plus) {
      localStorage.setItem("yoni-age-verified", "true");
      setIsVerified(true);
      onVerified();
    } else {
      alert(
        "YONI ist ausschließlich für Personen ab 18 Jahren zugänglich. Bitte verlasse diese Seite.",
      );
    }
  };

  if (isVerified) {
    return null;
  }

  return (
    <div className="age-verification-overlay">
      <div className="age-verification-modal">
        <div className="age-verification-content">
          <h1 className="anim-sparkle">🌌 YONI</h1>
          <h2>Altersverifikation</h2>
          <p className="age-notice">
            YONI ist eine Plattform für mentale Gesundheit mit therapeutischen
            Inhalten, die für erwachsene Nutzer:innen konzipiert ist.
          </p>
          <p className="age-question">
            <strong>Bist du mindestens 18 Jahre alt?</strong>
          </p>
          <div className="age-buttons">
            <button
              onClick={() => handleVerify(true)}
              className="glitzer-button age-yes"
            >
              ✨ Ja, ich bin 18+
            </button>
            <button onClick={() => handleVerify(false)} className="age-no">
              Nein
            </button>
          </div>
          <p className="age-disclaimer">
            Durch Bestätigung erklärst du, dass du volljährig bist.
          </p>
        </div>
      </div>
      <style jsx>{`
        .age-verification-overlay {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: rgba(11, 11, 16, 0.98);
          backdrop-filter: blur(10px);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 9999;
          animation: fadeIn 0.5s ease-in-out;
        }

        @keyframes fadeIn {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }

        .age-verification-modal {
          background: var(--panel);
          border: 2px solid var(--brand-amethyst);
          border-radius: var(--radius);
          padding: 32px;
          max-width: 500px;
          width: 90%;
          box-shadow: var(--glow-amethyst);
          animation: slideUp 0.6s var(--anim-ease-cosmic);
        }

        @keyframes slideUp {
          from {
            transform: translateY(30px);
            opacity: 0;
          }
          to {
            transform: translateY(0);
            opacity: 1;
          }
        }

        .age-verification-content {
          text-align: center;
        }

        .age-verification-content h1 {
          font-size: 48px;
          margin: 0 0 16px 0;
        }

        .age-verification-content h2 {
          color: var(--brand-amethyst);
          margin: 0 0 24px 0;
          font-size: 24px;
        }

        .age-notice {
          margin: 0 0 20px 0;
          line-height: 1.6;
          opacity: 0.9;
        }

        .age-question {
          margin: 24px 0;
          font-size: 18px;
        }

        .age-buttons {
          display: flex;
          gap: 16px;
          justify-content: center;
          margin: 24px 0;
        }

        .age-yes {
          background: var(--brand-amethyst);
          flex: 1;
          max-width: 200px;
          padding: 14px 20px;
          font-size: 16px;
          font-weight: 600;
        }

        .age-no {
          background: rgba(255, 255, 255, 0.1);
          color: var(--text);
          border: 1px solid rgba(255, 255, 255, 0.2);
          border-radius: 12px;
          padding: 14px 20px;
          cursor: pointer;
          flex: 1;
          max-width: 200px;
          font-size: 16px;
        }

        .age-no:hover {
          background: rgba(255, 255, 255, 0.15);
        }

        .age-disclaimer {
          margin: 20px 0 0 0;
          font-size: 12px;
          opacity: 0.6;
          line-height: 1.4;
        }
      `}</style>
    </div>
  );
}
