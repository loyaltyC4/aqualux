import Stripe from "stripe";
import { getSupabase } from "./supabase";

export type OrderItemInput = {
  productHandle: string | null;
  sku: string | null;
  title: string;
  quantity: number;
  unitAmount: number;
};

export type OrderInput = {
  stripeSessionId: string;
  stripePaymentIntent: string | null;
  customerEmail: string | null;
  customerName: string | null;
  shippingAddress: Stripe.Address | null | undefined;
  amountSubtotal: number | null;
  amountShipping: number | null;
  amountTotal: number;
  currency: string;
  items: OrderItemInput[];
};

export type Order = {
  id: string;
  stripeSessionId: string;
  customerEmail: string | null;
  customerName: string | null;
  amountTotal: number;
  currency: string;
  status: string;
  createdAt: string;
  items: {
    title: string;
    quantity: number;
    unitAmount: number;
    productHandle: string | null;
  }[];
};

/**
 * Records a paid order + its line items, idempotently (Stripe retries webhooks,
 * so a duplicate delivery of the same session must not create a second order
 * or double-decrement inventory).
 *
 * Returns the order id, or null if Supabase isn't configured yet (deploy-safe -
 * the webhook still acknowledges Stripe so it doesn't retry forever over a
 * config gap on our side).
 */
export async function recordOrder(
  input: OrderInput,
): Promise<{ orderId: string; isNew: boolean } | null> {
  const supabase = getSupabase();
  if (!supabase) return null;

  // Idempotency check first / avoids inserting duplicate items on retry.
  const { data: existing } = await supabase
    .from("fbl_orders")
    .select("id")
    .eq("stripe_session_id", input.stripeSessionId)
    .maybeSingle();

  if (existing) {
    return { orderId: existing.id as string, isNew: false };
  }

  const { data: order, error } = await supabase
    .from("fbl_orders")
    .insert({
      stripe_session_id: input.stripeSessionId,
      stripe_payment_intent: input.stripePaymentIntent,
      customer_email: input.customerEmail,
      customer_name: input.customerName,
      shipping_address: input.shippingAddress || null,
      amount_subtotal: input.amountSubtotal,
      amount_shipping: input.amountShipping,
      amount_total: input.amountTotal,
      currency: input.currency,
    })
    .select("id")
    .single();

  // Unique-constraint race (two webhook deliveries at once) -> treat as existing.
  if (error || !order) {
    const { data: raceExisting } = await supabase
      .from("fbl_orders")
      .select("id")
      .eq("stripe_session_id", input.stripeSessionId)
      .maybeSingle();
    if (raceExisting)
      return { orderId: raceExisting.id as string, isNew: false };
    return null;
  }

  if (input.items.length > 0) {
    await supabase.from("fbl_order_items").insert(
      input.items.map((it) => ({
        order_id: order.id,
        product_handle: it.productHandle,
        sku: it.sku,
        title: it.title,
        quantity: it.quantity,
        unit_amount: it.unitAmount,
      })),
    );
  }

  return { orderId: order.id as string, isNew: true };
}

/** Opt-in decrement: no-op for any SKU that isn't already being tracked. */
export async function decrementInventory(
  items: OrderItemInput[],
): Promise<void> {
  const supabase = getSupabase();
  if (!supabase) return;

  for (const item of items) {
    if (!item.sku) continue;
    await supabase.rpc("fbl_decrement_inventory", {
      p_sku: item.sku,
      p_qty: item.quantity,
    });
  }
}

export async function listRecentOrders(limit = 50): Promise<Order[]> {
  const supabase = getSupabase();
  if (!supabase) return [];

  const { data: orders, error } = await supabase
    .from("fbl_orders")
    .select(
      "id,stripe_session_id,customer_email,customer_name,amount_total,currency,status,created_at",
    )
    .order("created_at", { ascending: false })
    .limit(limit);

  if (error || !orders) return [];

  const orderIds = orders.map((o) => o.id);
  const { data: items } = await supabase
    .from("fbl_order_items")
    .select("order_id,product_handle,title,quantity,unit_amount")
    .in("order_id", orderIds);

  return orders.map((o) => ({
    id: o.id,
    stripeSessionId: o.stripe_session_id,
    customerEmail: o.customer_email,
    customerName: o.customer_name,
    amountTotal: o.amount_total,
    currency: o.currency,
    status: o.status,
    createdAt: o.created_at,
    items: (items || [])
      .filter((it) => it.order_id === o.id)
      .map((it) => ({
        title: it.title,
        quantity: it.quantity,
        unitAmount: it.unit_amount,
        productHandle: it.product_handle,
      })),
  }));
}

export async function getOrdersSummary(): Promise<{
  count: number;
  revenueCents: number;
}> {
  const supabase = getSupabase();
  if (!supabase) return { count: 0, revenueCents: 0 };

  const { data, error } = await supabase
    .from("fbl_orders")
    .select("amount_total");
  if (error || !data) return { count: 0, revenueCents: 0 };

  return {
    count: data.length,
    revenueCents: data.reduce((sum, o) => sum + (o.amount_total || 0), 0),
  };
}
