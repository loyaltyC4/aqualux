import { NextRequest, NextResponse } from "next/server";
import { getProduct } from "lib/shopify";

export const dynamic = "force-dynamic";

// Real, small-ticket "build essentials" that pair with almost any order —
// hand-picked from the actual catalog, not guessed at runtime.
const ESSENTIAL_HANDLES = [
  "fingerboard-foam-grip-tape-110-38mm-uncut-deck-griptape-stickers",
  "metal-fingerboard-tool-professional-made-for-finger-skateboard-screws-and-nuts",
  "gold-silver-black-self-lock-anti-loose-fingerboard-locknuts-with-nylon-inside",
  "fingerboard-truck-pivot-cup",
];

export async function GET(req: NextRequest) {
  const excludeParam = req.nextUrl.searchParams.get("exclude") || "";
  const exclude = new Set(excludeParam.split(",").filter(Boolean));

  const candidates = await Promise.all(
    ESSENTIAL_HANDLES.filter((h) => !exclude.has(h)).map((h) => getProduct(h)),
  );

  const results = candidates
    .filter((p): p is NonNullable<typeof p> => Boolean(p))
    .slice(0, 3)
    .map((p) => ({
      handle: p.handle,
      title: p.title,
      image: p.featuredImage?.url || null,
      variantId: p.variants[0]?.id,
      variantTitle: p.variants[0]?.title,
      price: p.priceRange.minVariantPrice.amount,
      currencyCode: p.priceRange.minVariantPrice.currencyCode,
      selectedOptions: p.variants[0]?.selectedOptions || [],
    }));

  return NextResponse.json({ results });
}
