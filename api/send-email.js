export default async function handler(req, res) {
  const origin = process.env.YONI_ALLOWED_ORIGIN || "*";
  res.setHeader("Access-Control-Allow-Origin", origin);
  res.setHeader("Access-Control-Allow-Methods", "POST,OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
  res.setHeader("Vary", "Origin");
  if (req.method === "OPTIONS") return res.status(204).end();
  if (req.method !== "POST") return res.status(405).json({ error: "Use POST" });

  try {
    const body =
      typeof req.body === "string"
        ? JSON.parse(req.body || "{}")
        : req.body || {};
    if (body.website) return res.status(200).json({ ok: true }); // honeypot
    const name = (body.name || "").slice(0, 120),
      email = (body.email || "").slice(0, 200);
    const subject = (
      body.subject || `Neue Nachricht von ${name || "Kontakt"}`
    ).slice(0, 200);
    const message = (body.message || "").slice(0, 5000);
    if (!email || !message)
      return res.status(400).json({ error: "email & message required" });

    const apiKey = process.env.RESEND_API_KEY;
    const to = process.env.YONI_FORWARD_TO || "delivered@resend.dev";
    if (!apiKey)
      return res.status(500).json({ error: "Missing RESEND_API_KEY" });
    const from = process.env.YONI_FROM || "YONI <onboarding@resend.dev>";
    const esc = (s) =>
      s.replace(
        /[&<>"']/g,
        (m) =>
          ({
            "&": "&amp;",
            "<": "&lt;",
            ">": "&gt;",
            '"': "&quot;",
            "'": "&#39;",
          })[m],
      );
    const html = `<div style="font-family:system-ui,Inter,Roboto,Arial,sans-serif;line-height:1.45">
      <h2>Neue YONI‑Nachricht</h2><p><b>Von:</b> ${name ? name + " · " : ""}${esc(email)}</p>
      <p><b>Betreff:</b> ${esc(subject)}</p><hr style="border:none;border-top:1px solid #e6e6f0;margin:12px 0"/>
      <pre style="white-space:pre-wrap">${esc(message)}</pre>
      <hr style="border:none;border-top:1px solid #e6e6f0;margin:12px 0"/><p style="color:#7a7a8a">Forwarder • ${new Date().toISOString()}</p></div>`;
    const r = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from,
        to: [to],
        subject,
        html,
        headers: { "Reply-To": email },
      }),
    });
    const data = await r.json().catch(() => ({}));
    if (!r.ok)
      return res.status(502).json({ error: "Resend failed", details: data });
    return res.status(200).json({ ok: true, id: data.id });
  } catch (err) {
    return res
      .status(500)
      .json({ error: "Unexpected error", details: String(err) });
  }
}
