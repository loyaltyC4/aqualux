import { FREE_SHIPPING_THRESHOLD } from "lib/brand";
import { deliveryWindow, zoneById } from "lib/shipping";
import { AddToCart } from "components/cart/add-to-cart";
import { Product } from "lib/shopify/types";
import { VariantPrice } from "./variant-price";
import { VariantSelector } from "./variant-selector";

export function ProductDescription({ product }: { product: Product }) {
  const summary = product.description
    ? product.description.split(". ").slice(0, 2).join(". ")
    : "";

  const win = deliveryWindow(zoneById("NA"));

  return (
    <div className="flex flex-col">
      {/* Variant-aware price badge: the static priceRange badge always showed
          the cheapest variant, so picking a 300 W heater still displayed the
          25 W price. VariantPrice resolves the selected variant the same way
          AddToCart does and re-renders on option change. */}
      <VariantPrice product={product} />

      {summary ? (
        <p className="mt-5 text-sm leading-relaxed text-neutral-700">
          {summary}
          {summary.endsWith(".") ? "" : "."}
        </p>
      ) : null}

      <div className="mt-6">
        <VariantSelector
          options={product.options}
          variants={product.variants}
          variantImageIndex={Object.fromEntries(
            product.images.flatMap((img, i) =>
              (img.variantIds ?? []).map((vid) => [vid, i] as const),
            ),
          )}
        />
      </div>

      <div className="mt-2">
        <AddToCart product={product} />
      </div>

      <p className="mt-4 text-sm text-neutral-700">
        <strong className="font-semibold text-[#0f1d18]">
          Arrives in {win.min}-{win.max} business days
        </strong>{" "}
        to the US and Canada, tracked from dispatch. Other regions are on the{" "}
        <a href="/shipping-returns" className="underline underline-offset-2">
          shipping page
        </a>
        .
      </p>

      <div className="mt-4 rounded-2xl border border-[#2f6a37]/20 bg-[#f3f5f1] p-4 text-sm leading-relaxed text-neutral-700">
        <p className="font-semibold text-[#0f1d18]">Try it risk-free</p>
        <p className="mt-1">
          Unused and in its packaging within 30 days? Send it back for a refund
          or exchange. Arrives damaged or faulty? Tell us within 14 days and we
          replace it, no arguing.
        </p>
      </div>

      <ul className="mt-6 grid grid-cols-1 gap-2 text-sm text-neutral-600 sm:grid-cols-2">
        {[
          "Hand-picked and quality-checked",
          `Free shipping over $${FREE_SHIPPING_THRESHOLD} to US & Canada`,
          "Encrypted checkout with Stripe",
          "30-day easy returns",
        ].map((t) => (
          <li key={t} className="flex items-center gap-2">
            <svg
              viewBox="0 0 24 24"
              className="h-4 w-4 flex-none text-[#2f6a37]"
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
