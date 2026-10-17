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
 * Clean retail product card: white image tile with a uniform square aspect and
 * object-contain, so mixed supplier photography lines up as one catalogue.
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
      className="group block rounded-2xl border border-black/10 bg-white transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] hover:-translate-y-1 hover:border-[#0e7490]/40 hover:shadow-[0_20px_45px_-24px_rgba(19,42,53,0.28)]"
    >
      <div className="relative aspect-square overflow-hidden rounded-t-[calc(1rem-1px)] bg-white">
        {img ? (
          <Image
            src={img}
            alt={product.featuredImage?.altText || product.title}
            fill
            sizes={sizes}
            priority={priority}
            className="object-contain p-4 transition-transform duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-[1.04]"
          />
        ) : (
          <div className="absolute inset-0 bg-[var(--aq-raised)]" />
        )}
        {badge ? (
          <span className="absolute left-4 top-4 rounded-full bg-[#0e7490] px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.14em] text-white">
            {badge}
          </span>
        ) : null}
      </div>
      <div className="flex flex-col gap-3 border-t border-black/5 p-5">
        <h3 className="text-[15px] font-medium leading-snug text-[var(--aq-ink)]">
          {product.title}
        </h3>
        <div className="mt-auto flex items-baseline gap-2.5">
          <span className="aq-spec text-lg font-semibold text-[#0e7490]">
            {fmt(price.amount, price.currencyCode)}
          </span>
          {compare ? (
            <span className="aq-spec text-sm text-[var(--aq-muted)] line-through">
              {fmt(compare, price.currencyCode)}
            </span>
          ) : null}
        </div>
        <span className="inline-flex w-full items-center justify-center rounded-full border border-[#0e7490]/30 py-2 text-[13px] font-semibold text-[#0e7490] transition-colors duration-300 group-hover:bg-[#0e7490] group-hover:text-white">
          View product
        </span>
      </div>
    </Link>
  );
}
