import Stripe from "stripe";

const STRIPE_API_VERSION: Stripe.LatestApiVersion = "2024-06-20";

function getStripeSecretKey() {
  const key = process.env.STRIPE_SECRET_KEY;

  if (!key) {
    throw new Error("STRIPE_SECRET_KEY is not configured");
  }

  return key;
}

export function getStripeClient() {
  const secret = getStripeSecretKey();
  return new Stripe(secret, { apiVersion: STRIPE_API_VERSION });
}
