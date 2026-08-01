"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { toast } from "sonner";
import type { Product, ProductVariant } from "lib/shopify/types";
import { useCart } from "./cart-context";

type Suggestion = {
  handle: string;
  title: string;
  image: string | null;
  variantId?: string;
  variantTitle?: string;
  price: string;
  currencyCode: string;
  selectedOptions: { name: string; value: string }[];
};

function fmt(amount: string, code: string) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: code,
  }).format(parseFloat(amount));
}

export function CartCrossSell({
  excludeHandles,
}: {
  excludeHandles: string[];
}) {
  const { addCartItem } = useCart();
  const [items, setItems] = useState<Suggestion[]>([]);

  useEffect(() => {
    fetch(`/api/cart-suggestions?exclude=${excludeHandles.join(",")}`)
      .then((r) => r.json())
      .then((d) => setItems(d.results || []))
      .catch(() => setItems([]));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [excludeHandles.join(",")]);

  if (items.length === 0) return null;

  function quickAdd(item: Suggestion) {
    if (!item.variantId) return;
    const variant: ProductVariant = {
      id: item.variantId,
      title: item.variantTitle || "Default Title",
      availableForSale: true,
      selectedOptions: item.selectedOptions,
      price: { amount: item.price, currencyCode: item.currencyCode },
    };
    const product: Product = {
      id: item.variantId,
      handle: item.handle,
      availableForSale: true,
      title: item.title,
      description: "",
      descriptionHtml: "",
      options: [],
      priceRange: {
        minVariantPrice: {
          amount: item.price,
          currencyCode: item.currencyCode,
        },
        maxVariantPrice: {
          amount: item.price,
          currencyCode: item.currencyCode,
        },
      },
      variants: [variant],
      featuredImage: {
        url: item.image || "",
        altText: item.title,
        width: 400,
        height: 400,
      },
      images: [],
      seo: { title: item.title, description: "" },
      tags: [],
      updatedAt: new Date().toISOString(),
    };
    addCartItem(variant, product);
    toast.success("Added to cart", { description: item.title });
  }

  return (
    <div className="mb-4 border-t border-white/10 pt-4">
      <p className="mb-3 text-xs font-semibold uppercase tracking-[0.14em] text-neutral-500">
        Build essentials
      </p>
      <div className="space-y-2">
        {items.map((item) => (
          <div
            key={item.handle}
            className="flex items-center gap-3 rounded-xl border border-white/10 bg-white/[0.02] p-2"
          >
            <div className="relative h-10 w-10 flex-none overflow-hidden rounded-md bg-white">
              {item.image ? (
                <Image
                  src={item.image}
                  alt=""
                  fill
                  className="object-contain p-1"
                />
              ) : null}
            </div>
            <div className="min-w-0 flex-1">
              <p className="truncate text-xs text-neutral-200">{item.title}</p>
              <p className="text-xs font-semibold text-[#f2a93b]">
                {fmt(item.price, item.currencyCode)}
              </p>
            </div>
            <button
              onClick={() => quickAdd(item)}
              className="shrink-0 rounded-full border border-white/20 px-3 py-1.5 text-xs font-semibold transition hover:border-[#f2a93b] hover:text-[#f2a93b]"
            >
              Add
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
