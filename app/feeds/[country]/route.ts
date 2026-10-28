import { getProducts } from "lib/shopify";
import { ALLOWED_COUNTRIES, DISPATCH_MAX_DAYS, DISPATCH_MIN_DAYS, zoneForCountry } from "lib/shipping";
import { SITE_NAME } from "lib/brand";
import { HIDDEN_PRODUCT_TAG } from "lib/constants";
import { baseUrl } from "lib/utils";

export const revalidate = 3600;

const abs = (u: string) => (u.startsWith("http") ? u : `${baseUrl}${u}`);
const esc = (s: string) => s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");

/** Google Merchant Center product feed: /feeds/US.xml, /feeds/AU.xml, ... One item per variant, grouped by product. */
export async function GET(_req: Request, ctx: { params: Promise<{ country: string }> }) {
  const cc = (await ctx.params).country.replace(/\.xml$/i, "").toUpperCase();
  if (!ALLOWED_COUNTRIES.includes(cc)) return new Response("Not found", { status: 404 });
  const zone = zoneForCountry(cc);
  const products = await getProducts({});
  const items: string[] = [];
  for (const p of products) {
    if (p.tags.includes(HIDDEN_PRODUCT_TAG)) continue;
    const img = p.featuredImage?.url ? abs(p.featuredImage.url) : undefined;
    if (!img) continue;
    const extra = p.images.filter((i) => abs(i.url) !== img).slice(0, 9);
    for (const v of p.variants) {
      const multi = p.variants.length > 1;
      const title = multi ? `${p.title} - ${v.title}` : p.title;
      const id = v.sku || `${p.handle}-${v.id}`;
      const q = multi ? `?variant=${encodeURIComponent(v.id)}` : "";
      items.push(`<item>
<g:id>${esc(id)}</g:id>
<g:item_group_id>${esc(p.handle)}</g:item_group_id>
<title>${esc(title.slice(0, 150))}</title>
<description>${esc((p.description || p.title).slice(0, 4900))}</description>
<link>${baseUrl}/product/${p.handle}${q}</link>
<g:image_link>${esc(img)}</g:image_link>
${extra.map((i) => `<g:additional_image_link>${esc(abs(i.url))}</g:additional_image_link>`).join("\n")}
<g:availability>${v.availableForSale ? "in_stock" : "out_of_stock"}</g:availability>
<g:price>${Number(v.price.amount).toFixed(2)} ${v.price.currencyCode}</g:price>
<g:brand>${esc(SITE_NAME)}</g:brand>
<g:condition>new</g:condition>
<g:identifier_exists>no</g:identifier_exists>
<g:shipping><g:country>${cc}</g:country><g:service>Standard</g:service><g:price>${zone.rate.toFixed(2)} ${v.price.currencyCode}</g:price><g:min_handling_time>${DISPATCH_MIN_DAYS}</g:min_handling_time><g:max_handling_time>${DISPATCH_MAX_DAYS}</g:max_handling_time><g:min_transit_time>${zone.minDays}</g:min_transit_time><g:max_transit_time>${zone.maxDays}</g:max_transit_time></g:shipping>
</item>`);
    }
  }
  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:g="http://base.google.com/ns/1.0"><channel>
<title>${esc(SITE_NAME)}</title><link>${baseUrl}</link><description>${esc(SITE_NAME)} product feed (${cc})</description>
${items.join("\n")}
</channel></rss>`;
  return new Response(xml, { headers: { "Content-Type": "application/xml; charset=utf-8", "Cache-Control": "public, s-maxage=3600" } });
}
