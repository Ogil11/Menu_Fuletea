"use client";

import { Plus } from "lucide-react";
import { motion } from "motion/react";
import { categoryById, productTags } from "@/data/catalog";
import { formatCOP } from "@/lib/format";
import { useUIStore } from "@/store/ui";
import type { Product } from "@/types";
import { ProductImage } from "./ProductImage";

export function ProductCard({ product, priority }: { product: Product; priority?: boolean }) {
  const openProduct = useUIStore((s) => s.openProduct);
  const category = categoryById[product.categoryId];
  const tags = (product.tags ?? []).map((t) => productTags[t]);
  const fromPrice = product.variants?.length
    ? Math.min(...product.variants.map((v) => v.price))
    : product.price;

  return (
    <motion.article
      layout="position"
      initial={{ opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.97 }}
      transition={{ duration: 0.25, ease: "easeOut" }}
      className="group relative flex flex-col overflow-hidden rounded-card border border-white/[0.07] bg-ink-2 transition-[border-color,box-shadow,transform] duration-300 hover:-translate-y-0.5 hover:border-brand/40 hover:shadow-glow"
    >
      <div className="relative">
        <ProductImage
          image={product.image}
          name={product.name}
          categoryId={product.categoryId}
          sizes="(min-width: 1280px) 22vw, (min-width: 768px) 30vw, (min-width: 480px) 45vw, 90vw"
          priority={priority}
          showName={false}
          className="aspect-[4/3] w-full"
        />
        {tags.length > 0 && (
          <ul className="absolute left-3 top-3 flex flex-wrap gap-1.5">
            {tags.map((tag) => (
              <li
                key={tag.id}
                className="rounded-full bg-ink/80 px-2.5 py-1 text-[0.68rem] font-semibold uppercase tracking-wider text-brand ring-1 ring-brand/40 backdrop-blur"
              >
                {tag.label}
              </li>
            ))}
          </ul>
        )}
        {!product.available && (
          <span className="absolute inset-0 grid place-items-center bg-ink/70 font-display text-2xl uppercase tracking-wider">
            Agotado
          </span>
        )}
      </div>

      <div className="flex flex-1 flex-col gap-3 p-4 sm:p-5">
        <div className="flex-1">
          <p className="text-[0.7rem] font-semibold uppercase tracking-[0.18em] text-muted">
            {category.name}
          </p>
          <h3 className="mt-1 font-display text-[1.45rem] uppercase leading-[1.05] tracking-wide">
            {/* El botón cubre toda la tarjeta para abrir el detalle */}
            <button
              type="button"
              onClick={() => openProduct(product.id)}
              className="text-left after:absolute after:inset-0 after:content-[''] focus-visible:outline-none group-has-[:focus-visible]:text-brand"
              aria-haspopup="dialog"
            >
              {product.name}
            </button>
          </h3>
          {product.description && (
            <p className="mt-1.5 line-clamp-2 text-sm leading-relaxed text-muted">
              {product.description}
            </p>
          )}
        </div>

        <div className="flex items-center justify-between gap-3">
          <p className="price text-lg font-bold">
            {product.variants?.length ? (
              <span className="mr-1 text-xs font-medium text-muted">Desde</span>
            ) : null}
            {formatCOP(fromPrice)}
          </p>
          <span
            aria-hidden="true"
            className="relative inline-flex h-10 items-center gap-1.5 rounded-full bg-brand pl-3 pr-4 text-sm font-semibold text-ink transition-colors group-hover:bg-brand-strong"
          >
            <Plus className="size-4" strokeWidth={2.75} />
            Agregar
          </span>
        </div>
      </div>
      {/* Anillo de foco visible para el botón que cubre la tarjeta */}
      <span
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 rounded-card ring-2 ring-brand ring-offset-2 ring-offset-ink opacity-0 transition-opacity group-has-[:focus-visible]:opacity-100"
      />
    </motion.article>
  );
}
