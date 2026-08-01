/**
 * Static data layer — products/collections bundled at build time.
 * Activated automatically when SHOPIFY_STORE_DOMAIN is not set.
 * No API tokens. No network requests. Zero Shopify dependency.
 *
 * Collection membership is EXPLICIT: data/collection-map.json maps each
 * collection handle to an ordered list of product handles. This replaces the
 * old fragile title-keyword matching so category pages are accurate.
 */

// eslint-disable-next-line @typescript-eslint/no-require-imports
const productsRaw: { products: any[] } = require("../../data/products.json");
// eslint-disable-next-line @typescript-eslint/no-require-imports
const collectionsRaw: {
  collections: any[];
} = require("../../data/collections.json");
// eslint-disable-next-line @typescript-eslint/no-require-imports
const collectionMap: Record<
  string,
  string[]
> = require("../../data/collection-map.json");

import type { Collection, Product } from "./types";

// ── Helpers ──────────────────────────────────────────────────────────────────

function stripHtml(html: string): string {
  return html
    .replace(/<[^>]*>/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

/**
 * Truncates to a meta-description-friendly length WITHOUT cutting a word or
 * sentence in half. Prefers ending on a sentence boundary (". "); falls back
 * to the last full word before the limit.
 */
function truncateForMeta(text: string, maxLength = 155): string {
  if (text.length <= maxLength) return text;
  const hardCut = text.slice(0, maxLength);

  const lastSentenceEnd = hardCut.lastIndexOf(". ");
  if (lastSentenceEnd > maxLength * 0.4) {
    return hardCut.slice(0, lastSentenceEnd + 1).trim();
  }

  const lastSpace = hardCut.lastIndexOf(" ");
  const clean = lastSpace > 0 ? hardCut.slice(0, lastSpace) : hardCut;
  return `${clean.trim()}…`;
}

// ── Transformers ─────────────────────────────────────────────────────────────

/** Tags that exist for internal bookkeeping and must never reach the client. */
const INTERNAL_TAG = /^src1688:/;

/** Supplier offer id behind a SKU. Server-side only, never serialised. */
export function supplierRefFor(handle: string): string | undefined {
  const p = productsRaw.products.find((x) => x.handle === handle);
  if (!p) return undefined;
  const raw = typeof p.tags === "string" ? p.tags.split(",") : [];
  const hit = raw.map((t: string) => t.trim()).find((t: string) => INTERNAL_TAG.test(t));
  return hit ? hit.split(":")[1] : undefined;
}

function restProductToProduct(p: any): Product {
  const prices = (p.variants ?? [])
    .map((v: any) => parseFloat(v.price ?? "0"))
    .filter((n: number) => !isNaN(n));
  const minPrice = prices.length ? Math.min(...prices) : 0;
  const maxPrice = prices.length ? Math.max(...prices) : 0;

  const images = (p.images ?? []).map((img: any) => ({
    url: img.src as string,
    altText: (img.alt as string) || (p.title as string),
    width: (img.width as number) ?? 800,
    height: (img.height as number) ?? 800,
  }));

  const variants = (p.variants ?? []).map((v: any) => {
    const selectedOptions = (
      [
        p.options?.[0] && v.option1
          ? { name: p.options[0].name as string, value: v.option1 as string }
          : null,
        p.options?.[1] && v.option2
          ? { name: p.options[1].name as string, value: v.option2 as string }
          : null,
        p.options?.[2] && v.option3
          ? { name: p.options[2].name as string, value: v.option3 as string }
          : null,
      ] as (null | { name: string; value: string })[]
    ).filter((x): x is { name: string; value: string } => x !== null);

    return {
      id: `gid://shopify/ProductVariant/${v.id as string}`,
      title: v.title as string,
      availableForSale: v.available !== false,
      selectedOptions,
      price: { amount: (v.price as string) ?? "0.00", currencyCode: "USD" },
      sku: (v.sku as string) ?? "",
      compareAtPrice: (v.compare_at_price as string) ?? null,
    };
  });

  const rawTags =
    typeof p.tags === "string"
      ? p.tags
          .split(",")
          .map((t: string) => t.trim())
          .filter(Boolean)
      : Array.isArray(p.tags)
        ? (p.tags as string[])
        : [];

  // Supplier references are stripped here, at the boundary where raw catalog
  // data becomes a Product. Filtering them only at render time is not enough:
  // the whole Product object is serialised into the RSC payload, so a tag the
  // page never displays still ships to the browser in plain text. Keeping the
  // strip in the data layer means no route, schema block or payload can leak
  // it. Use supplierRefFor() for internal lookups.
  const tags = rawTags.filter((t: string) => !INTERNAL_TAG.test(t));

  return {
    id: `gid://shopify/Product/${p.id as string}`,
    handle: p.handle as string,
    availableForSale: p.status === "active",
    title: p.title as string,
    description: stripHtml((p.body_html as string) ?? ""),
    descriptionHtml: (p.body_html as string) ?? "",
    options: (p.options ?? []).map((o: any) => ({
      id: `gid://shopify/ProductOption/${o.id as string}`,
      name: o.name as string,
      values: (o.values as string[]) ?? [],
    })),
    priceRange: {
      minVariantPrice: { amount: minPrice.toFixed(2), currencyCode: "USD" },
      maxVariantPrice: { amount: maxPrice.toFixed(2), currencyCode: "USD" },
    },
    variants,
    featuredImage: images[0] ?? { url: "", altText: "", width: 0, height: 0 },
    images,
    seo: {
      title: p.title as string,
      description: truncateForMeta(stripHtml((p.body_html as string) ?? "")),
    },
    tags,
    updatedAt: (p.updated_at as string) ?? new Date().toISOString(),
  };
}

function restCollectionToCollection(c: any): Collection {
  return {
    handle: c.handle as string,
    title: c.title as string,
    description: stripHtml((c.body_html as string) ?? ""),
    seo: {
      title: c.title as string,
      description: truncateForMeta(stripHtml((c.body_html as string) ?? "")),
    },
    updatedAt: (c.updated_at as string) ?? new Date().toISOString(),
    path: `/search/${c.handle as string}`,
  };
}

// ── Cached data ───────────────────────────────────────────────────────────────

const allProducts: Product[] = productsRaw.products
  .filter((p: any) => p.status === "active")
  .map(restProductToProduct);

const productByHandle = new Map<string, Product>(
  allProducts.map((p) => [p.handle, p]),
);

// Variant id -> { product, variant } for server-side checkout price resolution
const variantIndex = new Map<
  string,
  { product: Product; variant: Product["variants"][number] }
>();
for (const p of allProducts) {
  for (const v of p.variants)
    variantIndex.set(v.id, { product: p, variant: v });
}

export function staticGetVariant(id: string) {
  return variantIndex.get(id);
}

// Reverse index: product handle -> its primary collection handle
const collectionOfProduct = new Map<string, string>();
for (const [handle, productHandles] of Object.entries(collectionMap)) {
  for (const ph of productHandles) {
    if (!collectionOfProduct.has(ph)) collectionOfProduct.set(ph, handle);
  }
}

const HIDDEN_COLLECTION_HANDLES = new Set(["frontpage", ""]);

const allCollections: Collection[] = collectionsRaw.collections
  .filter(
    (c: any) =>
      !String(c.handle).startsWith("hidden") &&
      !HIDDEN_COLLECTION_HANDLES.has(c.handle) &&
      String(c.title).toLowerCase() !== "home page",
  )
  .map(restCollectionToCollection);

// ── Public API ────────────────────────────────────────────────────────────────

export function staticGetProducts({
  query,
  sortKey,
  reverse,
}: {
  query?: string;
  sortKey?: string;
  reverse?: boolean;
}): Product[] {
  let products = [...allProducts];

  if (query) {
    const q = query.toLowerCase();
    products = products.filter(
      (p) =>
        p.title.toLowerCase().includes(q) ||
        p.description.toLowerCase().includes(q) ||
        p.tags.some((t) => t.toLowerCase().includes(q)),
    );
  }

  if (sortKey === "PRICE") {
    products.sort((a, b) => {
      const aP = parseFloat(a.priceRange.minVariantPrice.amount);
      const bP = parseFloat(b.priceRange.minVariantPrice.amount);
      return reverse ? bP - aP : aP - bP;
    });
  } else if (sortKey === "CREATED_AT") {
    products.sort((a, b) =>
      reverse
        ? b.updatedAt.localeCompare(a.updatedAt)
        : a.updatedAt.localeCompare(b.updatedAt),
    );
  }

  return products;
}

export function staticGetProduct(handle: string): Product | undefined {
  return productByHandle.get(handle);
}

export function staticGetCollections(): Collection[] {
  const all: Collection = {
    handle: "",
    title: "All",
    description: "All products",
    seo: { title: "All", description: "All products" },
    path: "/search",
    updatedAt: new Date().toISOString(),
  };
  return [all, ...allCollections];
}

function productsForHandles(handles: string[]): Product[] {
  return handles
    .map((h) => productByHandle.get(h))
    .filter((p): p is Product => Boolean(p));
}

export function staticGetCollectionProducts(handle: string): Product[] {
  // Homepage helper collections
  if (handle === "hidden-homepage-featured-items") {
    return productsForHandles(collectionMap["starter-kits"] ?? []).slice(0, 3);
  }
  if (handle === "hidden-homepage-carousel") {
    const spread: Product[] = [];
    for (const h of Object.keys(collectionMap)) {
      spread.push(...productsForHandles(collectionMap[h] ?? []).slice(0, 3));
    }
    return spread.slice(0, 12);
  }

  // Explicit collection membership
  if (collectionMap[handle]) {
    return productsForHandles(collectionMap[handle]);
  }

  // Unknown handle -> everything (search "all")
  return [...allProducts];
}

/** Primary collection handle a product belongs to (for breadcrumbs / cross-sell). */
export function staticGetProductCollection(
  productHandle: string,
): string | undefined {
  return collectionOfProduct.get(productHandle);
}

/** Same-collection recommendations, filled from the wider catalog if needed. */
export function staticGetRelatedProducts(
  productHandle: string,
  limit = 8,
): Product[] {
  const collectionHandle = collectionOfProduct.get(productHandle);
  const pool = collectionHandle
    ? productsForHandles(collectionMap[collectionHandle] ?? [])
    : [];
  const related = pool.filter((p) => p.handle !== productHandle);
  if (related.length < limit) {
    for (const p of allProducts) {
      if (related.length >= limit) break;
      if (p.handle !== productHandle && !related.includes(p)) related.push(p);
    }
  }
  return related.slice(0, limit);
}

export function staticGetMenu(handle: string) {
  if (handle === "next-js-frontend-header-menu") {
    return [
      { title: "All", path: "/search" },
      ...allCollections.map((c) => ({ title: c.title, path: c.path })),
    ];
  }
  if (handle === "next-js-frontend-footer-menu") {
    return [
      { title: "Home", path: "/" },
      { title: "All Products", path: "/search" },
    ];
  }
  return [];
}
