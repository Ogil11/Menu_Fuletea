"use client";

import { Minus, Plus, Trash2 } from "lucide-react";
import { MAX_QUANTITY } from "@/lib/cart";
import { cn } from "@/lib/cn";

interface QuantityStepperProps {
  value: number;
  onChange: (value: number) => void;
  /** Nombre del producto para etiquetas accesibles. */
  label: string;
  min?: number;
  size?: "sm" | "md";
  /** Muestra papelera en lugar de "−" cuando el valor llega a 1 (carrito). */
  removable?: boolean;
}

export function QuantityStepper({
  value,
  onChange,
  label,
  min = 1,
  size = "md",
  removable = false,
}: QuantityStepperProps) {
  const btn = cn(
    "inline-flex items-center justify-center rounded-full text-paper transition-colors hover:bg-white/10 disabled:opacity-30 disabled:hover:bg-transparent",
    size === "sm" ? "size-8" : "size-10",
  );
  const showTrash = removable && value <= 1;

  return (
    <div
      role="group"
      aria-label={`Cantidad de ${label}`}
      className="inline-flex items-center rounded-full border border-white/12 bg-ink p-0.5"
    >
      <button
        type="button"
        className={cn(btn, showTrash && "text-danger hover:bg-danger/10")}
        onClick={() => onChange(value - 1)}
        disabled={!removable && value <= min}
        aria-label={showTrash ? `Eliminar ${label}` : `Quitar uno de ${label}`}
      >
        {showTrash ? <Trash2 className="size-4" /> : <Minus className="size-4" />}
      </button>
      <span
        aria-live="polite"
        className={cn("price text-center font-semibold", size === "sm" ? "w-7 text-sm" : "w-9")}
      >
        {value}
      </span>
      <button
        type="button"
        className={btn}
        onClick={() => onChange(value + 1)}
        disabled={value >= MAX_QUANTITY}
        aria-label={`Agregar uno más de ${label}`}
      >
        <Plus className="size-4" />
      </button>
    </div>
  );
}
