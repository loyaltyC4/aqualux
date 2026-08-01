"use client";

import { PlusIcon } from "@heroicons/react/24/outline";
import clsx from "clsx";
import { Product, ProductVariant } from "lib/shopify/types";
import { useSearchParams } from "next/navigation";
import { toast } from "sonner";
import { useCart } from "./cart-context";

function SubmitButton({
  availableForSale,
  selectedVariantId,
  onClick,
}: {
  availableForSale: boolean;
  selectedVariantId: string | undefined;
  onClick: () => void;
}) {
  const buttonClasses =
    "relative flex w-full items-center justify-center gap-2 rounded-full p-4 text-sm font-semibold uppercase tracking-wide transition active:scale-[0.99]";
  const enabled =
    "bg-[#f2a93b] text-black hover:brightness-110 shadow-[0_10px_30px_-12px_rgba(197,242,60,0.6)]";
  const disabledClasses = "cursor-not-allowed bg-white/10 text-neutral-400";

  if (!availableForSale) {
    return (
      <button disabled className={clsx(buttonClasses, disabledClasses)}>
        Out of stock
      </button>
    );
  }

  if (!selectedVariantId) {
    return (
      <button
        aria-label="Please select an option"
        disabled
        className={clsx(buttonClasses, disabledClasses)}
      >
        <PlusIcon className="h-5" />
        Select an option
      </button>
    );
  }

  return (
    <button
      type="button"
      aria-label="Add to cart"
      onClick={onClick}
      className={clsx(buttonClasses, enabled)}
    >
      <PlusIcon className="h-5" />
      Add to cart
    </button>
  );
}

export function AddToCart({ product }: { product: Product }) {
  const { variants, availableForSale } = product;
  const { addCartItem } = useCart();
  const searchParams = useSearchParams();

  const variant = variants.find((variant: ProductVariant) =>
    variant.selectedOptions.every(
      (option) => option.value === searchParams.get(option.name.toLowerCase()),
    ),
  );
  const defaultVariantId = variants.length === 1 ? variants[0]?.id : undefined;
  const selectedVariantId = variant?.id || defaultVariantId;
  const finalVariant = variants.find(
    (variant) => variant.id === selectedVariantId,
  );

  return (
    <SubmitButton
      availableForSale={availableForSale}
      selectedVariantId={selectedVariantId}
      onClick={() => {
        if (!finalVariant) return;
        addCartItem(finalVariant, product);
        toast.success(`Added to cart`, {
          description: product.title,
        });
      }}
    />
  );
}
