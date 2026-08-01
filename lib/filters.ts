import type { Product } from "lib/shopify/types";

/* ------------------------------------------------------------------ *
 * Facets are derived from real title text, never hand-tagged, so they
 * cannot drift out of sync with the catalog. Only facet values that
 * actually occur in a product set are ever rendered (see availableFacets).
 * ------------------------------------------------------------------ */

export type SizeBucket = "nano" | "20to30" | "36plus";

export const SIZE_LABELS: Record<SizeBucket, string> = {
  nano: "Nano tanks",
  "20to30": "Fits 20in to 30in",
  "36plus": "Fits 36in and up",
};

/**
 * Tank-length fit, parsed from inch measurements in the title
 * (for example "20in", "36-48in"). Products with no length in the
 * title are size-agnostic and match no size bucket.
 */
export function sizeBucketsFor(title: string): SizeBucket[] {
  const t = title.toLowerCase();
  const buckets = new Set<SizeBucket>();

  if (/\bnano\b/.test(t)) buckets.add("nano");

  const nums = Array.from(t.matchAll(/(\d{2})\s*(?:in\b|inch|")/g)).map((m) =>
    parseInt(m[1]!, 10),
  );
  for (const n of nums) {
    if (n < 20) buckets.add("nano");
    else if (n <= 30) buckets.add("20to30");
    else buckets.add("36plus");
  }
  return [...buckets];
}

export type GearType =
  | "LED Lighting"
  | "Controllers"
  | "CO2 Regulators"
  | "CO2 Diffusers"
  | "Scissors & Tweezers"
  | "Cleaning"
  | "Substrate"
  | "Stone & Wood"
  | "Test Kits & Meters"
  | "Bundles"
  | "Accessories";

/** Sub-type within a collection, derived from real title text. */
export function gearTypeFor(title: string): GearType {
  const t = title.toLowerCase();

  if (t.includes("bundle") || t.includes("complete")) return "Bundles";
  if (t.includes("timer") || t.includes("controller")) return "Controllers";
  if (t.includes("led") || t.includes("grow light") || t.includes("light"))
    return "LED Lighting";
  if (t.includes("regulator") || t.includes("solenoid")) return "CO2 Regulators";
  if (t.includes("diffuser") || t.includes("atomiser") || t.includes("atomizer"))
    return "CO2 Diffusers";
  if (t.includes("scissor") || t.includes("tweezer")) return "Scissors & Tweezers";
  if (t.includes("cleaner") || t.includes("scraper") || t.includes("maintenance"))
    return "Cleaning";
  if (t.includes("soil") || t.includes("sand") || t.includes("substrate"))
    return "Substrate";
  if (t.includes("stone") || t.includes("wood") || t.includes("rock"))
    return "Stone & Wood";
  if (
    t.includes("test") ||
    t.includes("meter") ||
    t.includes("checker") ||
    t.includes("ph")
  )
    return "Test Kits & Meters";
  if (t.includes("tool set") || t.includes("kit")) return "Bundles";
  return "Accessories";
}

/* Buckets tuned to the real catalog spread ($24 to $169, median $39). */
export type PriceBucket = "under30" | "30to50" | "50to100" | "over100";

export const PRICE_LABELS: Record<PriceBucket, string> = {
  under30: "Under $30",
  "30to50": "$30 to $50",
  "50to100": "$50 to $100",
  over100: "$100+",
};

export function priceBucketFor(amount: number): PriceBucket {
  if (amount < 30) return "under30";
  if (amount < 50) return "30to50";
  if (amount < 100) return "50to100";
  return "over100";
}

export type ProductFilters = {
  sizes?: SizeBucket[];
  types?: GearType[];
  prices?: PriceBucket[];
};

export function parseFiltersFromSearchParams(sp: {
  [key: string]: string | string[] | undefined;
}): ProductFilters {
  const toArr = (v: string | string[] | undefined) =>
    !v ? [] : Array.isArray(v) ? v : v.split(",").filter(Boolean);
  return {
    sizes: toArr(sp.size) as SizeBucket[],
    types: toArr(sp.type) as GearType[],
    prices: toArr(sp.price) as PriceBucket[],
  };
}

export function applyFilters(
  products: Product[],
  filters: ProductFilters,
): Product[] {
  let out = products;
  if (filters.sizes?.length) {
    out = out.filter((p) =>
      sizeBucketsFor(p.title).some((s) => filters.sizes!.includes(s)),
    );
  }
  if (filters.types?.length) {
    out = out.filter((p) => filters.types!.includes(gearTypeFor(p.title)));
  }
  if (filters.prices?.length) {
    out = out.filter((p) =>
      filters.prices!.includes(
        priceBucketFor(parseFloat(p.priceRange.minVariantPrice.amount)),
      ),
    );
  }
  return out;
}

/** Which facet values actually occur in this product set (so we never show empty filters). */
export function availableFacets(products: Product[]) {
  const sizes = new Set<SizeBucket>();
  const types = new Set<GearType>();
  const prices = new Set<PriceBucket>();
  for (const p of products) {
    sizeBucketsFor(p.title).forEach((s) => sizes.add(s));
    types.add(gearTypeFor(p.title));
    prices.add(priceBucketFor(parseFloat(p.priceRange.minVariantPrice.amount)));
  }
  return { sizes: [...sizes], types: [...types], prices: [...prices] };
}
