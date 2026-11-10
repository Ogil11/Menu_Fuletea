"use client";

import { useState } from "react";
import { MessageSquareText, Trash2 } from "lucide-react";
import { motion } from "motion/react";
import { MAX_NOTES_LENGTH, lineTotal, unitPrice } from "@/lib/cart";
import { formatCOP } from "@/lib/format";
import { useCartStore } from "@/store/cart";
import type { CartItem } from "@/types";
import { IconButton } from "@/components/ui/Button";
import { QuantityStepper } from "@/components/ui/QuantityStepper";
import { ProductImage } from "@/components/menu/ProductImage";

export function CartItemRow({ item }: { item: CartItem }) {
  const setQuantity = useCartStore((s) => s.setQuantity);
  const removeItem = useCartStore((s) => s.removeItem);
  const setNotes = useCartStore((s) => s.setNotes);
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState(item.notes);
  const notesId = `notes-${item.lineId}`;

  const saveNotes = () => {
    setNotes(item.lineId, draft);
    setEditing(false);
  };

  return (
    <motion.li
      layout
      initial={{ opacity: 0, x: 16 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 40, height: 0, marginTop: 0, paddingTop: 0, paddingBottom: 0 }}
      transition={{ duration: 0.22 }}
      className="flex gap-3 border-b border-white/[0.06] py-4 last:border-b-0"
    >
      <ProductImage
        image={item.image}
        name={item.name}
        categoryId={item.categoryId}
        sizes="72px"
        showName={false}
        className="size-[4.5rem] shrink-0 rounded-xl"
      />

      <div className="min-w-0 flex-1">
        <div className="flex items-start justify-between gap-2">
          <div className="min-w-0">
            <p className="font-semibold leading-tight">{item.name}</p>
            {item.variant && <p className="text-sm text-muted">{item.variant.name}</p>}
            {item.options.length > 0 && (
              <p className="text-sm text-muted">+ {item.options.map((o) => o.name).join(", ")}</p>
            )}
            <p className="price mt-0.5 text-xs text-muted">{formatCOP(unitPrice(item))} c/u</p>
          </div>
          <IconButton
            label={`Eliminar ${item.name}`}
            onClick={() => removeItem(item.lineId)}
            className="-mr-2 -mt-1 size-9 text-muted hover:bg-danger/10 hover:text-danger"
          >
            <Trash2 className="size-4" />
          </IconButton>
        </div>

        {editing ? (
          <div className="mt-2">
            <label htmlFor={notesId} className="sr-only">
              Observaciones para {item.name}
            </label>
            <textarea
              id={notesId}
              rows={2}
              autoFocus
              maxLength={MAX_NOTES_LENGTH}
              value={draft}
              onChange={(e) => setDraft(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  saveNotes();
                }
              }}
              placeholder="Ej.: sin cebolla"
              className="w-full resize-none rounded-lg border border-white/10 bg-ink px-3 py-2 text-sm placeholder:text-muted/70 focus:border-brand focus:outline-none"
            />
            <div className="mt-1 flex justify-end gap-2 text-sm">
              <button
                type="button"
                className="rounded-full px-3 py-1 text-muted hover:text-paper"
                onClick={() => {
                  setDraft(item.notes);
                  setEditing(false);
                }}
              >
                Cancelar
              </button>
              <button
                type="button"
                className="rounded-full bg-white/10 px-3 py-1 font-semibold hover:bg-white/15"
                onClick={saveNotes}
              >
                Guardar
              </button>
            </div>
          </div>
        ) : (
          <button
            type="button"
            onClick={() => {
              setDraft(item.notes);
              setEditing(true);
            }}
            className="mt-1.5 flex max-w-full items-start gap-1.5 rounded text-left text-sm text-muted hover:text-paper"
          >
            <MessageSquareText className="mt-0.5 size-3.5 shrink-0 text-brand" aria-hidden="true" />
            <span className="line-clamp-2">
              {item.notes ? item.notes : "Agregar observación"}
            </span>
            <span className="sr-only"> (editar observación de {item.name})</span>
          </button>
        )}

        <div className="mt-2.5 flex items-center justify-between">
          <QuantityStepper
            size="sm"
            removable
            value={item.quantity}
            label={item.name}
            onChange={(q) => setQuantity(item.lineId, q)}
          />
          <p className="price font-bold">{formatCOP(lineTotal(item))}</p>
        </div>
      </div>
    </motion.li>
  );
}
