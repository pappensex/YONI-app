import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";
import prisma from "@/lib/db";
import { getStripeClient } from "@/lib/stripe";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

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
    const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

    if (!webhookSecret) {
      throw new Error("STRIPE_WEBHOOK_SECRET is not configured");
    }

    const stripe = getStripeClient();
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
        const customerId =
          typeof session.customer === "string"
            ? session.customer
            : session.customer?.id;
        const subscriptionId =
          typeof session.subscription === "string"
            ? session.subscription
            : session.subscription?.id;

        if (customerId) {
          await prisma.user.updateMany({
            where: { stripeCustomerId: customerId },
            data: {
              role: "CREATOR",
              stripeSubscription: subscriptionId ?? null
            }
          });
        }

        console.log("✅ Checkout completed:", session.id);
        break;
      }
      case "customer.subscription.updated": {
        const subscription = event.data.object as Stripe.Subscription;
        const status = subscription.status;
        const customerId =
          typeof subscription.customer === "string"
            ? subscription.customer
            : subscription.customer?.id;

        if (customerId) {
          const isActive =
            status === "active" || status === "trialing" || status === "past_due";

          await prisma.user.updateMany({
            where: { stripeCustomerId: customerId },
            data: {
              role: isActive ? "CREATOR" : "USER",
              stripeSubscription: isActive ? subscription.id : null
            }
          });
        }

        console.log("🔄 Subscription updated:", subscription.id, status);
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
