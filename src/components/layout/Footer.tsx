import { activeSocials, business } from "@/data/business";
import { categories } from "@/data/catalog";
import { FacebookIcon, InstagramIcon, TikTokIcon, WhatsAppIcon } from "@/components/ui/BrandIcons";
import { NAV_LINKS } from "@/data/navigation";
import { Logo } from "./Logo";

const SOCIAL_ICONS = { instagram: InstagramIcon, facebook: FacebookIcon, tiktok: TikTokIcon };

export function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="relative border-t border-white/[0.07] bg-[#0b0b0b] pb-28 pt-16 md:pb-12">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid gap-10 md:grid-cols-[1.4fr_1fr_1fr]">
          <div>
            <Logo />
            <p className="mt-4 max-w-xs font-marker text-xl text-paper/85">{business.slogan}.</p>
            <p className="mt-1 text-sm text-muted">{business.secondarySlogan}.</p>
            <ul className="mt-6 flex gap-2">
              <li>
                <a
                  href={`https://wa.me/${business.whatsapp.number}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="WhatsApp"
                  className="grid size-11 place-items-center rounded-full bg-white/[0.06] text-paper transition-colors hover:bg-[#25D366] hover:text-ink"
                >
                  <WhatsAppIcon className="size-5" />
                </a>
              </li>
              {activeSocials.map((s) => {
                const Icon = SOCIAL_ICONS[s.network];
                return (
                  <li key={s.network}>
                    <a
                      href={s.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label={s.label}
                      className="grid size-11 place-items-center rounded-full bg-white/[0.06] text-paper transition-colors hover:bg-brand hover:text-ink"
                    >
                      <Icon className="size-5" />
                    </a>
                  </li>
                );
              })}
            </ul>
          </div>

          <nav aria-label="Pie de página">
            <p className="font-display text-lg uppercase tracking-wide text-brand">Navegación</p>
            <ul className="mt-4 space-y-2.5">
              {NAV_LINKS.map((l) => (
                <li key={l.href}>
                  <a href={l.href} className="text-paper/75 transition-colors hover:text-paper">
                    {l.label}
                  </a>
                </li>
              ))}
            </ul>
          </nav>

          <div>
            <p className="font-display text-lg uppercase tracking-wide text-brand">La carta</p>
            <ul className="mt-4 space-y-2.5">
              {categories.map((c) => (
                <li key={c.id}>
                  <a href="#menu" className="text-paper/75 transition-colors hover:text-paper">
                    {c.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="mt-14 flex flex-col gap-3 border-t border-white/[0.07] pt-6 text-sm text-muted sm:flex-row sm:items-center sm:justify-between">
          <p>
            © {year} {business.name}. Todos los derechos reservados.
          </p>
          <p>Precios en pesos colombianos (COP).</p>
        </div>
      </div>

      {/* Marca de agua tipográfica */}
      <p
        aria-hidden="true"
        className="pointer-events-none mx-auto mt-10 select-none overflow-hidden whitespace-nowrap text-center font-display text-[18vw] uppercase leading-[0.8] text-white/[0.03]"
      >
        Fulletiao
      </p>
    </footer>
  );
}
