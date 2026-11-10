"use client";

import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import type { CartItem, CartItemInput } from "@/types";
import { getProductById } from "@/data/catalog";
import {
  clampQuantity,
  createCartItem,
  mergeItem,
  updateItemNotes,
} from "@/lib/cart";

interface CartState {
  items: CartItem[];
  addItem: (input: CartItemInput) => void;
  removeItem: (lineId: string) => void;
  setQuantity: (lineId: string, quantity: number) => void;
  setNotes: (lineId: string, notes: string) => void;
  clear: () => void;
}

export const CART_STORAGE_KEY = "fulletiao-cart";

export const useCartStore = create<CartState>()(
  persist(
    (set) => ({
      items: [],
      addItem: (input) => set((s) => ({ items: mergeItem(s.items, createCartItem(input)) })),
      removeItem: (lineId) => set((s) => ({ items: s.items.filter((i) => i.lineId !== lineId) })),
      setQuantity: (lineId, quantity) =>
        set((s) => ({
          items:
            quantity < 1
              ? s.items.filter((i) => i.lineId !== lineId)
              : s.items.map((i) =>
                  i.lineId === lineId ? { ...i, quantity: clampQuantity(quantity) } : i,
                ),
        })),
      setNotes: (lineId, notes) => set((s) => ({ items: updateItemNotes(s.items, lineId, notes) })),
      clear: () => set({ items: [] }),
    }),
    {
      name: CART_STORAGE_KEY,
      version: 1,
      storage: createJSONStorage(() => localStorage),
      partialize: (s) => ({ items: s.items }),
      /**
       * Al restaurar, se descartan productos que ya no existen o están agotados
       * y se refrescan nombre e imagen desde el catálogo. El precio guardado se
       * recalcula para que un cambio en el catálogo no deje precios viejos.
       */
      merge: (persisted, current) => {
        const saved = (persisted as Partial<CartState> | undefined)?.items ?? [];
        const items = saved.flatMap((item): CartItem[] => {
          const product = getProductById(item.productId);
          if (!product || !product.available) return [];
          const fresh = createCartItem({
            product,
            quantity: item.quantity,
            variantId: item.variant?.id ?? null,
            optionIds: item.options?.map((o) => o.optionId) ?? [],
            notes: item.notes,
          });
          return [fresh];
        });
        return { ...current, items: items.reduce(mergeItem, [] as CartItem[]) };
      },
    },
  ),
);
