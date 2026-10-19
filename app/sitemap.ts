import { getAllSiteUrls } from "lib/site-urls";
import { getProducts } from "lib/shopify";
import { GUIDES_META } from "lib/guides";
import { baseUrl } from "lib/utils";
import { MetadataRoute } from "next";

/**
 * lastmod has to be truthful or Google ignores it for the whole sitemap.
 * The old version stamped every URL with the build time, so every deploy
 * claimed all 80+ pages had changed. Now:
 *   products   -> the product's own updated_at
 *   guides     -> publishedAt
 *   home, /search and collections -> the newest product they list
 *   static pages -> the date their copy last changed (bump by hand)
 */
const STATIC_UPDATED = "2026-10-19";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [urls, products] = await Promise.all([
    getAllSiteUrls(),
    getProducts({}),
  ]);

  const productDate = new Map(
    products.map((p) => [
      `${baseUrl}/product/${p.handle}`,
      p.updatedAt.slice(0, 10),
    ]),
  );
  const guideDate = new Map(
    GUIDES_META.map((g) => [`${baseUrl}/guides/${g.slug}`, g.publishedAt]),
  );
  const newestProduct =
    products
      .map((p) => p.updatedAt.slice(0, 10))
      .sort()
      .at(-1) ?? STATIC_UPDATED;

  return urls.map((url) => {
    const isHome = url === baseUrl;
    const isSearch = url.startsWith(`${baseUrl}/search`);
    const isProduct = url.includes("/product/");
    const isGuide = url.includes("/guides/");
    const lastModified =
      productDate.get(url) ??
      guideDate.get(url) ??
      (isHome || isSearch ? newestProduct : STATIC_UPDATED);
    return {
      url,
      lastModified,
      changeFrequency:
        isHome || isSearch ? "daily" : isGuide ? "monthly" : "weekly",
      priority: isHome ? 1 : isSearch ? 0.9 : isProduct || isGuide ? 0.7 : 0.4,
    };
  });
}
