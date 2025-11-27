import BillingActions from "@/app/components/BillingActions";
import { getCurrentUser } from "@/lib/auth";

export default async function BillingPage() {
  const user = await getCurrentUser();
  const isCreator = user?.role === "CREATOR";

  return (
    <main
      style={{
        padding: "2rem",
        fontFamily: "system-ui, sans-serif",
        maxWidth: 900,
        margin: "0 auto",
        display: "grid",
        gap: "1.5rem"
      }}
    >
      <header style={{ display: "grid", gap: "0.5rem" }}>
        <p style={{ margin: 0, color: "#6366f1", fontWeight: 700 }}>YONI Creator Abo</p>
        <h1 style={{ margin: 0 }}>Billing & Upgrades</h1>
        <p style={{ margin: 0, color: "#4b5563" }}>
          Manage your subscription for the Creator Dashboard. Stripe handles payment,
          invoices and self-service management.
        </p>
      </header>

      <section
        style={{
          border: "1px solid #e5e7eb",
          borderRadius: "0.75rem",
          padding: "1rem 1.25rem",
          background: "#f8fafc",
          display: "grid",
          gap: "0.35rem"
        }}
      >
        <h2 style={{ margin: 0 }}>Status</h2>
        <p style={{ margin: 0 }}>
          {user ? `Angemeldet als ${user.email}` : "Keine Session – bitte einloggen."}
        </p>
        <p style={{ margin: 0, color: "#0ea5e9" }}>
          Rolle: {isCreator ? "CREATOR" : "USER"}
        </p>
        {user?.stripeSubscription && (
          <p style={{ margin: 0, color: "#6b7280" }}>
            Stripe Subscription ID: {user.stripeSubscription}
          </p>
        )}
      </section>

      <section style={{ display: "grid", gap: "0.75rem" }}>
        <h2 style={{ margin: 0 }}>Aktionen</h2>
        <BillingActions isCreator={Boolean(isCreator)} disabled={!user} />
      </section>

      <section style={{ display: "grid", gap: "0.5rem" }}>
        <h3 style={{ margin: 0 }}>Hinweise</h3>
        <ul style={{ margin: 0, paddingLeft: "1.25rem", color: "#374151" }}>
          <li>
            Lokale Auth-Bridge: request header <code>x-user-email</code> oder Cookie
            <code>demo-user-email</code> setzen, damit die API einen User laden kann.
          </li>
          <li>Checkout: POST /api/billing/checkout → Stripe Checkout Session.</li>
          <li>Portal: POST /api/billing/portal → Stripe Billing Portal.</li>
        </ul>
      </section>
    </main>
  );
}
