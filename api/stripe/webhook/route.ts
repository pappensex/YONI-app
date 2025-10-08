import Stripe from "stripe";

export const runtime = "nodejs"; // wichtig für Raw-Body
export const dynamic = "force-dynamic"; // keine Edge-Cache-Fails

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string, {
  apiVersion: "2024-06-20",
});

export async function POST(req: Request) {
  const sig = req.headers.get("stripe-signature");
  if (!sig) return new Response("Missing signature", { status: 400 });

  // Raw body als Text — nicht parsen!
  const rawBody = await req.text();

  let event: Stripe.Event;
  try {
    event = stripe.webhooks.constructEvent(
      rawBody,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET as string
    );
  } catch (err: any) {
    console.error("Signature check failed:", err.message);
    return new Response(`Webhook Error: ${err.message}`, { status: 400 });
  }

  // Minimal: ein paar Events behandeln
  try {
    switch (event.type) {
      case "checkout.session.completed":
        // @ts-ignore
        const session = event.data.object;
        console.log("✅ Checkout completed:", session.id);
        // TODO: Fulfillment/DB/Email
        break;
      case "payment_intent.succeeded":
        // @ts-ignore
        const pi = event.data.object;
        console.log("💰 PI succeeded:", pi.id);
        break;
      default:
        console.log("ℹ️ Unhandled:", event.type);
    }
  } catch (e) {
    console.error("Handler error:", e);
    // trotzdem 200, damit Stripe nicht spammt – intern deduplizieren
  }

  return new Response(JSON.stringify({ received: true }), {
    status: 200,
    headers: { "Content-Type": "application/json" },
  });
}

// Optional: GET für schnellen Browser-Check
export async function GET() {
  return new Response("Webhook endpoint active (use POST from Stripe).", {
    status: 200,
  });
}
