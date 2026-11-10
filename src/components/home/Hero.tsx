import Image from "next/image";
import { ArrowDown } from "lucide-react";
import { business } from "@/data/business";
import { categories, lowestPriceByCategory } from "@/data/catalog";
import { formatCOP } from "@/lib/format";
import { greetingUrl } from "@/lib/whatsapp";
import { buttonClasses } from "@/components/ui/Button";
import { WhatsAppIcon } from "@/components/ui/BrandIcons";
import { BrushStroke, Splatter } from "@/components/ui/Decorations";
import { CategoryIllustration } from "@/components/menu/CategoryIllustration";

/** Categorías de comida que aparecen en el "tablero" del hero. */
const BOARD = categories.filter((c) => c.id !== "bebidas" && c.id !== "adicionales");

export function Hero() {
  const { heroImage } = business;

  return (
    <section
      id="inicio"
      aria-labelledby="hero-title"
      className="grain relative isolate overflow-hidden pt-[var(--header-h)]"
    >
      {/* Iluminación naranja y gradientes */}
      <div aria-hidden="true" className="absolute inset-0 -z-10">
        <div className="absolute -right-[20%] -top-[10%] size-[70vmax] rounded-full bg-[radial-gradient(closest-side,rgb(255_121_0/0.35),transparent)]" />
        <div className="absolute -bottom-[30%] -left-[25%] size-[60vmax] rounded-full bg-[radial-gradient(closest-side,rgb(194_92_0/0.22),transparent)]" />
        <div className="absolute inset-0 bg-[linear-gradient(to_bottom,transparent_60%,var(--color-ink))]" />
        <Splatter className="absolute right-[6%] top-[18%] size-40 text-brand/[0.07] sm:size-64" />
      </div>

      <div className="mx-auto grid max-w-7xl items-center gap-12 px-4 pb-16 pt-10 sm:px-6 sm:pt-16 lg:min-h-[calc(100svh-var(--header-h))] lg:grid-cols-[1.15fr_1fr] lg:gap-8 lg:px-8 lg:pb-24">
        <div>
          <p className="inline-flex items-center gap-2 rounded-full border border-brand/30 bg-brand/10 px-3.5 py-1.5 text-xs font-semibold uppercase tracking-[0.2em] text-brand">
            <span className="size-1.5 rounded-full bg-brand" aria-hidden="true" />
            Comidas rápidas · Colombia
          </p>

          <h1
            id="hero-title"
            className="mt-6 font-display text-[clamp(3.4rem,11.5vw,7.6rem)] uppercase leading-[0.94] tracking-tight"
          >
            El sabor
            <br />
            que <span className="relative inline-block text-brand">
              manda
              <BrushStroke className="absolute -bottom-[0.06em] left-[-4%] -z-10 h-[0.32em] w-[108%] text-brand/25" />
            </span>
            <br />
            <span className="text-outline">en la calle</span>
          </h1>

          <p className="mt-6 max-w-md font-marker text-2xl text-paper/90 -rotate-1 sm:text-3xl">
            {business.secondarySlogan}.
          </p>

          <div className="mt-9 flex flex-col gap-3 min-[420px]:flex-row">
            <a href="#menu" className={buttonClasses("primary", "lg")}>
              Explorar menú
              <ArrowDown className="size-5" aria-hidden="true" />
            </a>
            <a
              href={greetingUrl()}
              target="_blank"
              rel="noopener noreferrer"
              className={buttonClasses("secondary", "lg")}
            >
              <WhatsAppIcon className="size-5 text-[#25D366]" />
              Pedir por WhatsApp
            </a>
          </div>
        </div>

        {heroImage ? (
          <div className="relative mx-auto aspect-[4/5] w-full max-w-md overflow-hidden rounded-[2rem] ring-1 ring-white/10 lg:max-w-none">
            <Image
              src={heroImage.src}
              alt={heroImage.alt}
              fill
              priority
              sizes="(min-width: 1024px) 45vw, 90vw"
              className="object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-ink/70 via-transparent" />
          </div>
        ) : (
          <MenuBoard />
        )}
      </div>
    </section>
  );
}

/**
 * Composición gráfica tipo "tablero callejero" con precios reales "desde".
 * Se usa mientras no haya una fotografía real del negocio para el hero.
 */
function MenuBoard() {
  return (
    <div className="relative mx-auto w-full max-w-md lg:max-w-none">
      <div className="absolute -inset-6 -z-10 rounded-[2.5rem] bg-brand/10 blur-2xl" aria-hidden="true" />
      <div className="relative rotate-[1.5deg] rounded-[2rem] border border-white/10 bg-ink-2/90 p-6 shadow-2xl backdrop-blur sm:p-8">
        <div className="flex items-center justify-between">
          <p className="font-display text-3xl uppercase tracking-wide">La carta</p>
          <span className="-rotate-6 rounded-md bg-brand px-2.5 py-1 font-marker text-sm text-ink">
            ¡Pide ya!
          </span>
        </div>
        <ul className="mt-6 divide-y divide-dashed divide-white/10">
          {BOARD.map((c) => (
            <li key={c.id}>
              <a href="#menu" className="group flex items-center gap-4 py-3.5">
                <span className="grid size-12 shrink-0 place-items-center rounded-2xl bg-brand/10 text-brand transition-colors group-hover:bg-brand group-hover:text-ink">
                  <CategoryIllustration categoryId={c.id} className="size-8" />
                </span>
                <span className="flex-1 font-display text-xl uppercase tracking-wide transition-colors group-hover:text-brand">
                  {c.name}
                </span>
                <span className="text-right">
                  <span className="block text-[0.65rem] uppercase tracking-widest text-muted">Desde</span>
                  <span className="price font-bold">{formatCOP(lowestPriceByCategory(c.id))}</span>
                </span>
              </a>
            </li>
          ))}
        </ul>
        <p className="mt-5 text-center text-xs text-muted">
          También bebidas y adicionales · Precios en COP
        </p>
      </div>
    </div>
  );
}
