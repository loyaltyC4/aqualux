"use client";

import { Dialog, Transition } from "@headlessui/react";
import { XMarkIcon } from "@heroicons/react/24/outline";
import LoadingDots from "components/loading-dots";
import Price from "components/price";
import { DEFAULT_OPTION } from "lib/constants";
import { FREE_SHIPPING_THRESHOLD } from "lib/brand";
import { createUrl } from "lib/utils";
import Image from "next/image";
import Link from "next/link";
import { Fragment, useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import { useCart } from "./cart-context";
import { DeleteItemButton } from "./delete-item-button";
import { EditItemQuantityButton } from "./edit-item-quantity-button";
import { FreeShippingBar } from "./free-shipping-bar";
import { CartCrossSell } from "./cart-cross-sell";
import OpenCart from "./open-cart";

type MerchandiseSearchParams = { [key: string]: string };

export default function CartModal() {
  const { cart, updateCartItem } = useCart();
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const quantityRef = useRef(cart?.totalQuantity);
  const openCart = () => setIsOpen(true);
  const closeCart = () => setIsOpen(false);

  // Open the cart automatically when an item is added.
  useEffect(() => {
    if (
      cart?.totalQuantity &&
      cart?.totalQuantity !== quantityRef.current &&
      cart?.totalQuantity > 0
    ) {
      if (!isOpen) setIsOpen(true);
      quantityRef.current = cart?.totalQuantity;
    }
  }, [isOpen, cart?.totalQuantity]);

  async function handleCheckout() {
    if (!cart || cart.lines.length === 0) return;
    setLoading(true);
    try {
      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          lines: cart.lines.map((l) => ({
            merchandiseId: l.merchandise.id,
            quantity: l.quantity,
          })),
        }),
      });
      const data = await res.json();
      if (res.ok && data.url) {
        window.location.href = data.url;
        return;
      }
      if (res.status === 503) {
        toast.error("Checkout isn't live yet", {
          description:
            "Add your Stripe key to enable card payments (see setup notes).",
        });
      } else {
        toast.error("Couldn't start checkout", {
          description: data?.message || "Please try again in a moment.",
        });
      }
    } catch {
      toast.error("Network error", { description: "Please try again." });
    }
    setLoading(false);
  }

  const isEmpty = !cart || cart.lines.length === 0;

  return (
    <>
      <button aria-label="Open cart" onClick={openCart}>
        <OpenCart quantity={cart?.totalQuantity} />
      </button>
      <Transition show={isOpen}>
        <Dialog onClose={closeCart} className="relative z-50">
          <Transition.Child
            as={Fragment}
            enter="transition-all ease-in-out duration-300"
            enterFrom="opacity-0 backdrop-blur-none"
            enterTo="opacity-100 backdrop-blur-[.5px]"
            leave="transition-all ease-in-out duration-200"
            leaveFrom="opacity-100 backdrop-blur-[.5px]"
            leaveTo="opacity-0 backdrop-blur-none"
          >
            <div className="fixed inset-0 bg-black/50" aria-hidden="true" />
          </Transition.Child>
          <Transition.Child
            as={Fragment}
            enter="transition-all ease-in-out duration-300"
            enterFrom="translate-x-full"
            enterTo="translate-x-0"
            leave="transition-all ease-in-out duration-200"
            leaveFrom="translate-x-0"
            leaveTo="translate-x-full"
          >
            <Dialog.Panel className="fixed bottom-0 right-0 top-0 flex h-full w-full flex-col border-l border-white/10 bg-[#060d0e]/95 p-6 text-[#eceae4] backdrop-blur-xl md:w-[420px]">
              <div className="flex items-center justify-between">
                <p className="text-lg font-semibold">Your cart</p>
                <button aria-label="Close cart" onClick={closeCart}>
                  <CloseCart />
                </button>
              </div>

              {isEmpty ? (
                <div className="mt-24 flex w-full flex-col items-center justify-center">
                  <Image
                    src="/brand/mascot.png"
                    alt=""
                    width={120}
                    height={120}
                    className="opacity-90"
                  />
                  <p className="mt-6 text-center text-2xl font-semibold">
                    Your cart is empty.
                  </p>
                  <Link
                    href="/search"
                    onClick={closeCart}
                    className="mt-6 rounded-full bg-[#f2a93b] px-6 py-3 text-sm font-semibold text-black transition hover:brightness-110"
                  >
                    Shop the catalog
                  </Link>
                </div>
              ) : (
                <div className="flex h-full flex-col justify-between overflow-hidden">
                  <div className="pt-4">
                    <FreeShippingBar
                      subtotal={parseFloat(cart.cost.totalAmount.amount)}
                    />
                  </div>
                  <ul className="grow overflow-auto py-2">
                    {cart.lines
                      .sort((a, b) =>
                        a.merchandise.product.title.localeCompare(
                          b.merchandise.product.title,
                        ),
                      )
                      .map((item, i) => {
                        const merchandiseSearchParams =
                          {} as MerchandiseSearchParams;
                        item.merchandise.selectedOptions.forEach(
                          ({ name, value }) => {
                            if (value !== DEFAULT_OPTION) {
                              merchandiseSearchParams[name.toLowerCase()] =
                                value;
                            }
                          },
                        );
                        const merchandiseUrl = createUrl(
                          `/product/${item.merchandise.product.handle}`,
                          new URLSearchParams(merchandiseSearchParams),
                        );
                        return (
                          <li
                            key={i}
                            className="flex w-full flex-col border-b border-white/10"
                          >
                            <div className="relative flex w-full flex-row justify-between px-1 py-4">
                              <div className="absolute z-40 -ml-1 -mt-2">
                                <DeleteItemButton
                                  item={item}
                                  optimisticUpdate={updateCartItem}
                                />
                              </div>
                              <div className="flex flex-row">
                                <div className="relative h-16 w-16 overflow-hidden rounded-md border border-white/10 bg-white">
                                  {item.merchandise.product.featuredImage
                                    ?.url ? (
                                    <Image
                                      className="h-full w-full object-contain p-1"
                                      width={64}
                                      height={64}
                                      alt={
                                        item.merchandise.product.featuredImage
                                          .altText ||
                                        item.merchandise.product.title
                                      }
                                      src={
                                        item.merchandise.product.featuredImage
                                          .url
                                      }
                                    />
                                  ) : null}
                                </div>
                                <Link
                                  href={merchandiseUrl}
                                  onClick={closeCart}
                                  className="z-30 ml-3 flex flex-row"
                                >
                                  <div className="flex flex-1 flex-col text-sm">
                                    <span className="pr-2 leading-tight">
                                      {item.merchandise.product.title}
                                    </span>
                                    {item.merchandise.title !==
                                    DEFAULT_OPTION ? (
                                      <p className="mt-1 text-xs text-neutral-500">
                                        {item.merchandise.title}
                                      </p>
                                    ) : null}
                                  </div>
                                </Link>
                              </div>
                              <div className="flex h-16 flex-col justify-between">
                                <Price
                                  className="flex justify-end text-right text-sm"
                                  amount={item.cost.totalAmount.amount}
                                  currencyCode={
                                    item.cost.totalAmount.currencyCode
                                  }
                                />
                                <div className="ml-auto flex h-9 flex-row items-center rounded-full border border-white/15">
                                  <EditItemQuantityButton
                                    item={item}
                                    type="minus"
                                    optimisticUpdate={updateCartItem}
                                  />
                                  <p className="w-6 text-center">
                                    <span className="w-full text-sm">
                                      {item.quantity}
                                    </span>
                                  </p>
                                  <EditItemQuantityButton
                                    item={item}
                                    type="plus"
                                    optimisticUpdate={updateCartItem}
                                  />
                                </div>
                              </div>
                            </div>
                          </li>
                        );
                      })}
                  </ul>
                  <CartCrossSell
                    excludeHandles={cart.lines.map(
                      (l) => l.merchandise.product.handle,
                    )}
                  />

                  <div className="py-4 text-sm text-neutral-400">
                    <div className="mb-3 flex items-center justify-between border-b border-white/10 pb-2">
                      <p>Shipping</p>
                      <p className="text-right text-neutral-300">
                        {parseFloat(cart.cost.totalAmount.amount) >=
                        FREE_SHIPPING_THRESHOLD
                          ? "Free"
                          : "Calculated at checkout"}
                      </p>
                    </div>
                    <div className="mb-3 flex items-center justify-between border-b border-white/10 pb-2 text-base font-semibold text-[#eceae4]">
                      <p>Subtotal</p>
                      <Price
                        className="text-right"
                        amount={cart.cost.totalAmount.amount}
                        currencyCode={cart.cost.totalAmount.currencyCode}
                      />
                    </div>
                  </div>
                  <button
                    onClick={handleCheckout}
                    disabled={loading}
                    className="block w-full rounded-full bg-[#f2a93b] p-3.5 text-center text-sm font-semibold uppercase tracking-wide text-black transition hover:brightness-110 disabled:opacity-70"
                  >
                    {loading ? (
                      <LoadingDots className="bg-black" />
                    ) : (
                      "Secure checkout"
                    )}
                  </button>
                  <p className="mt-3 text-center text-xs text-neutral-500">
                    Encrypted checkout with Stripe · 30-day returns
                  </p>
                </div>
              )}
            </Dialog.Panel>
          </Transition.Child>
        </Dialog>
      </Transition>
    </>
  );
}

function CloseCart({ className }: { className?: string }) {
  return (
    <div className="relative flex h-11 w-11 items-center justify-center rounded-md border border-white/15 text-white transition-colors">
      <XMarkIcon
        className={`h-6 transition-all ease-in-out hover:scale-110 ${className ?? ""}`}
      />
    </div>
  );
}
