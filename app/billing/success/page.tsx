import type { CSSProperties } from "react";

export default function BillingSuccessPage() {
  return (
    <main style={layoutStyle}>
      <h1 style={titleStyle}>Checkout erfolgreich</h1>
      <p style={textStyle}>
        Vielen Dank! Stripe hat die Zahlung bestätigt. Der Account wird per Webhook als
        CREATOR freigeschaltet, dieser Schritt kann einige Sekunden dauern.
      </p>
      <p style={textStyle}>
        Du kannst das Kundenportal nutzen, sobald das Upgrade aktiv ist.
      </p>
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
