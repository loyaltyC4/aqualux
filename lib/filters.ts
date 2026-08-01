import type { Product } from "lib/shopify/types";

export type WidthBucket = "32" | "34" | "36" | "multi";

export const WIDTH_LABELS: Record<WidthBucket, string> = {
  "32": "32mm",
  "34": "34mm",
  "36": "36mm",
  multi: "Multi-width",
};

/** Deck/truck width buckets a product's title matches, derived from real title text. */
export function widthBucketsFor(title: string): WidthBucket[] {
  const t = title.toLowerCase();
  const nums = Array.from(t.matchAll(/(\d{2})(?:\.\d)?\s*mm/g)).map((m) =>
    parseInt(m[1]!, 10),
  );
  const buckets = new Set<WidthBucket>();
  const isMulti = /multi[- ]?width/.test(t) || nums.length > 1;
  for (const n of nums) {
    if (n === 32) buckets.add("32");
    else if (n === 34) buckets.add("34");
    else if (n === 36) buckets.add("36");
  }
  if (isMulti && buckets.size > 0) buckets.add("multi");
  if (buckets.size === 0 && isMulti) buckets.add("multi");
  return [...buckets];
}

export type HardwareType =
  | "Trucks"
  | "Wheels"
  | "Bearings"
  | "Bushings"
  | "Grip Tape"
  | "Tools & Parts";

/** Sub-type within the Hardware & Tools collection, derived from real title text. */
export function hardwareTypeFor(title: string): HardwareType {
  const t = title.toLowerCase();
  if (t.includes("bearing")) return "Bearings";
  if (t.includes("bushing")) return "Bushings";
  if (t.includes("tape")) return "Grip Tape";
  if (t.includes("wheel")) return "Wheels";
  if (t.includes("truck")) return "Trucks";
  return "Tools & Parts";
}

export type PriceBucket = "under30" | "30to60" | "60to100" | "over100";

export const PRICE_LABELS: Record<PriceBucket, string> = {
  under30: "Under $30",
  "30to60": "$30 - $60",
  "60to100": "$60 - $100",
  over100: "$100+",
};

export function priceBucketFor(amount: number): PriceBucket {
  if (amount < 30) return "under30";
  if (amount < 60) return "30to60";
  if (amount < 100) return "60to100";
  return "over100";
}

export type ProductFilters = {
  widths?: WidthBucket[];
  types?: HardwareType[];
  prices?: PriceBucket[];
};

export function parseFiltersFromSearchParams(sp: {
  [key: string]: string | string[] | undefined;
}): ProductFilters {
  const toArr = (v: string | string[] | undefined) =>
    !v ? [] : Array.isArray(v) ? v : v.split(",").filter(Boolean);
  return {
    widths: toArr(sp.width) as WidthBucket[],
    types: toArr(sp.type) as HardwareType[],
    prices: toArr(sp.price) as PriceBucket[],
  };
}

export function applyFilters(
  products: Product[],
  filters: ProductFilters,
): Product[] {
  let out = products;
  if (filters.widths?.length) {
    out = out.filter((p) =>
      widthBucketsFor(p.title).some((w) => filters.widths!.includes(w)),
    );
  }
  if (filters.types?.length) {
    out = out.filter((p) => filters.types!.includes(hardwareTypeFor(p.title)));
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
  const widths = new Set<WidthBucket>();
  const types = new Set<HardwareType>();
  const prices = new Set<PriceBucket>();
  for (const p of products) {
    widthBucketsFor(p.title).forEach((w) => widths.add(w));
    types.add(hardwareTypeFor(p.title));
    prices.add(priceBucketFor(parseFloat(p.priceRange.minVariantPrice.amount)));
  }
  return { widths: [...widths], types: [...types], prices: [...prices] };
}
