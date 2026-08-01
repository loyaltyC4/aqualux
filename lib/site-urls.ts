import { getCollections, getProducts } from "lib/shopify";
import { baseUrl } from "lib/utils";

const STATIC_PATHS = [
  "",
  "/search",
  "/about",
  "/contact",
  "/shipping-returns",
  "/faq",
  "/privacy",
  "/terms",
];

/** Every real, indexable URL on the site / the single source of truth shared
 * by the sitemap and the IndexNow submission trigger, so they never drift. */
export async function getAllSiteUrls(): Promise<string[]> {
  const [collections, products] = await Promise.all([
    getCollections(),
    getProducts({}),
  ]);

  const urls = [
    ...STATIC_PATHS.map((p) => `${baseUrl}${p}`),
    ...collections.filter((c) => c.handle).map((c) => `${baseUrl}${c.path}`),
    ...products.map((p) => `${baseUrl}/product/${p.handle}`),
  ];

  return urls;
}
