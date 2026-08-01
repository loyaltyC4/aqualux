import Image from "next/image";
import Link from "next/link";
import type { Product } from "lib/shopify/types";

function fmt(a: string, c: string) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: c,
    maximumFractionDigits: 0,
  }).format(parseFloat(a));
}

/**
 * Double-bezel product card: outer shell (hairline + tint) wrapping an inner
 * core with its own surface and a mathematically smaller radius.
 */
export function ProductCard({
  product,
  badge,
  sizes = "(min-width:1024px) 25vw, (min-width:640px) 45vw, 90vw",
  priority = false,
}: {
  product: Product;
  badge?: string;
  sizes?: string;
  priority?: boolean;
}) {
  const price = product.priceRange.minVariantPrice;
  const compare = product.variants[0]?.compareAtPrice;
  const img = product.featuredImage?.url;

  return (
    <Link
      href={`/product/${product.handle}`}
      prefetch
      className="group block rounded-[1.75rem] border border-[var(--aq-line)] bg-white/[0.02] p-1.5 transition-all duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] hover:-translate-y-1.5 hover:border-[#f2a93b]/35"
    >
      <div className="overflow-hidden rounded-[calc(1.75rem-0.375rem)] bg-[var(--aq-panel)] shadow-[inset_0_1px_0_rgba(255,255,255,0.06)]">
        <div className="relative aspect-[4/3] overflow-hidden">
          {img ? (
            <Image
              src={img}
              alt={product.featuredImage?.altText || product.title}
              fill
              sizes={sizes}
              priority={priority}
              className="object-cover transition-transform duration-[900ms] ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-[1.06]"
            />
          ) : (
            <div className="absolute inset-0 bg-[var(--aq-panel2)]" />
          )}
          <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-[var(--aq-panel)] via-transparent to-transparent" />
          {badge ? (
            <span className="absolute left-4 top-4 rounded-full bg-[#f2a93b] px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.14em] text-[#1a1205]">
              {badge}
            </span>
          ) : null}
        </div>
        <div className="flex flex-col gap-3 p-5">
          <h3 className="text-[15px] font-medium leading-snug text-[var(--aq-bone)]">
            {product.title}
          </h3>
          <div className="mt-auto flex items-baseline gap-2.5">
            <span className="aq-spec text-lg font-semibold text-[#f2a93b]">
              {fmt(price.amount, price.currencyCode)}
            </span>
            {compare ? (
              <span className="aq-spec text-sm text-[var(--aq-muted)] line-through">
                {fmt(compare, price.currencyCode)}
              </span>
            ) : null}
          </div>
        </div>
      </div>
    </Link>
  );
}
