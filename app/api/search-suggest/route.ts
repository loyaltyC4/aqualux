import { NextRequest, NextResponse } from "next/server";
import { getProducts } from "lib/shopify";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  const q = (req.nextUrl.searchParams.get("q") || "").trim();
  if (q.length < 2) {
    return NextResponse.json({ results: [] });
  }

  const products = await getProducts({ query: q });
  const results = products.slice(0, 6).map((p) => ({
    handle: p.handle,
    title: p.title,
    price: p.priceRange.minVariantPrice.amount,
    currencyCode: p.priceRange.minVariantPrice.currencyCode,
    image: p.featuredImage?.url || null,
  }));

  return NextResponse.json({ results, total: products.length });
}
