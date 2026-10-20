import { FREE_SHIPPING_THRESHOLD } from "lib/brand";
import { deliveryWindow, zoneById } from "lib/shipping";
import { AddToCart } from "components/cart/add-to-cart";
import Price from "components/price";
import { Product } from "lib/shopify/types";
import { VariantSelector } from "./variant-selector";

export function ProductDescription({ product }: { product: Product }) {
  const summary = product.description
    ? product.description.split(". ").slice(0, 2).join(". ")
    : "";

  const cur = parseFloat(product.priceRange.minVariantPrice.amount);
  const was = parseFloat(product.variants[0]?.compareAtPrice ?? "0");
  const savePct = was > cur ? Math.round((1 - cur / was) * 100) : 0;
  const win = deliveryWindow(zoneById("NA"));

  return (
    <div className="flex flex-col">
      <div className="mt-4 flex flex-wrap items-center gap-3">
        <span className="rounded-full bg-[#2f6a37] px-4 py-1.5 text-lg font-semibold text-white">
          <Price
            amount={product.priceRange.minVariantPrice.amount}
            currencyCode={product.priceRange.minVariantPrice.currencyCode}
          />
        </span>
        {savePct >= 5 ? (
          <>
            <span className="text-base text-neutral-400 line-through">
              <Price
                amount={String(was)}
                currencyCode={product.priceRange.minVariantPrice.currencyCode}
              />
            </span>
            <span className="rounded-full bg-[#f1e6c8] px-2.5 py-1 text-xs font-semibold text-[#5a4410]">
              Save {savePct}%
            </span>
          </>
        ) : null}
        {product.availableForSale ? (
          /* Stock state only. This previously read "ships 1-2 days", which was
             not achievable on the current fulfilment route and sat next to the
             price where it reads as a delivery promise. Delivery timings live
             on /shipping-returns so there is one place to keep them true. */
          <span className="text-sm text-neutral-600">In stock</span>
        ) : (
          <span className="text-sm text-red-400">Currently out of stock</span>
        )}
      </div>

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
