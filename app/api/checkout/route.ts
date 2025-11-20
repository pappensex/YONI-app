import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';

export const runtime = 'nodejs';

export async function POST(req: NextRequest) {
  try {
    const stripeSecretKey = process.env.STRIPE_SECRET_KEY;
    const appUrl = process.env.NEXT_PUBLIC_APP_URL;

    if (!stripeSecretKey) {
      return new NextResponse('Missing STRIPE_SECRET_KEY environment variable.', {
        status: 503,
      });
    }

    if (!appUrl) {
      return new NextResponse('Missing NEXT_PUBLIC_APP_URL environment variable.', {
        status: 503,
      });
    }

    const successUrl = `${appUrl}/success`;
    const cancelUrl = `${appUrl}/cancel`;


    const stripe = new Stripe(stripeSecretKey, { apiVersion: '2024-06-20' });

    const body = await req.json();

    const session = await stripe.checkout.sessions.create({
      mode: 'payment',

      line_items: [
        {
          price_data: {
            currency: 'eur',
            product_data: {
              name: "YONI Support Access",
            },
            unit_amount: 1111, // €11,11
          },
          quantity: 1,
        },
      ],

      success_url: successUrl,
      cancel_url: cancelUrl,
      metadata: body?.metadata || {}
    });

    return NextResponse.json({ url: session.url });

  } catch (err: any) {
    console.error('❌ Error creating checkout session:', err);
    return new NextResponse(`Error: ${err.message}`, { status: 400 });
  }
}
