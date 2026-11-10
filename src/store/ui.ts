"use client";

import { create } from "zustand";
import type { CategoryFilter, CheckoutData } from "@/types";

export type CartView = "cart" | "checkout" | "sent";

export const emptyCheckout: CheckoutData = {
  name: "",
  phone: "",
  deliveryMode: "domicilio",
  address: "",
  reference: "",
  paymentMethod: "efectivo",
  notes: "",
};

interface UIState {
  /** Producto abierto en el modal de detalle. */
  productId: string | null;
  cartOpen: boolean;
  cartView: CartView;
  /** Último link de WhatsApp generado (para reabrirlo si el navegador lo bloqueó). */
  lastOrderUrl: string | null;
  category: CategoryFilter;
  /** Mensaje breve tipo "toast" (p. ej. "Agregado al carrito"). */
  toast: { id: number; message: string } | null;
  /** Borrador del checkout (en memoria) para no perderlo al volver al carrito. */
  checkoutDraft: CheckoutData;

  setCheckoutDraft: (draft: CheckoutData) => void;
  openProduct: (id: string) => void;
  closeProduct: () => void;
  openCart: (view?: CartView) => void;
  closeCart: () => void;
  setCartView: (view: CartView) => void;
  setLastOrderUrl: (url: string | null) => void;
  setCategory: (c: CategoryFilter) => void;
  showToast: (message: string) => void;
  hideToast: () => void;
}

export const useUIStore = create<UIState>()((set) => ({
  productId: null,
  cartOpen: false,
  cartView: "cart",
  lastOrderUrl: null,
  category: "todos",
  toast: null,
  checkoutDraft: emptyCheckout,

  setCheckoutDraft: (checkoutDraft) => set({ checkoutDraft }),
  openProduct: (id) => set({ productId: id }),
  closeProduct: () => set({ productId: null }),
  openCart: (view = "cart") => set({ cartOpen: true, cartView: view }),
  closeCart: () =>
    set((s) => ({ cartOpen: false, cartView: s.cartView === "sent" ? "cart" : s.cartView })),
  setCartView: (view) => set({ cartView: view }),
  setLastOrderUrl: (url) => set({ lastOrderUrl: url }),
  setCategory: (category) => set({ category }),
  showToast: (message) => set({ toast: { id: Date.now(), message } }),
  hideToast: () => set({ toast: null }),
}));
