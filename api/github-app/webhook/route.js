// /api/github-app/webhook.js
import { createHmac } from "crypto";

export default function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).end("Method not allowed");
  }

  const signature = req.headers["x-hub-signature-256"];
  const event = req.headers["x-github-event"];

  if (!signature) {
    return res.status(400).json({ error: "Missing x-hub-signature-256 header" });
  }

  const webhookSecret = process.env.GITHUB_WEBHOOK_SECRET;

  if (!webhookSecret) {
    console.error("GITHUB_WEBHOOK_SECRET is not configured");
    return res.status(500).json({ error: "Webhook secret not configured" });
  }

  // Get raw body (Vercel provides this as req.body for serverless functions)
  const rawBody = JSON.stringify(req.body);

  // Verify signature
  const expectedSignature = signature.substring(7); // Remove 'sha256=' prefix
  const hmac = createHmac("sha256", webhookSecret);
  hmac.update(rawBody);
  const calculatedSignature = hmac.digest("hex");

  if (calculatedSignature !== expectedSignature) {
    return res.status(401).json({ error: "Invalid signature" });
  }

  console.log(`GitHub webhook event: ${event}`);

  if (event === "ping") {
    console.log("✅ GitHub App ping received");
    return res.status(200).json({ message: "pong", zen: req.body.zen });
  }

  res.status(200).json({ received: true });
}
