import Stripe from "stripe";

let _stripe: Stripe | null = null;

/**
 * Returns a configured Stripe client, or null when STRIPE_SECRET_KEY is not set.
 * This lets the storefront build and deploy safely before keys are added -
 * checkout simply reports "not configured yet" until the key exists.
 */
export function getStripe(): Stripe | null {
  const key = process.env.STRIPE_SECRET_KEY;
  if (!key) return null;
  if (!_stripe) {
    _stripe = new Stripe(key, {
      appInfo: { name: "Aqualux", url: "https://aqualux.store" },
    });
  }
  return _stripe;
}

export function isStripeConfigured(): boolean {
  return Boolean(process.env.STRIPE_SECRET_KEY);
}
