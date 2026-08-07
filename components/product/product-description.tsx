import { FREE_SHIPPING_THRESHOLD } from "lib/brand";
import { AddToCart } from "components/cart/add-to-cart";
import Price from "components/price";
import { Product } from "lib/shopify/types";
import { VariantSelector } from "./variant-selector";

export function ProductDescription({ product }: { product: Product }) {
  const summary = product.description
    ? product.description.split(". ").slice(0, 2).join(". ")
    : "";

  return (
    <div className="flex flex-col">
      <div className="mt-4 flex items-center gap-3">
        <span className="rounded-full bg-[#f2a93b] px-4 py-1.5 text-lg font-semibold text-black">
          <Price
            amount={product.priceRange.minVariantPrice.amount}
            currencyCode={product.priceRange.minVariantPrice.currencyCode}
          />
        </span>
        {product.availableForSale ? (
          /* Stock state only. This previously read "ships 1-2 days", which was
             not achievable on the current fulfilment route and sat next to the
             price where it reads as a delivery promise. Delivery timings live
             on /shipping-returns so there is one place to keep them true. */
          <span className="text-sm text-neutral-400">In stock</span>
        ) : (
          <span className="text-sm text-red-400">Currently out of stock</span>
        )}
      </div>

      {summary ? (
        <p className="mt-5 text-sm leading-relaxed text-neutral-300">
          {summary}
          {summary.endsWith(".") ? "" : "."}
        </p>
      ) : null}

      <div className="mt-6">
        <VariantSelector
          options={product.options}
          variants={product.variants}
        />
      </div>

      <div className="mt-2">
        <AddToCart product={product} />
      </div>

      <ul className="mt-6 grid grid-cols-1 gap-2 text-sm text-neutral-400 sm:grid-cols-2">
        {[
          "Hand-picked and quality-checked",
          `Free shipping over $${FREE_SHIPPING_THRESHOLD} to AU & NZ`,
          "Encrypted checkout with Stripe",
          "30-day easy returns",
        ].map((t) => (
          <li key={t} className="flex items-center gap-2">
            <svg
              viewBox="0 0 24 24"
              className="h-4 w-4 flex-none text-[#f2a93b]"
              fill="none"
              stroke="currentColor"
              strokeWidth={2.5}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="m5 13 4 4L19 7"
              />
            </svg>
            {t}
          </li>
        ))}
      </ul>
    </div>
  );
}
