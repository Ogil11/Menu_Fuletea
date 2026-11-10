import { beforeEach, describe, expect, it, vi } from "vitest";
import { adicionalesBasicos, getProductById } from "@/data/catalog";
import {
  cartCount,
  cartSubtotal,
  createCartItem,
  lineTotal,
  mergeItem,
  updateItemNotes,
} from "@/lib/cart";
import type { CartItem, Product } from "@/types";

const ranchero = getProductById("perro-ranchero")!;
const salchipapa = getProductById("salchipapa-sencilla")!;
/** Producto de prueba con adicionales y variantes configurados. */
const configurable: Product = {
  ...getProductById("hamburguesa-carne")!,
  optionGroups: [adicionalesBasicos],
  variants: [
    { id: "normal", name: "Normal", price: 16000 },
    { id: "doble", name: "Doble", price: 22000 },
  ],
};

describe("lógica del carrito", () => {
  it("agrupa líneas idénticas y suma cantidades", () => {
    let items: CartItem[] = [];
    items = mergeItem(items, createCartItem({ product: ranchero, quantity: 1 }));
    items = mergeItem(items, createCartItem({ product: ranchero, quantity: 1 }));
    expect(items).toHaveLength(1);
    expect(items[0]!.quantity).toBe(2);
    expect(cartSubtotal(items)).toBe(24000);
  });

  it("separa el mismo producto con observaciones distintas", () => {
    let items: CartItem[] = [];
    items = mergeItem(items, createCartItem({ product: ranchero, quantity: 1 }));
    items = mergeItem(items, createCartItem({ product: ranchero, quantity: 1, notes: "sin cebolla" }));
    // Normaliza espacios y mayúsculas al comparar
    items = mergeItem(items, createCartItem({ product: ranchero, quantity: 2, notes: "  Sin   cebolla " }));
    expect(items).toHaveLength(2);
    expect(items[1]!.quantity).toBe(3);
    expect(cartCount(items)).toBe(4);
  });

  it("separa por variante y adicionales; el orden de adicionales no importa", () => {
    const a = createCartItem({ product: configurable, quantity: 1, variantId: "doble", optionIds: ["papas-francesas"] });
    const b = createCartItem({ product: configurable, quantity: 1, variantId: "normal", optionIds: ["papas-francesas"] });
    const c = createCartItem({ product: configurable, quantity: 1, variantId: "doble" });
    let items = [a, b, c].reduce(mergeItem, [] as CartItem[]);
    expect(items).toHaveLength(3);
    expect(lineTotal(a)).toBe(22000 + 3000);
    items = mergeItem(items, createCartItem({ product: configurable, quantity: 2, variantId: "doble", optionIds: ["papas-francesas"] }));
    expect(items).toHaveLength(3);
    expect(items[0]!.quantity).toBe(3);
    expect(lineTotal(items[0]!)).toBe(75000);
  });

  it("ignora adicionales que no están configurados en el producto", () => {
    const item = createCartItem({ product: ranchero, quantity: 1, optionIds: ["papas-francesas"] });
    expect(item.options).toEqual([]);
    expect(lineTotal(item)).toBe(12000);
  });

  it("limita la cantidad entre 1 y 50", () => {
    expect(createCartItem({ product: ranchero, quantity: 0 }).quantity).toBe(1);
    expect(createCartItem({ product: ranchero, quantity: 999 }).quantity).toBe(50);
  });

  it("al editar notas fusiona con una línea idéntica existente", () => {
    let items = [
      createCartItem({ product: ranchero, quantity: 1, notes: "sin cebolla" }),
      createCartItem({ product: ranchero, quantity: 2 }),
    ];
    items = updateItemNotes(items, items[1]!.lineId, "sin cebolla");
    expect(items).toHaveLength(1);
    expect(items[0]!.quantity).toBe(3);
  });
});

describe("store de Zustand con persistencia", () => {
  beforeEach(() => {
    vi.resetModules();
    const mem = new Map<string, string>();
    vi.stubGlobal("localStorage", {
      getItem: (k: string) => mem.get(k) ?? null,
      setItem: (k: string, v: string) => void mem.set(k, v),
      removeItem: (k: string) => void mem.delete(k),
      clear: () => mem.clear(),
      key: () => null,
      length: 0,
    });
  });

  it("agrega, modifica, elimina, persiste y restaura", async () => {
    const { useCartStore, CART_STORAGE_KEY } = await import("@/store/cart");
    const s = useCartStore.getState();
    s.addItem({ product: ranchero, quantity: 2 });
    s.addItem({ product: salchipapa, quantity: 1, notes: "salsas aparte" });
    expect(useCartStore.getState().items).toHaveLength(2);

    const lineId = useCartStore.getState().items[0]!.lineId;
    useCartStore.getState().setQuantity(lineId, 5);
    expect(useCartStore.getState().items[0]!.quantity).toBe(5);

    const saved = JSON.parse(localStorage.getItem(CART_STORAGE_KEY)!);
    expect(saved.state.items).toHaveLength(2);

    // Simula una recarga: módulo nuevo, mismo localStorage
    vi.resetModules();
    const reloaded = await import("@/store/cart");
    const restored = reloaded.useCartStore.getState().items;
    expect(restored).toHaveLength(2);
    expect(restored[0]!.quantity).toBe(5);
    expect(restored[1]!.notes).toBe("salsas aparte");

    reloaded.useCartStore.getState().setQuantity(lineId, 0);
    expect(reloaded.useCartStore.getState().items).toHaveLength(1);
    reloaded.useCartStore.getState().removeItem(restored[1]!.lineId);
    expect(reloaded.useCartStore.getState().items).toHaveLength(0);
  });

  it("descarta al restaurar productos que ya no existen y refresca precios", async () => {
    const stale = createCartItem({ product: ranchero, quantity: 1 });
    localStorage.setItem(
      "fulletiao-cart",
      JSON.stringify({
        version: 1,
        state: {
          items: [
            { ...stale, basePrice: 1 },
            { ...stale, lineId: "x", productId: "producto-eliminado" },
          ],
        },
      }),
    );
    const { useCartStore } = await import("@/store/cart");
    const items = useCartStore.getState().items;
    expect(items).toHaveLength(1);
    expect(items[0]!.basePrice).toBe(12000);
  });
});
