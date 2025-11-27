"use client";

import type { CSSProperties } from "react";
import { useState } from "react";

function useRedirectingAction(endpoint: string) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const run = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(endpoint, { method: "POST" });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error || "Unbekannter Fehler");
      }
      const data = await res.json();
      if (!data?.url) {
        throw new Error("Antwort ohne Redirect-URL erhalten");
      }
      window.location.href = data.url as string;
    } catch (err: any) {
      setError(err?.message || "Aktion fehlgeschlagen");
    } finally {
      setLoading(false);
    }
  };

  return { run, loading, error };
}

type BillingActionsProps = {
  isCreator: boolean;
  disabled?: boolean;
};

export default function BillingActions({ isCreator, disabled }: BillingActionsProps) {
  const checkout = useRedirectingAction("/api/billing/checkout");
  const portal = useRedirectingAction("/api/billing/portal");

  return (
    <div style={{ display: "grid", gap: "0.75rem", maxWidth: 480 }}>
      {!isCreator && (
        <button
          onClick={checkout.run}
          disabled={disabled || checkout.loading}
          style={buttonStyle}
        >
          {checkout.loading ? "Verbinde mit Stripe …" : "Creator werden"}
        </button>
      )}

      {isCreator && (
        <button
          onClick={portal.run}
          disabled={disabled || portal.loading}
          style={buttonStyle}
        >
          {portal.loading ? "Portal lädt …" : "Abo im Kundenportal verwalten"}
        </button>
      )}

      {(checkout.error || portal.error) && (
        <p style={{ color: "#b91c1c", margin: 0 }}>
          {checkout.error || portal.error}
        </p>
      )}

      {disabled && (
        <p style={{ margin: 0, color: "#6b7280" }}>
          Bitte zuerst einloggen (Header `x-user-email` oder Cookie `demo-user-email`).
        </p>
      )}
    </div>
  );
}

const buttonStyle: CSSProperties = {
  padding: "0.9rem 1rem",
  background: "linear-gradient(90deg, #8b5cf6, #ec4899)",
  color: "white",
  border: "none",
  borderRadius: "0.75rem",
  fontWeight: 700,
  cursor: "pointer",
  boxShadow: "0 10px 30px rgba(0,0,0,0.2)",
  transition: "transform 0.1s ease, box-shadow 0.1s ease"
};
