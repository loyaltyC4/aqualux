"use client";

import { useSearchParams } from "next/navigation";
import Price from "components/price";
import type { Product } from "lib/shopify/types";

/**
 * Buy-box price that tracks the selected variant. The static priceRange
 * badge always showed the cheapest variant, so picking a 300 W heater
 * still displayed the 25 W price. Resolution mirrors AddToCart: current
 * query params matched against every variant's selectedOptions.
 */
export function VariantPrice({ product }: { product: Product }) {
  const searchParams = useSearchParams();

  const variant = product.variants.find((v) =>
    v.selectedOptions.every(
      (option) => option.value === searchParams.get(option.name.toLowerCase()),
    ),
  );
  const selected = variant ?? product.variants[0];

  const amount =
    selected?.price?.amount ?? product.priceRange.minVariantPrice.amount;
  const currencyCode =
    selected?.price?.currencyCode ??
    product.priceRange.minVariantPrice.currencyCode;

  const was = parseFloat(selected?.compareAtPrice ?? "0");
  const cur = parseFloat(amount);
  const savePct = was > cur ? Math.round((1 - cur / was) * 100) : 0;

  return (
    <div className="mt-4 flex flex-wrap items-center gap-3">
      <span className="rounded-full bg-[#2f6a37] px-4 py-1.5 text-lg font-semibold text-white">
        <Price amount={amount} currencyCode={currencyCode} />
      </span>
      {savePct >= 5 ? (
        <>
          <span className="text-base text-neutral-400 line-through">
            <Price amount={String(was)} currencyCode={currencyCode} />
          </span>
          <span className="rounded-full bg-[#f1e6c8] px-2.5 py-1 text-xs font-semibold text-[#5a4410]">
            Save {savePct}%
          </span>
        </>
      ) : null}
      {product.availableForSale ? (
        <span className="text-sm text-neutral-600">In stock</span>
      ) : (
        <span className="text-sm text-red-400">Currently out of stock</span>
      )}
    </div>
  );
}
