import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const stripeSecretKey = process.env.STRIPE_SECRET_KEY!;
const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET!;

const stripe = new Stripe(stripeSecretKey, { apiVersion: "2024-06-20" });

async function getRawBody(req: NextRequest): Promise<Buffer> {
  const chunks: Uint8Array[] = [];
  const reader = req.body?.getReader();
  if (!reader) return Buffer.from("");
  while (true) {
    const { done, value } = await reader.read();
    if (done) break;
    if (value) chunks.push(value);
  }
  return Buffer.concat(chunks.map((c) => Buffer.from(c)));
}

export async function POST(req: NextRequest) {
  let event: Stripe.Event;
  try {
    const sig = req.headers.get("stripe-signature");
    if (!sig)
      return new NextResponse("Missing Stripe-Signature header", {
        status: 400,
      });
    const rawBody = await getRawBody(req);
    event = stripe.webhooks.constructEvent(rawBody, sig, webhookSecret);
  } catch (err: any) {
    console.error("❌ Webhook verification failed:", err);
    return new NextResponse(`Webhook Error: ${err.message}`, { status: 400 });
  }
  try {
    switch (event.type) {
      case "checkout.session.completed": {
        const session = event.data.object as Stripe.Checkout.Session;
        console.log("✅ Checkout completed:", session.id);
        break;
      }
      case "payment_intent.succeeded": {
        const intent = event.data.object as Stripe.PaymentIntent;
        console.log("💰 Payment succeeded:", intent.id);
        break;
      }
      default: {
        console.log(`ℹ️ Unhandled event: ${event.type}`);
      }
    }
    return new NextResponse("Webhook received", { status: 200 });
  } catch (error) {
    console.error("❌ Error handling webhook:", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}

export async function GET() {
  return new NextResponse("Webhook endpoint active", { status: 200 });
}
