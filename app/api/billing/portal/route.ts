import { NextRequest, NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth";
import { getStripeClient } from "@/lib/stripe";

function ensureAppUrl() {
  return process.env.APP_URL ?? "http://localhost:3000";
}

export async function POST(request: NextRequest) {
  const user = await getCurrentUser(request);

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  if (!user.stripeCustomerId) {
    return NextResponse.json(
      { error: "No Stripe customer for user" },
      { status: 400 }
    );
  }

  try {
    const stripe = getStripeClient();
    const returnUrl = ensureAppUrl();

    const session = await stripe.billingPortal.sessions.create({
      customer: user.stripeCustomerId,
      return_url: `${returnUrl}/billing`
    });

    return NextResponse.json({ url: session.url });
  } catch (error: any) {
    console.error("Error creating billing portal session", error);
    return NextResponse.json(
      { error: "Billing portal failed", detail: error?.message },
      { status: 500 }
    );
  }
}
