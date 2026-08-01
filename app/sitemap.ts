import { getAllSiteUrls } from "lib/site-urls";
import { baseUrl } from "lib/utils";
import { MetadataRoute } from "next";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const now = new Date().toISOString();
  const urls = await getAllSiteUrls();

  return urls.map((url) => {
    const isHome = url === baseUrl;
    const isSearch = url === `${baseUrl}/search`;
    const isProduct = url.includes("/product/");
    return {
      url,
      lastModified: now,
      changeFrequency: isHome || isSearch ? "daily" : "weekly",
      priority: isHome ? 1 : isSearch ? 0.9 : isProduct ? 0.7 : 0.6,
    };
  });
}
