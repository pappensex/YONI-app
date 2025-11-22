import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";

export const runtime = "nodejs";

function getStripeClient() {
  const stripeSecretKey = process.env.STRIPE_SECRET_KEY;

  if (!stripeSecretKey) {
    throw new Error("STRIPE_SECRET_KEY is not configured");
  }

  return new Stripe(stripeSecretKey, { apiVersion: "2024-06-20" });
}

export async function POST(req: NextRequest) {
  try {
    const stripe = getStripeClient();
    const body = await req.json();

    const session = await stripe.checkout.sessions.create({
      mode: "payment",

      line_items: [
        {
          price_data: {
            currency: "eur",
            product_data: {
              name: "YONI Support Access",
            },
            unit_amount: 1111, // €11,11
          },
          quantity: 1,
        },
      ],

      success_url: `${process.env.NEXT_PUBLIC_APP_URL}/success`,
      cancel_url: `${process.env.NEXT_PUBLIC_APP_URL}/cancel`,
      metadata: body?.metadata || {},
    });

    return NextResponse.json({ url: session.url });
  } catch (err: any) {
    console.error("❌ Error creating checkout session:", err);
    return new NextResponse(`Error: ${err.message}`, { status: 400 });
  }
}
