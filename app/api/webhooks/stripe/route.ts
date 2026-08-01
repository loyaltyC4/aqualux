import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";
import { getStripe } from "lib/stripe";
import {
  decrementInventory,
  recordOrder,
  type OrderItemInput,
} from "lib/orders";
import { sendOrderConfirmationEmail } from "lib/email";

export const dynamic = "force-dynamic";

function extractItems(
  lineItems: Stripe.ApiList<Stripe.LineItem> | undefined,
): OrderItemInput[] {
  if (!lineItems) return [];
  return lineItems.data.map((li) => {
    const product = li.price?.product;
    const isExpandedProduct =
      product &&
      typeof product === "object" &&
      !("deleted" in product && product.deleted);
    const metadata = isExpandedProduct
      ? (product as Stripe.Product).metadata
      : undefined;

    return {
      productHandle: metadata?.handle || null,
      sku: metadata?.sku || null,
      title: li.description || "Item",
      quantity: li.quantity || 1,
      unitAmount: li.price?.unit_amount ?? 0,
    };
  });
}

export async function POST(req: NextRequest) {
  const stripe = getStripe();
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

  // Deploy-safe: no webhook secret configured yet — tell whoever's testing
  // this clearly instead of throwing. Stripe will retry once it's set up.
  if (!stripe || !webhookSecret) {
    return NextResponse.json(
      {
        error: "webhook_unconfigured",
        message:
          "Stripe webhook isn't configured yet. Add STRIPE_WEBHOOK_SECRET.",
      },
      { status: 503 },
    );
  }

  const signature = req.headers.get("stripe-signature");
  const rawBody = await req.text();

  let event: Stripe.Event;
  try {
    event = stripe.webhooks.constructEvent(
      rawBody,
      signature || "",
      webhookSecret,
    );
  } catch (err) {
    console.error("Stripe webhook signature verification failed:", err);
    return NextResponse.json({ error: "invalid_signature" }, { status: 400 });
  }

  if (event.type !== "checkout.session.completed") {
    // Acknowledge everything else — we only act on completed checkouts.
    return NextResponse.json({ received: true });
  }

  const sessionSummary = event.data.object as Stripe.Checkout.Session;

  let session: Stripe.Checkout.Session;
  try {
    session = await stripe.checkout.sessions.retrieve(sessionSummary.id, {
      expand: ["line_items", "line_items.data.price.product"],
    });
  } catch (err) {
    console.error("Failed to retrieve checkout session:", err);
    return NextResponse.json(
      { error: "session_retrieve_failed" },
      { status: 500 },
    );
  }

  const items = extractItems(session.line_items);
  const shippingAddress =
    (session as any).shipping_details?.address ??
    (session as any).collected_information?.shipping_details?.address ??
    session.customer_details?.address ??
    null;

  const result = await recordOrder({
    stripeSessionId: session.id,
    stripePaymentIntent:
      typeof session.payment_intent === "string"
        ? session.payment_intent
        : null,
    customerEmail: session.customer_details?.email || null,
    customerName: session.customer_details?.name || null,
    shippingAddress,
    amountSubtotal: session.amount_subtotal ?? null,
    amountShipping: session.total_details?.amount_shipping ?? null,
    amountTotal: session.amount_total ?? 0,
    currency: session.currency || "usd",
    items,
  });

  if (!result) {
    // Supabase not configured — acknowledge Stripe (avoid endless retries
    // over a config gap on our side) but make it loud in server logs.
    console.warn(
      "Order not recorded: Supabase isn't configured (SUPABASE_URL/SUPABASE_SERVICE_ROLE_KEY).",
    );
    return NextResponse.json({ received: true, recorded: false });
  }

  if (result.isNew) {
    await decrementInventory(items);
    await sendOrderConfirmationEmail({
      to: session.customer_details?.email || null,
      orderId: result.orderId,
      items: items.map((it) => ({
        title: it.title,
        quantity: it.quantity,
        unitAmount: it.unitAmount,
      })),
      amountTotal: session.amount_total ?? 0,
      currency: session.currency || "usd",
    });
  }

  return NextResponse.json({ received: true, orderId: result.orderId });
}
