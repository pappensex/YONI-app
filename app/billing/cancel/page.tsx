import type { CSSProperties } from "react";

export default function BillingCancelPage() {
  return (
    <main style={layoutStyle}>
      <h1 style={titleStyle}>Checkout abgebrochen</h1>
      <p style={textStyle}>
        Du hast den Checkout abgebrochen. Kein Problem – du kannst jederzeit erneut den
        Creator-Plan buchen.
      </p>
      <a href="/billing" style={{ color: "#8b5cf6", fontWeight: 700 }}>
        Zurück zur Billing-Seite
      </a>
    </main>
  );
}

const layoutStyle: CSSProperties = {
  padding: "2rem",
  fontFamily: "system-ui, sans-serif",
  maxWidth: 720,
  margin: "0 auto",
  display: "grid",
  gap: "0.75rem"
};

const titleStyle: CSSProperties = {
  margin: 0
};

const textStyle: CSSProperties = {
  margin: 0,
  color: "#4b5563"
};
