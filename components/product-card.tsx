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
 * Retail product card. Supplier photos arrive on mixed white and off-white
 * backgrounds; multiplying them onto one tinted panel makes the backgrounds
 * disappear into the same colour, so a grid of cards reads as one catalogue.
 * Price stays prominent; the card-level CTA routes to the product page.
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
      className="group flex h-full flex-col rounded-2xl border border-black/[0.07] bg-white transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] hover:-translate-y-1 hover:border-[#2f6a37]/40 hover:shadow-[0_20px_45px_-24px_rgba(15,29,24,0.28)]"
    >
      <div className="relative aspect-square overflow-hidden rounded-t-[calc(1rem-1px)] bg-[var(--aq-raised)]">
        {img ? (
          <Image
            src={img}
            alt={product.featuredImage?.altText || product.title}
            fill
            sizes={sizes}
            priority={priority}
            className="object-contain p-6 mix-blend-multiply transition-transform duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-[1.04]"
          />
        ) : (
          <div className="absolute inset-0 bg-[var(--aq-raised)]" />
        )}
        {badge ? (
          <span className="absolute left-4 top-4 rounded-full bg-[#2f6a37] px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.14em] text-white">
            {badge}
          </span>
        ) : null}
      </div>
      <div className="flex flex-1 flex-col gap-2 p-5">
        <h3 className="text-[15px] font-medium leading-snug text-[var(--aq-ink)]">
          {product.title}
        </h3>
        <div className="mt-auto flex items-baseline gap-2.5">
          <span className="aq-spec text-[17px] font-semibold text-[var(--aq-ink)]">
            {fmt(price.amount, price.currencyCode)}
          </span>
          {compare ? (
            <span className="aq-spec text-sm text-[var(--aq-muted)] line-through">
              {fmt(compare, price.currencyCode)}
            </span>
          ) : null}
        </div>
      </div>
    </Link>
  );
}
