import { NextRequest, NextResponse } from "next/server";
import { getStripe } from "lib/stripe";
import { staticGetVariant } from "lib/shopify/static-data";
import { baseUrl } from "lib/utils";
import { FREE_SHIPPING_THRESHOLD } from "lib/brand";

export const dynamic = "force-dynamic";

type IncomingLine = { merchandiseId?: string; quantity?: number };

// Reasonable worldwide shipping set (ISO 3166-1 alpha-2).
const ALLOWED_COUNTRIES = [
  "US",
  "CA",
  "GB",
  "IE",
  "AU",
  "NZ",
  "DE",
  "FR",
  "ES",
  "IT",
  "NL",
  "BE",
  "AT",
  "CH",
  "SE",
  "NO",
  "DK",
  "FI",
  "PT",
  "PL",
  "CZ",
  "SK",
  "HU",
  "RO",
  "GR",
  "LU",
  "IS",
  "JP",
  "KR",
  "SG",
  "HK",
  "MY",
  "PH",
  "TH",
  "ZA",
  "AE",
  "SA",
  "IL",
  "MX",
  "BR",
  "CL",
  "AR",
] as const;

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

  let body: { lines?: IncomingLine[] };
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
        ? ` — ${variant.title}`
        : "");
    const images = product.featuredImage?.url
      ? [product.featuredImage.url]
      : [];
    line_items.push({
      quantity: Math.max(1, Math.min(99, Number(l.quantity) || 1)),
      price_data: {
        currency: "usd",
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

  // Free shipping is a real promise, computed from the actual subtotal —
  // not just cosmetic in the cart UI. Keep FREE_SHIPPING_THRESHOLD in sync
  // with lib/brand.ts.
  const subtotalCents = line_items.reduce(
    (sum, li) => sum + li.price_data.unit_amount * li.quantity,
    0,
  );
  const qualifiesForFreeShipping =
    subtotalCents >= FREE_SHIPPING_THRESHOLD * 100;

  const standardShippingOption = qualifiesForFreeShipping
    ? {
        shipping_rate_data: {
          type: "fixed_amount" as const,
          fixed_amount: { amount: 0, currency: "usd" },
          display_name: "Free shipping",
          delivery_estimate: {
            minimum: { unit: "business_day" as const, value: 3 },
            maximum: { unit: "business_day" as const, value: 8 },
          },
        },
      }
    : {
        shipping_rate_data: {
          type: "fixed_amount" as const,
          fixed_amount: { amount: 495, currency: "usd" },
          display_name: "Standard shipping",
          delivery_estimate: {
            minimum: { unit: "business_day" as const, value: 3 },
            maximum: { unit: "business_day" as const, value: 8 },
          },
        },
      };

  try {
    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      line_items,
      billing_address_collection: "auto",
      shipping_address_collection: {
        allowed_countries: [...ALLOWED_COUNTRIES] as any,
      },
      shipping_options: [
        standardShippingOption,
        {
          shipping_rate_data: {
            type: "fixed_amount",
            fixed_amount: { amount: 1295, currency: "usd" },
            display_name: "Express shipping",
            delivery_estimate: {
              minimum: { unit: "business_day", value: 1 },
              maximum: { unit: "business_day", value: 3 },
            },
          },
        },
      ],
      allow_promotion_codes: true,
      success_url: `${origin}/order/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${origin}/search`,
      metadata: { source: "fingerboardlab" },
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
