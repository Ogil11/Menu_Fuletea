"use client";

import { ArrowUpRight } from "lucide-react";
import { categoryById, featuredProducts, productTags } from "@/data/catalog";
import { formatCOP } from "@/lib/format";
import { useUIStore } from "@/store/ui";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { ProductImage } from "@/components/menu/ProductImage";
import { cn } from "@/lib/cn";

export function FeaturedProducts() {
  const openProduct = useUIStore((s) => s.openProduct);
  if (featuredProducts.length === 0) return null;

  return (
    <section aria-labelledby="featured-title" className="relative py-20 sm:py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <SectionHeading
          id="featured-title"
          eyebrow="Los que mandan"
          title="Destacados"
          description="Una selección de la carta para arrancar. Toca cualquiera para personalizarlo."
        />

        <ul className="no-scrollbar -mx-4 mt-10 flex snap-x snap-mandatory gap-4 overflow-x-auto px-4 pb-2 sm:mx-0 sm:grid sm:grid-cols-2 sm:overflow-visible sm:px-0 lg:grid-cols-3 xl:grid-cols-4">
          {featuredProducts.map((p, i) => {
            const tag = p.tags?.[0];
            return (
              <li
                key={p.id}
                className={cn(
                  "w-[78%] shrink-0 snap-start min-[480px]:w-[58%] sm:w-auto",
                  // Las dos primeras ocupan más espacio en pantallas grandes.
                  i < 2 && "xl:col-span-2",
                )}
              >
                <button
                  type="button"
                  onClick={() => openProduct(p.id)}
                  aria-haspopup="dialog"
                  className="group relative block w-full overflow-hidden rounded-card border border-white/[0.07] bg-ink-2 text-left transition-[border-color,box-shadow] duration-300 hover:border-brand/40 hover:shadow-glow"
                >
                  <ProductImage
                    image={p.image}
                    name={p.name}
                    categoryId={p.categoryId}
                    sizes="(min-width: 1280px) 33vw, (min-width: 640px) 45vw, 78vw"
                    showName={false}
                    className={cn("w-full", i < 2 ? "aspect-[16/10]" : "aspect-[4/3]")}
                  />
                  <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-ink via-ink/85 to-transparent p-4 pt-14 sm:p-5 sm:pt-16">
                    <div className="flex items-end justify-between gap-3">
                      <div className="min-w-0">
                        <p className="text-[0.7rem] font-semibold uppercase tracking-[0.18em] text-brand">
                          {tag ? productTags[tag].label : categoryById[p.categoryId].name}
                        </p>
                        <p className="mt-1 font-display text-2xl uppercase leading-none tracking-wide sm:text-[1.7rem]">
                          {p.name}
                        </p>
                        <p className="price mt-1.5 font-semibold text-paper/90">{formatCOP(p.price)}</p>
                      </div>
                      <span
                        aria-hidden="true"
                        className="grid size-11 shrink-0 place-items-center rounded-full bg-brand text-ink transition-transform duration-300 group-hover:rotate-45"
                      >
                        <ArrowUpRight className="size-5" />
                      </span>
                    </div>
                  </div>
                </button>
              </li>
            );
          })}
        </ul>
      </div>
    </section>
  );
}
