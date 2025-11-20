import { createHmac } from "crypto";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/**
 * Verifies the GitHub webhook signature using HMAC SHA256
 */
function verifyGitHubSignature(
  payload: string,
  signature: string,
  secret: string,
): boolean {
  if (!signature || !signature.startsWith("sha256=")) {
    return false;
  }

  const expectedSignature = signature.substring(7); // Remove 'sha256=' prefix
  const hmac = createHmac("sha256", secret);
  hmac.update(payload);
  const calculatedSignature = hmac.digest("hex");

  // Use timing-safe comparison to prevent timing attacks
  return (
    calculatedSignature.length === expectedSignature.length &&
    createHmac("sha256", secret).update(calculatedSignature).digest("hex") ===
      createHmac("sha256", secret).update(expectedSignature).digest("hex")
  );
}

export async function POST(req: Request) {
  const signature = req.headers.get("x-hub-signature-256");
  const event = req.headers.get("x-github-event");

  if (!signature) {
    return new Response("Missing x-hub-signature-256 header", { status: 400 });
  }

  const rawBody = await req.text();
  const webhookSecret = process.env.GITHUB_WEBHOOK_SECRET;

  if (!webhookSecret) {
    console.error("GITHUB_WEBHOOK_SECRET is not configured");
    return new Response("Webhook secret not configured", { status: 500 });
  }

  // Verify the webhook signature
  const isValid = verifyGitHubSignature(rawBody, signature, webhookSecret);

  if (!isValid) {
    return new Response("Invalid signature", { status: 401 });
  }

  // Parse the payload
  let payload: any;
  try {
    payload = JSON.parse(rawBody);
  } catch (err) {
    return new Response("Invalid JSON payload", { status: 400 });
  }

  // Handle different event types
  console.log(`GitHub webhook event: ${event}`);

  switch (event) {
    case "ping":
      console.log("✅ GitHub App ping received");
      return new Response(
        JSON.stringify({ message: "pong", zen: payload.zen }),
        {
          status: 200,
          headers: { "Content-Type": "application/json" },
        },
      );

    case "push":
      console.log("📦 Push event:", payload.repository?.full_name);
      break;

    case "pull_request":
      console.log(
        "🔀 Pull Request:",
        payload.action,
        payload.pull_request?.number,
      );
      break;

    case "issues":
      console.log("📝 Issue:", payload.action, payload.issue?.number);
      break;

    default:
      console.log("Unhandled GitHub event:", event);
  }

  return new Response(JSON.stringify({ received: true }), {
    status: 200,
    headers: { "Content-Type": "application/json" },
  });
}

export async function GET() {
  return new Response(
    "GitHub App webhook endpoint active (use POST with valid signature).",
    {
      status: 200,
    },
  );
}
