import { NextRequest, NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth";
import prisma from "@/lib/db";
import { getStripeClient } from "@/lib/stripe";

function ensureConfig() {
  const priceId = process.env.STRIPE_CREATOR_PRICE_ID;
  const appUrl = process.env.APP_URL ?? "http://localhost:3000";

  if (!priceId) {
    throw new Error("STRIPE_CREATOR_PRICE_ID is not configured");
  }

  return { priceId, appUrl };
}

export async function POST(request: NextRequest) {
  let user = await getCurrentUser(request);

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const stripe = getStripeClient();
    const { priceId, appUrl } = ensureConfig();

    if (!user.stripeCustomerId) {
      const customer = await stripe.customers.create({
        email: user.email,
        name: user.name ?? undefined,
        metadata: { userId: user.id }
      });

      user = await prisma.user.update({
        where: { id: user.id },
        data: { stripeCustomerId: customer.id }
      });
    }

    const session = await stripe.checkout.sessions.create(
      {
        mode: "subscription",
        customer: user.stripeCustomerId ?? undefined,
        success_url: `${appUrl}/billing/success`,
        cancel_url: `${appUrl}/billing/cancel`,
        allow_promotion_codes: true,
        line_items: [
          {
            price: priceId,
            quantity: 1
          }
        ],
        subscription_data: {
          metadata: { userId: user.id }
        },
        metadata: { userId: user.id }
      },
      { idempotencyKey: `${user.id}:creator-checkout` }
    );

    if (!session.url) {
      throw new Error("Checkout Session URL missing");
    }

    return NextResponse.json({ url: session.url });
  } catch (error: any) {
    console.error("Error creating checkout session", error);
    return NextResponse.json(
      { error: "Billing checkout failed", detail: error?.message },
      { status: 500 }
    );
  }
}
