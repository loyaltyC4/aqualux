import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import Link from "next/link";
import type { Metadata } from "next";
import {
  ADMIN_COOKIE_NAME,
  adminCookieToken,
  isAdminConfigured,
} from "lib/admin-auth";
import { getOrdersSummary, listRecentOrders } from "lib/orders";
import { isSupabaseConfigured } from "lib/supabase";
import { LogoutButton } from "components/admin/logout-button";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Orders / Admin",
  robots: { index: false, follow: false },
};

function money(cents: number, currency = "usd") {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: currency.toUpperCase(),
  }).format(cents / 100);
}

export default async function AdminOrdersPage() {
  if (!isAdminConfigured()) {
    return (
      <div className="mx-auto max-w-xl px-6 py-24 text-center">
        <h1 className="text-2xl font-semibold text-[#eceae4]">
          Admin area isn&apos;t set up yet
        </h1>
        <p className="mt-3 text-neutral-400">
          Add an <code className="text-[#f2a93b]">ADMIN_ACCESS_KEY</code>{" "}
          environment variable (any password you choose) to enable this page.
        </p>
      </div>
    );
  }

  const cookieStore = await cookies();
  const token = cookieStore.get(ADMIN_COOKIE_NAME)?.value;
  if (!token || token !== adminCookieToken()) {
    redirect("/admin/login");
  }

  const [orders, summary] = await Promise.all([
    listRecentOrders(),
    getOrdersSummary(),
  ]);

  return (
    <div className="mx-auto max-w-5xl px-6 py-14 md:py-20">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-[#eceae4] md:text-3xl">
            Orders
          </h1>
          <p className="mt-1 text-sm text-neutral-500">
            Recorded automatically from the Stripe webhook.
          </p>
        </div>
        <LogoutButton />
      </div>

      {!isSupabaseConfigured() && (
        <div className="mb-8 rounded-2xl border border-[#f2a93b]/30 bg-[#f2a93b]/5 p-4 text-sm text-neutral-300">
          Supabase isn&apos;t configured yet / orders can&apos;t be recorded
          until <code className="text-[#f2a93b]">SUPABASE_URL</code> and{" "}
          <code className="text-[#f2a93b]">SUPABASE_SERVICE_ROLE_KEY</code> are
          set.
        </div>
      )}

      <div className="mb-10 grid grid-cols-2 gap-4 md:grid-cols-3">
        <div className="rounded-2xl border border-white/10 bg-[#0d1618] p-5">
          <div className="text-2xl font-semibold text-[#f2a93b]">
            {summary.count}
          </div>
          <div className="mt-1 text-sm text-neutral-400">Total orders</div>
        </div>
        <div className="rounded-2xl border border-white/10 bg-[#0d1618] p-5">
          <div className="text-2xl font-semibold text-[#f2a93b]">
            {money(summary.revenueCents)}
          </div>
          <div className="mt-1 text-sm text-neutral-400">Total revenue</div>
        </div>
        <div className="rounded-2xl border border-white/10 bg-[#0d1618] p-5">
          <div className="text-2xl font-semibold text-[#f2a93b]">
            {orders[0]
              ? new Date(orders[0].createdAt).toLocaleDateString()
              : "-"}
          </div>
          <div className="mt-1 text-sm text-neutral-400">Last order</div>
        </div>
      </div>

      {orders.length === 0 ? (
        <p className="text-neutral-400">
          No orders yet. They&apos;ll show up here the moment a checkout
          completes.
        </p>
      ) : (
        <div className="overflow-hidden rounded-2xl border border-white/10">
          {orders.map((o) => (
            <details
              key={o.id}
              className="group border-b border-white/10 last:border-b-0"
            >
              <summary className="flex cursor-pointer list-none items-center justify-between gap-4 bg-[#0d1618] px-5 py-4 hover:bg-white/[0.02]">
                <div className="min-w-0">
                  <p className="truncate text-sm font-medium text-[#eceae4]">
                    {o.customerEmail || "Unknown customer"}
                  </p>
                  <p className="text-xs text-neutral-500">
                    {new Date(o.createdAt).toLocaleString()} · {o.items.length}{" "}
                    item{o.items.length === 1 ? "" : "s"}
                  </p>
                </div>
                <span className="shrink-0 font-semibold text-[#f2a93b]">
                  {money(o.amountTotal, o.currency)}
                </span>
              </summary>
              <div className="bg-[#060d0e] px-5 py-4">
                <ul className="space-y-2">
                  {o.items.map((it, i) => (
                    <li key={i} className="flex justify-between text-sm">
                      <span className="text-neutral-300">
                        {it.title} × {it.quantity}
                        {it.productHandle ? (
                          <Link
                            href={`/product/${it.productHandle}`}
                            className="ml-2 text-xs text-neutral-500 hover:text-[#f2a93b]"
                          >
                            view →
                          </Link>
                        ) : null}
                      </span>
                      <span className="text-neutral-400">
                        {money(it.unitAmount * it.quantity, o.currency)}
                      </span>
                    </li>
                  ))}
                </ul>
                <p className="mt-3 text-xs text-neutral-500">
                  Stripe session: {o.stripeSessionId}
                </p>
              </div>
            </details>
          ))}
        </div>
      )}
    </div>
  );
}
