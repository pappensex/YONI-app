import Stripe from "stripe";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const stripeSecretKey = process.env.STRIPE_SECRET_KEY;
const stripe = stripeSecretKey
  ? new Stripe(stripeSecretKey, {
      apiVersion: "2023-10-16",
    })
  : null;

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// 🔒 WEBHOOK DEDUPLICATION (IDEMPOTENCY)
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// Stripe may send the same webhook event multiple times (network retries,
// failures, etc.). To prevent duplicate processing, we track event IDs.
//
// ⚠️ CURRENT IMPLEMENTATION: In-memory cache (dev/prototype only)
// - Works for single-instance deployments
// - Lost on cold starts / restarts
// - Not suitable for production with multiple instances
//
// 📋 PRODUCTION TODO: Replace with persistent storage
// Options:
// - Redis (fast, TTL support): SETEX event_id 86400 "processed"
// - Database (Supabase, PostgreSQL): events table with event_id UNIQUE
// - Vercel KV: await kv.set(`stripe:event:${id}`, true, { ex: 86400 })
// - Upstash Redis: serverless-friendly, global replication
//
// TTL Recommendation: 24-72 hours (Stripe retries for ~3 days)
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

const processedEvents = new Map<string, number>();
const EVENT_RETENTION_MS = 24 * 60 * 60 * 1000; // 24 hours

/**
 * Check if event was already processed (idempotency check)
 * Returns true if event is duplicate, false if new
 */
function isDuplicateEvent(eventId: string): boolean {
  const processed = processedEvents.get(eventId);
  if (processed && Date.now() - processed < EVENT_RETENTION_MS) {
    return true; // Duplicate within retention window
  }
  return false;
}

/**
 * Mark event as processed and cleanup old entries
 */
function markEventProcessed(eventId: string): void {
  processedEvents.set(eventId, Date.now());
  
  // Cleanup: Remove events older than retention period
  // (Prevents unbounded memory growth in long-running instances)
  const cutoff = Date.now() - EVENT_RETENTION_MS;
  for (const [id, timestamp] of processedEvents.entries()) {
    if (timestamp < cutoff) {
      processedEvents.delete(id);
    }
  }
}

export async function POST(req: Request) {
  if (!stripe) {
    return new Response("Stripe not configured", { status: 500 });
  }
  
  const sig = req.headers.get("stripe-signature");
  if (!sig) return new Response("Missing signature", { status: 400 });
  
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;
  if (!webhookSecret) {
    return new Response("Webhook secret not configured", { status: 500 });
  }
  
  const rawBody = await req.text();

  let event: Stripe.Event;
  try {
    event = stripe.webhooks.constructEvent(
      rawBody,
      sig,
      webhookSecret
    );
  } catch (err: any) {
    return new Response(`Webhook Error: ${err.message}`, { status: 400 });
  }

  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  // 🔒 IDEMPOTENCY CHECK: Prevent duplicate event processing
  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  if (isDuplicateEvent(event.id)) {
    console.log(`⚠️  Duplicate event ignored: ${event.type} (${event.id})`);
    // Return 200 to acknowledge receipt (prevents Stripe retries)
    return new Response(JSON.stringify({ received: true, duplicate: true }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  }

  // Mark event as processed BEFORE handling (crash-safety)
  markEventProcessed(event.id);

  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  // 🎯 EVENT PROCESSING (now idempotent)
  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  switch (event.type) {
    case "checkout.session.completed":
      console.log("✅ Checkout completed:", event.data.object.id, `(event: ${event.id})`);
      // TODO: Update database, send confirmation email, etc.
      break;
    case "payment_intent.succeeded":
      console.log("💰 Payment succeeded:", event.data.object.id, `(event: ${event.id})`);
      // TODO: Fulfill order, update subscription status, etc.
      break;
    default:
      console.log(`ℹ️  Unhandled event: ${event.type} (${event.id})`);
  }

  return new Response(JSON.stringify({ received: true }), {
    status: 200,
    headers: { "Content-Type": "application/json" },
  });
}

export async function GET() {
  return new Response("Webhook endpoint active (use POST from Stripe).", {
    status: 200,
  });
}
