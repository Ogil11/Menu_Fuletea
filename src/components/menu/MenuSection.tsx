"use client";

import { useDeferredValue, useMemo, useState } from "react";
import { AnimatePresence } from "motion/react";
import { Search, SearchX, X } from "lucide-react";
import { categories, categoryById, products } from "@/data/catalog";
import { filterProducts } from "@/lib/search";
import { cn } from "@/lib/cn";
import { useUIStore } from "@/store/ui";
import type { CategoryFilter } from "@/types";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Button } from "@/components/ui/Button";
import { ProductCard } from "./ProductCard";

const filters: { id: CategoryFilter; label: string }[] = [
  { id: "todos", label: "Todos" },
  ...categories.map((c) => ({ id: c.id, label: c.name })),
];

export function MenuSection() {
  const category = useUIStore((s) => s.category);
  const setCategory = useUIStore((s) => s.setCategory);
  const [query, setQuery] = useState("");
  const deferredQuery = useDeferredValue(query);

  const results = useMemo(
    () => filterProducts(products, category, deferredQuery),
    [category, deferredQuery],
  );

  const countFor = (id: CategoryFilter) =>
    id === "todos" ? products.length : products.filter((p) => p.categoryId === id).length;

  const resetFilters = () => {
    setQuery("");
    setCategory("todos");
  };

  const heading = category === "todos" ? "Toda la carta" : categoryById[category].name;

  return (
    <section id="menu" aria-labelledby="menu-title" className="relative py-20 sm:py-28">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <SectionHeading
          id="menu-title"
          eyebrow="La carta"
          title="Nuestro menú"
          description="Elige tu antojo, personalízalo y arma tu pedido. Precios en pesos colombianos."
        />

        {/* Barra de filtros: fija bajo el header al hacer scroll */}
        <div className="sticky top-[var(--header-h)] z-30 -mx-4 mt-10 border-b border-white/[0.06] bg-ink/90 px-4 pb-3 pt-3 backdrop-blur-xl sm:-mx-6 sm:px-6 lg:-mx-8 lg:px-8">
          <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
            <div
              role="tablist"
              aria-label="Categorías del menú"
              className="no-scrollbar -mx-4 flex gap-2 overflow-x-auto px-4 sm:mx-0 sm:px-0"
            >
              {filters.map((f) => {
                const active = f.id === category;
                return (
                  <button
                    key={f.id}
                    type="button"
                    role="tab"
                    aria-selected={active}
                    aria-controls="menu-grid"
                    onClick={() => setCategory(f.id)}
                    className={cn(
                      "inline-flex h-10 shrink-0 items-center gap-2 rounded-full border px-4 text-sm font-semibold transition-colors",
                      active
                        ? "border-brand bg-brand text-ink"
                        : "border-white/12 bg-ink-2 text-paper/85 hover:border-white/30 hover:text-paper",
                    )}
                  >
                    {f.label}
                    <span
                      className={cn(
                        "price rounded-full px-1.5 text-[0.7rem] leading-5",
                        active ? "bg-ink/15" : "bg-white/[0.07] text-muted",
                      )}
                    >
                      {countFor(f.id)}
                    </span>
                  </button>
                );
              })}
            </div>

            <div className="relative w-full lg:max-w-xs">
              <label htmlFor="menu-search" className="sr-only">
                Buscar en el menú
              </label>
              <Search
                aria-hidden="true"
                className="pointer-events-none absolute left-4 top-1/2 size-4 -translate-y-1/2 text-muted"
              />
              <input
                id="menu-search"
                type="search"
                inputMode="search"
                autoComplete="off"
                placeholder="Buscar: ranchero, hit, mixta…"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                className="h-11 w-full rounded-full border border-white/12 bg-ink-2 pl-11 pr-10 text-[0.95rem] text-paper placeholder:text-muted/80 transition-colors focus:border-brand focus:outline-none [&::-webkit-search-cancel-button]:hidden"
              />
              {query && (
                <button
                  type="button"
                  onClick={() => setQuery("")}
                  aria-label="Borrar búsqueda"
                  className="absolute right-2 top-1/2 inline-flex size-8 -translate-y-1/2 items-center justify-center rounded-full text-muted hover:bg-white/10 hover:text-paper"
                >
                  <X className="size-4" />
                </button>
              )}
            </div>
          </div>
        </div>

        <div className="mt-8 flex items-baseline justify-between gap-4">
          <h3 className="font-display text-2xl uppercase tracking-wide sm:text-3xl">{heading}</h3>
          <p className="text-sm text-muted" aria-live="polite">
            {results.length} {results.length === 1 ? "producto" : "productos"}
            {deferredQuery.trim() && ` para “${deferredQuery.trim()}”`}
          </p>
        </div>

        <div
          id="menu-grid"
          role="tabpanel"
          aria-label={heading}
          className="mt-6 grid grid-cols-1 gap-4 min-[480px]:grid-cols-2 sm:gap-5 md:grid-cols-3 xl:grid-cols-4"
        >
          <AnimatePresence mode="popLayout" initial={false}>
            {results.map((p, i) => (
              <ProductCard key={p.id} product={p} priority={i < 2} />
            ))}
          </AnimatePresence>
        </div>

        {results.length === 0 && (
          <div className="mx-auto mt-4 flex max-w-md flex-col items-center rounded-card border border-dashed border-white/12 px-6 py-14 text-center">
            <span className="grid size-14 place-items-center rounded-full bg-brand/10 text-brand">
              <SearchX className="size-6" aria-hidden="true" />
            </span>
            <p className="mt-4 font-display text-2xl uppercase tracking-wide">Nada por aquí</p>
            <p className="mt-2 text-sm text-muted">
              No encontramos productos
              {deferredQuery.trim() ? ` que coincidan con “${deferredQuery.trim()}”` : ""}
              {category !== "todos" ? ` en ${categoryById[category].name}` : ""}. Prueba con otra
              palabra o revisa toda la carta.
            </p>
            <Button variant="secondary" className="mt-6" onClick={resetFilters}>
              Ver toda la carta
            </Button>
          </div>
        )}
      </div>
    </section>
  );
}
