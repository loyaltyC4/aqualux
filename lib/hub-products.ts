import { staticGetProducts } from "lib/shopify/static-data";
import type { Product } from "lib/shopify/types";
import { HUBS, type Hub } from "lib/seo-hubs";

/** Live catalogue products for a hub, in the hub's own order. Handles that no longer exist are dropped. */
export function hubProducts(hub: Hub): Product[] {
  const all = staticGetProducts({});
  const by = new Map(all.map((p) => [p.handle, p] as const));
  return hub.handles.map((h) => by.get(h)).filter((p): p is Product => !!p && p.availableForSale);
}

/** A hub renders (and is listed in the sitemap) only with at least 3 live products. */
export function liveHubs(): Hub[] {
  return HUBS.filter((h) => hubProducts(h).length >= 3);
}
