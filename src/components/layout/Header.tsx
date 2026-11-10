"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { Menu, ShoppingBag, X } from "lucide-react";
import { useCart } from "@/hooks/useCart";
import { useScrolled } from "@/hooks/useScrolled";
import { cn } from "@/lib/cn";
import { greetingUrl } from "@/lib/whatsapp";
import { useUIStore } from "@/store/ui";
import { WhatsAppIcon } from "@/components/ui/BrandIcons";
import { buttonClasses } from "@/components/ui/Button";
import { NAV_LINKS } from "@/data/navigation";
import { Logo } from "./Logo";

export function Header() {
  const scrolled = useScrolled();
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    if (!mobileOpen) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setMobileOpen(false);
    const onResize = () => window.innerWidth >= 768 && setMobileOpen(false);
    window.addEventListener("keydown", onKey);
    window.addEventListener("resize", onResize);
    return () => {
      window.removeEventListener("keydown", onKey);
      window.removeEventListener("resize", onResize);
    };
  }, [mobileOpen]);

  return (
    <header
      className={cn(
        "fixed inset-x-0 top-0 z-40 transition-[background-color,border-color,box-shadow] duration-300",
        scrolled || mobileOpen
          ? "border-b border-white/[0.07] bg-ink/85 shadow-[0_10px_30px_-20px_rgb(0_0_0/0.8)] backdrop-blur-xl"
          : "border-b border-transparent bg-transparent",
      )}
    >
      <div className="mx-auto flex h-[var(--header-h)] max-w-7xl items-center justify-between gap-4 px-4 sm:px-6 lg:px-8">
        <a href="#inicio" className="shrink-0 rounded-lg" aria-label="FULLETIAO FAST FOOD, ir al inicio">
          <Logo priority />
        </a>

        <nav aria-label="Principal" className="hidden md:block">
          <ul className="flex items-center gap-1">
            {NAV_LINKS.map((l) => (
              <li key={l.href}>
                <a
                  href={l.href}
                  className="relative rounded-full px-4 py-2 text-sm font-semibold text-paper/80 transition-colors hover:text-paper after:absolute after:inset-x-4 after:bottom-1 after:h-0.5 after:origin-left after:scale-x-0 after:rounded-full after:bg-brand after:transition-transform hover:after:scale-x-100"
                >
                  {l.label}
                </a>
              </li>
            ))}
          </ul>
        </nav>

        <div className="flex items-center gap-1.5">
          <a
            href={greetingUrl()}
            target="_blank"
            rel="noopener noreferrer"
            className={buttonClasses("secondary", "sm", "max-lg:hidden")}
          >
            <WhatsAppIcon className="size-4 text-[#25D366]" />
            Escríbenos
          </a>
          <CartButton />
          <button
            type="button"
            className="inline-flex size-11 items-center justify-center rounded-full text-paper hover:bg-white/10 md:hidden"
            aria-expanded={mobileOpen}
            aria-controls="mobile-nav"
            aria-label={mobileOpen ? "Cerrar menú de navegación" : "Abrir menú de navegación"}
            onClick={() => setMobileOpen((v) => !v)}
          >
            {mobileOpen ? <X className="size-6" /> : <Menu className="size-6" />}
          </button>
        </div>
      </div>

      <AnimatePresence>
        {mobileOpen && (
          <motion.nav
            id="mobile-nav"
            aria-label="Principal móvil"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.22, ease: "easeOut" }}
            className="overflow-hidden md:hidden"
          >
            <ul className="space-y-1 px-4 pb-5 pt-1">
              {NAV_LINKS.map((l, i) => (
                <motion.li
                  key={l.href}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.03 * i }}
                >
                  <a
                    href={l.href}
                    onClick={() => setMobileOpen(false)}
                    className="flex items-center justify-between rounded-2xl px-4 py-3.5 font-display text-2xl uppercase tracking-wide hover:bg-white/5"
                  >
                    {l.label}
                    <span className="text-brand" aria-hidden="true">→</span>
                  </a>
                </motion.li>
              ))}
              <li className="pt-2">
                <a
                  href={greetingUrl()}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={buttonClasses("whatsapp", "lg", "w-full")}
                >
                  <WhatsAppIcon className="size-5" />
                  Pedir por WhatsApp
                </a>
              </li>
            </ul>
          </motion.nav>
        )}
      </AnimatePresence>
    </header>
  );
}

function CartButton() {
  const { count } = useCart();
  const openCart = useUIStore((s) => s.openCart);

  return (
    <button
      type="button"
      onClick={() => openCart()}
      aria-label={`Abrir carrito, ${count} ${count === 1 ? "producto" : "productos"}`}
      className="relative inline-flex size-11 items-center justify-center rounded-full bg-white/[0.06] text-paper transition-colors hover:bg-white/[0.12]"
    >
      <ShoppingBag className="size-5" />
      <AnimatePresence>
        {count > 0 && (
          <motion.span
            key={count}
            initial={{ scale: 0.4, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.4, opacity: 0 }}
            transition={{ type: "spring", stiffness: 500, damping: 22 }}
            className="price absolute -right-0.5 -top-0.5 grid h-5 min-w-5 place-items-center rounded-full bg-brand px-1 text-[0.7rem] font-bold text-ink ring-2 ring-ink"
            aria-hidden="true"
          >
            {count > 99 ? "99+" : count}
          </motion.span>
        )}
      </AnimatePresence>
    </button>
  );
}
