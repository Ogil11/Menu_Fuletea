"use client";

import { ArrowRight } from "lucide-react";
import { business } from "@/data/business";
import { useUIStore } from "@/store/ui";
import { Button } from "@/components/ui/Button";
import { CategoryIllustration } from "@/components/menu/CategoryIllustration";
import { Splatter } from "@/components/ui/Decorations";

/** Banner editable desde `business.promoBanner`. */
export function PromoBanner() {
  const banner = business.promoBanner;
  const setCategory = useUIStore((s) => s.setCategory);
  if (!banner.enabled) return null;

  const go = () => {
    setCategory(banner.ctaCategory);
    document.getElementById("menu")?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <section aria-labelledby="promo-title" className="px-4 py-8 sm:px-6 lg:px-8">
      <div className="grain relative isolate mx-auto max-w-7xl overflow-hidden rounded-[2rem] bg-brand px-6 py-10 text-ink sm:px-12 sm:py-14">
        <Splatter className="absolute -right-10 -top-10 -z-10 size-72 text-ink/[0.08]" />
        <CategoryIllustration
          categoryId={banner.ctaCategory}
          className="absolute -bottom-6 right-4 -z-10 size-44 rotate-[-8deg] text-ink/15 sm:right-12 sm:size-64"
        />
        <div className="max-w-xl">
          <p className="font-marker text-lg -rotate-2 inline-block">{banner.eyebrow}</p>
          <h2
            id="promo-title"
            className="mt-1 font-display text-[clamp(2.4rem,6vw,4rem)] uppercase leading-[0.92]"
          >
            {banner.title}
          </h2>
          <p className="mt-4 max-w-md text-base font-medium leading-relaxed text-ink/80 sm:text-lg">
            {banner.text}
          </p>
          <div className="mt-7 flex flex-wrap items-center gap-4">
            <Button
              onClick={go}
              size="lg"
              className="bg-ink text-paper shadow-none hover:bg-ink-2 hover:shadow-none"
            >
              {banner.ctaLabel}
              <ArrowRight className="size-5" aria-hidden="true" />
            </Button>
            {banner.highlight && (
              <span className="price rounded-full border-2 border-ink px-4 py-2 font-display text-xl uppercase tracking-wide">
                {banner.highlight}
              </span>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
