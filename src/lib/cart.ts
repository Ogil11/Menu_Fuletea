import type { CartItem, CartItemInput, SelectedOption } from "@/types";

export const MAX_QUANTITY = 50;
export const MAX_NOTES_LENGTH = 200;

export const clampQuantity = (n: number) =>
  Math.min(MAX_QUANTITY, Math.max(1, Math.floor(Number.isFinite(n) ? n : 1)));

/** Notas normalizadas: se usan para decidir si dos líneas son iguales. */
export const normalizeNotes = (notes: string | undefined) =>
  (notes ?? "").replace(/\s+/g, " ").trim().slice(0, MAX_NOTES_LENGTH);

/**
 * Identificador estable de una línea del carrito. Dos productos con la misma
 * variante, mismos adicionales (sin importar el orden) y mismas notas se
 * agrupan; cualquier diferencia genera una línea distinta.
 */
export function buildLineId(
  productId: string,
  variantId: string | null,
  optionIds: string[],
  notes: string,
): string {
  const opts = [...optionIds].sort().join(",");
  return [productId, variantId ?? "-", opts || "-", normalizeNotes(notes).toLowerCase()].join("|");
}

/** Convierte la selección del modal en una línea de carrito. */
export function createCartItem(input: CartItemInput): CartItem {
  const { product } = input;
  const variant = product.variants?.find((v) => v.id === input.variantId) ?? null;

  const wanted = new Set(input.optionIds ?? []);
  const options: SelectedOption[] = [];
  for (const group of product.optionGroups ?? []) {
    for (const opt of group.options) {
      if (wanted.has(opt.id)) {
        options.push({ groupId: group.id, optionId: opt.id, name: opt.name, price: opt.price });
      }
    }
  }

  const notes = normalizeNotes(input.notes);
  return {
    lineId: buildLineId(product.id, variant?.id ?? null, options.map((o) => o.optionId), notes),
    productId: product.id,
    name: product.name,
    categoryId: product.categoryId,
    image: product.image,
    basePrice: variant?.price ?? product.price,
    variant: variant ? { id: variant.id, name: variant.name } : null,
    options,
    notes,
    quantity: clampQuantity(input.quantity),
  };
}

type Priced = { basePrice: number; options: { price: number }[] };

export const unitPrice = (item: Priced) =>
  item.basePrice + item.options.reduce((sum, o) => sum + o.price, 0);

export const lineTotal = (item: Priced & { quantity: number }) => unitPrice(item) * item.quantity;

export const cartSubtotal = (items: CartItem[]) =>
  items.reduce((sum, item) => sum + lineTotal(item), 0);

export const cartCount = (items: CartItem[]) =>
  items.reduce((sum, item) => sum + item.quantity, 0);

/** Agrega una línea fusionándola con otra idéntica si existe. */
export function mergeItem(items: CartItem[], incoming: CartItem): CartItem[] {
  if (!items.some((i) => i.lineId === incoming.lineId)) return [...items, incoming];
  return items.map((i) =>
    i.lineId === incoming.lineId
      ? { ...i, quantity: clampQuantity(i.quantity + incoming.quantity) }
      : i,
  );
}

/**
 * Cambia las notas de una línea. Si con las nuevas notas queda idéntica a
 * otra línea existente, ambas se fusionan para no duplicar configuraciones.
 */
export function updateItemNotes(items: CartItem[], lineId: string, notes: string): CartItem[] {
  const target = items.find((i) => i.lineId === lineId);
  if (!target) return items;

  const clean = normalizeNotes(notes);
  const newId = buildLineId(
    target.productId,
    target.variant?.id ?? null,
    target.options.map((o) => o.optionId),
    clean,
  );
  const twin = items.find((i) => i.lineId === newId && i.lineId !== lineId);

  if (twin) {
    return items
      .filter((i) => i.lineId !== lineId)
      .map((i) =>
        i.lineId === newId ? { ...i, quantity: clampQuantity(i.quantity + target.quantity) } : i,
      );
  }
  return items.map((i) => (i.lineId === lineId ? { ...i, notes: clean, lineId: newId } : i));
}
