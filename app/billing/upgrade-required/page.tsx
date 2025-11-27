import type { CSSProperties } from "react";

export default function UpgradeRequiredPage() {
  return (
    <main style={layoutStyle}>
      <h1 style={titleStyle}>Creator-Abo erforderlich</h1>
      <p style={textStyle}>
        Die Creator-Funktionen sind nur mit aktivem Abo verfügbar. Starte den Checkout
        unter <a href="/billing">/billing</a> und kehre danach hierher zurück.
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
