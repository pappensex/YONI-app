import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';

export const runtime = 'nodejs';

const apiVersion: Stripe.LatestApiVersion = '2024-06-20';

let stripe: Stripe | null = null;

function getStripeOrError() {
  const stripeSecretKey = process.env.STRIPE_SECRET_KEY;

  if (!stripeSecretKey) {
    return {
      error: new NextResponse('Missing STRIPE_SECRET_KEY', { status: 500 })
    } as const;
  }

  if (!stripe) {
    stripe = new Stripe(stripeSecretKey, { apiVersion });
  }

  return { client: stripe } as const;
}

function buildAppUrls() {
  const appUrl = process.env.NEXT_PUBLIC_APP_URL?.trim();

  if (!appUrl) {
    return {
      error: new NextResponse('Missing NEXT_PUBLIC_APP_URL', { status: 500 })
    } as const;
  }

  try {
    const base = new URL(appUrl);

    return {
      successUrl: new URL('/success', base).toString(),
      cancelUrl: new URL('/cancel', base).toString()
    } as const;
  } catch {
    return {
      error: new NextResponse('Invalid NEXT_PUBLIC_APP_URL', { status: 500 })
    } as const;
  }
}

export async function POST(req: NextRequest) {
  try {
    const stripeResult = getStripeOrError();
    if ('error' in stripeResult) {
      return stripeResult.error;
    }

    const urlResult = buildAppUrls();
    if ('error' in urlResult) {
      return urlResult.error;
    }

    const body = await req.json();

    const session = await stripeResult.client.checkout.sessions.create({
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

      success_url: urlResult.successUrl,
      cancel_url: urlResult.cancelUrl,
      metadata: body?.metadata || {}
    });

    return NextResponse.json({ url: session.url });

  } catch (err: any) {
    console.error('❌ Error creating checkout session:', err);
    return new NextResponse(`Error: ${err.message}`, { status: 400 });
  }
}
