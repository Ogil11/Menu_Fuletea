"use client";

import { useCartStore } from "@/store/cart";
import { cartCount, cartSubtotal } from "@/lib/cart";
import { useHydrated } from "./useHydrated";

/** Carrito listo para render: vacío en SSR, restaurado tras hidratar. */
export function useCart() {
  const hydrated = useHydrated();
  const storeItems = useCartStore((s) => s.items);
  const items = hydrated ? storeItems : [];
  return {
    hydrated,
    items,
    count: cartCount(items),
    subtotal: cartSubtotal(items),
  };
}
