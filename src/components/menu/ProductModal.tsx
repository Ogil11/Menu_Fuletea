"use client";

import { useState } from "react";
import { Check, Info, ShoppingBag, X } from "lucide-react";
import { categoryById, getProductById, productTags } from "@/data/catalog";
import { MAX_NOTES_LENGTH, unitPrice } from "@/lib/cart";
import { cn } from "@/lib/cn";
import { formatCOP } from "@/lib/format";
import { useCartStore } from "@/store/cart";
import { useUIStore } from "@/store/ui";
import type { Product } from "@/types";
import { Dialog } from "@/components/ui/Dialog";
import { Button, IconButton } from "@/components/ui/Button";
import { QuantityStepper } from "@/components/ui/QuantityStepper";
import { ProductImage } from "./ProductImage";

export function ProductModal() {
  const productId = useUIStore((s) => s.productId);
  const closeProduct = useUIStore((s) => s.closeProduct);
  const product = productId ? getProductById(productId) : undefined;

  return (
    <Dialog open={!!product} onClose={closeProduct} labelledBy="product-title">
      {/* key reinicia el formulario cada vez que se abre otro producto */}
      {product && <ProductDetail key={product.id} product={product} onDone={closeProduct} />}
    </Dialog>
  );
}

function ProductDetail({ product, onDone }: { product: Product; onDone: () => void }) {
  const addItem = useCartStore((s) => s.addItem);
  const showToast = useUIStore((s) => s.showToast);
  const openCart = useUIStore((s) => s.openCart);

  const [quantity, setQuantity] = useState(1);
  const [notes, setNotes] = useState("");
  const [variantId, setVariantId] = useState<string | null>(product.variants?.[0]?.id ?? null);
  const [optionIds, setOptionIds] = useState<string[]>([]);

  const category = categoryById[product.categoryId];
  const variant = product.variants?.find((v) => v.id === variantId);
  const selectedOptions = (product.optionGroups ?? [])
    .flatMap((g) => g.options)
    .filter((o) => optionIds.includes(o.id));
  const unit = unitPrice({ basePrice: variant?.price ?? product.price, options: selectedOptions });
  const total = unit * quantity;

  const toggleOption = (groupId: string, optionId: string) => {
    const group = product.optionGroups?.find((g) => g.id === groupId);
    setOptionIds((prev) => {
      if (prev.includes(optionId)) return prev.filter((id) => id !== optionId);
      const inGroup = prev.filter((id) => group?.options.some((o) => o.id === id));
      if (group?.maxSelect && inGroup.length >= group.maxSelect) return prev;
      return [...prev, optionId];
    });
  };

  const handleAdd = (goToCart: boolean) => {
    addItem({ product, quantity, variantId, optionIds, notes });
    onDone();
    if (goToCart) openCart();
    else showToast(`${quantity} × ${product.name} agregado al carrito`);
  };

  return (
    <div className="flex max-h-[92dvh] flex-col sm:grid sm:max-h-[min(88dvh,720px)] sm:grid-cols-[1.05fr_1fr]">
      <IconButton
        label="Cerrar detalle"
        onClick={onDone}
        className="absolute right-3 top-3 z-10 bg-ink/70 backdrop-blur hover:bg-ink"
      >
        <X className="size-5" />
      </IconButton>

      <ProductImage
        image={product.image}
        name={product.name}
        categoryId={product.categoryId}
        sizes="(min-width: 640px) 420px, 100vw"
        priority
        className="aspect-[16/10] w-full shrink-0 sm:aspect-auto sm:h-full"
      />

      <div className="flex min-h-0 flex-col">
        <div className="min-h-0 flex-1 overflow-y-auto overscroll-contain px-5 pb-4 pt-5 sm:px-7 sm:pt-8">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-brand">
            {category.name}
          </p>
          <h2
            id="product-title"
            className="mt-1 pr-10 font-display text-[2.1rem] uppercase leading-[0.95] tracking-wide sm:text-[2.6rem]"
          >
            {product.name}
          </h2>
          {product.tags && product.tags.length > 0 && (
            <ul className="mt-3 flex flex-wrap gap-1.5">
              {product.tags.map((t) => (
                <li
                  key={t}
                  className="rounded-full bg-brand/10 px-2.5 py-1 text-[0.7rem] font-semibold uppercase tracking-wider text-brand"
                >
                  {productTags[t].label}
                </li>
              ))}
            </ul>
          )}
          <p className="price mt-4 text-2xl font-bold">{formatCOP(variant?.price ?? product.price)}</p>

          {product.description ? (
            <p className="mt-4 leading-relaxed text-paper/80">{product.description}</p>
          ) : (
            <p className="mt-4 flex gap-2.5 rounded-xl bg-white/[0.04] p-3 text-sm leading-relaxed text-muted">
              <Info className="mt-0.5 size-4 shrink-0 text-brand" aria-hidden="true" />
              Pronto publicaremos los ingredientes de este producto. Si tienes alguna preferencia,
              escríbela en las observaciones.
            </p>
          )}
          {product.ingredients && product.ingredients.length > 0 && (
            <ul className="mt-3 flex flex-wrap gap-1.5" aria-label="Ingredientes">
              {product.ingredients.map((ing) => (
                <li key={ing} className="rounded-full border border-white/10 px-2.5 py-1 text-xs text-paper/80">
                  {ing}
                </li>
              ))}
            </ul>
          )}

          {/* Variantes (solo si están configuradas) */}
          {product.variants && product.variants.length > 0 && (
            <fieldset className="mt-6">
              <legend className="text-sm font-semibold">Elige una opción</legend>
              <div className="mt-2 grid gap-2">
                {product.variants.map((v) => (
                  <label
                    key={v.id}
                    className={cn(
                      "flex cursor-pointer items-center justify-between rounded-xl border px-4 py-3 transition-colors has-[:focus-visible]:ring-2 has-[:focus-visible]:ring-brand",
                      v.id === variantId ? "border-brand bg-brand/10" : "border-white/10 hover:border-white/25",
                    )}
                  >
                    <span className="flex items-center gap-3">
                      <input
                        type="radio"
                        name="variant"
                        value={v.id}
                        checked={v.id === variantId}
                        onChange={() => setVariantId(v.id)}
                        className="size-4 accent-[#ff7900]"
                      />
                      {v.name}
                    </span>
                    <span className="price text-sm font-semibold">{formatCOP(v.price)}</span>
                  </label>
                ))}
              </div>
            </fieldset>
          )}

          {/* Adicionales (solo si están configurados) */}
          {product.optionGroups?.map((group) => (
            <fieldset key={group.id} className="mt-6">
              <legend className="text-sm font-semibold">
                {group.name}
                <span className="ml-2 font-normal text-muted">
                  {group.maxSelect ? `Máx. ${group.maxSelect}` : "Opcional"}
                </span>
              </legend>
              <div className="mt-2 grid gap-2">
                {group.options.map((opt) => {
                  const checked = optionIds.includes(opt.id);
                  return (
                    <label
                      key={opt.id}
                      className={cn(
                        "flex cursor-pointer items-center justify-between rounded-xl border px-4 py-3 transition-colors has-[:focus-visible]:ring-2 has-[:focus-visible]:ring-brand",
                        checked ? "border-brand bg-brand/10" : "border-white/10 hover:border-white/25",
                      )}
                    >
                      <span className="flex items-center gap-3">
                        <input
                          type="checkbox"
                          checked={checked}
                          onChange={() => toggleOption(group.id, opt.id)}
                          className="sr-only"
                        />
                        <span
                          aria-hidden="true"
                          className={cn(
                            "grid size-5 place-items-center rounded-md border",
                            checked ? "border-brand bg-brand text-ink" : "border-white/30",
                          )}
                        >
                          {checked && <Check className="size-3.5" strokeWidth={3} />}
                        </span>
                        {opt.name}
                      </span>
                      <span className="price text-sm font-semibold text-paper/85">
                        + {formatCOP(opt.price)}
                      </span>
                    </label>
                  );
                })}
              </div>
            </fieldset>
          ))}

          <div className="mt-6">
            <label htmlFor="product-notes" className="text-sm font-semibold">
              Observaciones <span className="font-normal text-muted">(opcional)</span>
            </label>
            <textarea
              id="product-notes"
              rows={2}
              maxLength={MAX_NOTES_LENGTH}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Ej.: sin cebolla, salsas aparte…"
              className="mt-2 w-full resize-none rounded-xl border border-white/10 bg-ink px-4 py-3 text-[0.95rem] text-paper placeholder:text-muted/70 focus:border-brand focus:outline-none"
            />
            <p className="mt-1 text-right text-xs text-muted">
              {notes.length}/{MAX_NOTES_LENGTH}
            </p>
          </div>
        </div>

        {/* Pie fijo con cantidad y total */}
        <div className="border-t border-white/[0.07] bg-ink-2 px-5 pb-[max(1rem,env(safe-area-inset-bottom))] pt-4 sm:px-7">
          {product.available ? (
            <>
              <div className="flex items-center justify-between gap-4">
                <QuantityStepper value={quantity} onChange={setQuantity} label={product.name} />
                <div className="text-right">
                  <p className="text-xs text-muted">Total</p>
                  <p className="price text-xl font-bold" aria-live="polite">
                    {formatCOP(total)}
                  </p>
                </div>
              </div>
              <div className="mt-3 grid grid-cols-[1fr_auto] gap-2">
                <Button size="lg" onClick={() => handleAdd(false)} data-autofocus className="px-4">
                  <ShoppingBag className="size-5" aria-hidden="true" />
                  Agregar al carrito
                </Button>
                <Button
                  size="lg"
                  variant="secondary"
                  onClick={() => handleAdd(true)}
                  className="px-4"
                  aria-label="Agregar e ir al carrito"
                >
                  <span aria-hidden="true">Ir a pagar</span>
                </Button>
              </div>
            </>
          ) : (
            <p className="py-2 text-center font-semibold text-muted">
              Este producto no está disponible por ahora.
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
