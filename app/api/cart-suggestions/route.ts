import { NextRequest, NextResponse } from "next/server";
import { getProduct } from "lib/shopify";

export const dynamic = "force-dynamic";

// Real, small-ticket essentials that pair with almost any planted tank
// order. Hand-picked from the actual catalog, not guessed at runtime, and
// verified to exist by a build-time test so the rail can never go silent.
const ESSENTIAL_HANDLES = [
  "glass-drop-checker-4dkh-solution",
  "test-strips-9-in-1-100-count",
  "long-reach-tweezers-15in",
  "magnetic-glass-cleaner-float",
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
