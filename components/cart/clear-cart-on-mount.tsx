"use client";

import { useEffect } from "react";
import { useCart } from "./cart-context";

/** Clears the client cart once, after a successful order. */
export function ClearCartOnMount() {
  const { clearCart } = useCart();
  useEffect(() => {
    clearCart();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  return null;
}
