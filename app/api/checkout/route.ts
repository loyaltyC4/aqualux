import { NextRequest, NextResponse } from "next/server";
import { getStripe } from "lib/stripe";
import { staticGetVariant } from "lib/shopify/static-data";
import { baseUrl } from "lib/utils";
import { CURRENCY } from "lib/brand";
import {
  ALLOWED_COUNTRIES,
  DISPATCH_MAX_DAYS,
  DISPATCH_MIN_DAYS,
  zoneForCountry,
} from "lib/shipping";

export const dynamic = "force-dynamic";

type IncomingLine = { merchandiseId?: string; quantity?: number };
/** Destination country, so we quote the right zone rather than a global average. */
type CheckoutBody = { lines?: IncomingLine[]; country?: string };

// Zones, rates and delivery windows all come from lib/shipping so the rate a
// buyer is CHARGED and the estimate they are SHOWN can never diverge. They
// previously did: the policy page said 8-15 business days while this file
// offered "Standard 3-8" and an "Express 1-3" that cannot be bought on a
// China-origin lane at all.

export async function POST(req: NextRequest) {
  const stripe = getStripe();

  // Deploy-safe: no keys yet → tell the client clearly instead of 500ing.
  if (!stripe) {
    return NextResponse.json(
      {
        error: "checkout_unconfigured",
        message:
          "Checkout is not live yet. Add STRIPE_SECRET_KEY to enable card payments.",
      },
      { status: 503 },
    );
  }

  let body: CheckoutBody;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "invalid_body" }, { status: 400 });
  }

  const lines = Array.isArray(body.lines) ? body.lines : [];
  if (!lines.length) {
    return NextResponse.json({ error: "empty_cart" }, { status: 400 });
  }

  const line_items: {
    quantity: number;
    price_data: {
      currency: string;
      unit_amount: number;
      product_data: {
        name: string;
        images?: string[];
        metadata?: Record<string, string>;
      };
    };
  }[] = [];

  for (const l of lines) {
    if (!l.merchandiseId) continue;
    const found = staticGetVariant(l.merchandiseId);
    if (!found) continue;
    const { product, variant } = found;
    const unit_amount = Math.round(parseFloat(variant.price.amount) * 100);
    if (!unit_amount || unit_amount < 0) continue;
    const name =
      product.title +
      (variant.title && variant.title !== "Default Title"
        ? `, ${variant.title}`
        : "");
    const images = product.featuredImage?.url
      ? [product.featuredImage.url]
      : [];
    line_items.push({
      quantity: Math.max(1, Math.min(99, Number(l.quantity) || 1)),
      price_data: {
        currency: "aud",
        unit_amount,
        product_data: {
          name: name.slice(0, 250),
          images,
          metadata: { handle: product.handle, sku: variant.sku || "" },
        },
      },
    });
  }

  if (!line_items.length) {
    return NextResponse.json({ error: "no_valid_items" }, { status: 400 });
  }

  const origin = req.headers.get("origin") || baseUrl;

  // Free shipping is a real promise, computed from the actual subtotal — not
  // just cosmetic in the cart UI. The threshold is now PER ZONE (lib/shipping),
  // because freight to Europe costs meaningfully more than freight to Australia
  // and a single global threshold would subsidise the far zones out of margin.
  const subtotalCents = line_items.reduce(
    (sum, li) => sum + li.price_data.unit_amount * li.quantity,
    0,
  );

  // One option per zone the destination belongs to. Stripe fixes shipping
  // options at session creation, before it knows the address, so we resolve the
  // zone from the country the client sends and fall back to the primary market.
  const zone = zoneForCountry(body.country);
  const freeThisZone = subtotalCents >= zone.freeOver * 100;
  const cur = CURRENCY.toLowerCase();

  const shippingOptions = [
    {
      shipping_rate_data: {
        type: "fixed_amount" as const,
        fixed_amount: {
          amount: freeThisZone ? 0 : Math.round(zone.rate * 100),
          currency: cur,
        },
        display_name: freeThisZone
          ? `Free shipping to ${zone.label}`
          : `Tracked shipping to ${zone.label}`,
        delivery_estimate: {
          // Dispatch plus transit — the window the buyer actually experiences.
          minimum: {
            unit: "business_day" as const,
            value: zone.minDays + DISPATCH_MIN_DAYS,
          },
          maximum: {
            unit: "business_day" as const,
            value: zone.maxDays + DISPATCH_MAX_DAYS,
          },
        },
      },
    },
  ];

  try {
    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      line_items,
      billing_address_collection: "auto",
      shipping_address_collection: {
        allowed_countries: [...ALLOWED_COUNTRIES] as any,
      },
      shipping_options: shippingOptions,
      allow_promotion_codes: true,
      success_url: `${origin}/order/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${origin}/search`,
      metadata: { source: "aqualux" },
    });

    return NextResponse.json({ url: session.url });
  } catch (err) {
    console.error("Stripe checkout error:", err);
    return NextResponse.json(
      { error: "stripe_error", message: "Could not start checkout." },
      { status: 500 },
    );
  }
}
