export default function CreatorDashboardPage() {
  return (
    <main
      style={{
        padding: "2rem",
        fontFamily: "system-ui, sans-serif",
        maxWidth: 960,
        margin: "0 auto",
        display: "grid",
        gap: "1rem"
      }}
    >
      <p style={{ margin: 0, color: "#a855f7", fontWeight: 700 }}>Creator Dashboard</p>
      <h1 style={{ margin: 0 }}>Willkommen im YONI Creator-Modus</h1>
      <p style={{ margin: 0, color: "#4b5563" }}>
        Dieser Bereich ist durch die Creator-Rolle geschützt und kann für Uploads,
        Publishing und Analytics erweitert werden.
      </p>
    </main>
  );
}
