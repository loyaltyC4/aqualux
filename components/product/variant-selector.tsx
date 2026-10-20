"use client";

import clsx from "clsx";
import { ProductOption, ProductVariant } from "lib/shopify/types";
import { useRouter, useSearchParams } from "next/navigation";

type Combination = {
  id: string;
  availableForSale: boolean;
  [key: string]: string | boolean;
};

export function VariantSelector({
  options,
  variants,
  variantImageIndex,
}: {
  options: ProductOption[];
  variants: ProductVariant[];
  /** Variant gid → index into the product-page gallery images. */
  variantImageIndex?: Record<string, number>;
}) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const hasNoOptionsOrJustOneOption =
    !options.length ||
    (options.length === 1 && options[0]?.values.length === 1);

  if (hasNoOptionsOrJustOneOption) {
    return null;
  }

  const combinations: Combination[] = variants.map((variant) => ({
    id: variant.id,
    availableForSale: variant.availableForSale,
    ...variant.selectedOptions.reduce(
      (accumulator, option) => ({
        ...accumulator,
        [option.name.toLowerCase()]: option.value,
      }),
      {},
    ),
  }));

  const updateOption = (name: string, value: string) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set(name, value);

    // Jump the gallery to the photo that represents the newly selected
    // variant. Resolve the variant the same way availability is resolved
    // below: current query params plus this change, matched against every
    // variant's selected options.
    if (variantImageIndex && Object.keys(variantImageIndex).length > 0) {
      const optionParams: Record<string, string> = {};
      searchParams.forEach((v, k) => {
        optionParams[k] = v;
      });
      optionParams[name.toLowerCase()] = value;

      // A variant is selected when each of its options matches the current
      // query params (with this update applied).
      const selected = variants.find((variant) =>
        variant.selectedOptions.every(
          (o) => optionParams[o.name.toLowerCase()] === o.value,
        ),
      );
      const imgIdx = selected ? variantImageIndex[selected.id] : undefined;
      if (imgIdx !== undefined) {
        params.set("image", String(imgIdx));
      }
    }

    router.replace(`?${params.toString()}`, { scroll: false });
  };

  return options.map((option) => (
    <form key={option.id}>
      <dl className="mb-6">
        <dt className="mb-3 text-xs font-semibold uppercase tracking-[0.16em] text-neutral-600">
          {option.name}
        </dt>
        <dd className="flex flex-wrap gap-2.5">
          {option.values.map((value) => {
            const optionNameLowerCase = option.name.toLowerCase();
            const optionParams: Record<string, string> = {};
            searchParams.forEach((v, k) => (optionParams[k] = v));
            optionParams[optionNameLowerCase] = value;

            const filtered = Object.entries(optionParams).filter(
              ([key, value]) =>
                options.find(
                  (option) =>
                    option.name.toLowerCase() === key &&
                    option.values.includes(value),
                ),
            );
            const isAvailableForSale = combinations.find((combination) =>
              filtered.every(
                ([key, value]) =>
                  combination[key] === value && combination.availableForSale,
              ),
            );
            const isActive = searchParams.get(optionNameLowerCase) === value;

            return (
              <button
                formAction={() => updateOption(optionNameLowerCase, value)}
                key={value}
                aria-disabled={!isAvailableForSale}
                disabled={!isAvailableForSale}
                title={`${option.name} ${value}${!isAvailableForSale ? " (Out of Stock)" : ""}`}
                className={clsx(
                  "flex min-w-[48px] items-center justify-center rounded-full border px-3 py-1.5 text-sm transition",
                  {
                    "border-[#2f6a37] bg-[#2f6a37] font-semibold text-white":
                      isActive,
                    "border-black/15 bg-white text-neutral-800 hover:border-[#2f6a37]/60 hover:text-[#2f6a37]":
                      !isActive && isAvailableForSale,
                    "relative z-10 cursor-not-allowed overflow-hidden border-black/10 bg-white text-neutral-600 before:absolute before:inset-x-0 before:-z-10 before:h-px before:-rotate-45 before:bg-neutral-700":
                      !isAvailableForSale,
                  },
                )}
              >
                {value}
              </button>
            );
          })}
        </dd>
      </dl>
    </form>
  ));
}
