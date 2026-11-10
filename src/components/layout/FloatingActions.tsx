"use client";

import { useEffect } from "react";
import { AnimatePresence, motion } from "motion/react";
import { CircleCheck, ShoppingBag } from "lucide-react";
import { useCart } from "@/hooks/useCart";
import { formatCOP } from "@/lib/format";
import { greetingUrl } from "@/lib/whatsapp";
import { useUIStore } from "@/store/ui";
import { WhatsAppIcon } from "@/components/ui/BrandIcons";

/** Botón flotante de WhatsApp, barra de carrito en móvil y toast. */
export function FloatingActions() {
  const { count, subtotal } = useCart();
  const openCart = useUIStore((s) => s.openCart);
  const cartOpen = useUIStore((s) => s.cartOpen);
  const productOpen = useUIStore((s) => s.productId !== null);
  const toast = useUIStore((s) => s.toast);
  const hideToast = useUIStore((s) => s.hideToast);

  useEffect(() => {
    if (!toast) return;
    const t = window.setTimeout(hideToast, 2600);
    return () => window.clearTimeout(t);
  }, [toast, hideToast]);

  const hidden = cartOpen || productOpen;
  const showBar = count > 0 && !hidden;

  return (
    <>
      {/* Toast accesible */}
      <div
        aria-live="polite"
        className="pointer-events-none fixed inset-x-0 top-[calc(var(--header-h)+0.75rem)] z-50 flex justify-center px-4"
      >
        <AnimatePresence>
          {toast && (
            <motion.div
              key={toast.id}
              role="status"
              initial={{ opacity: 0, y: -12, scale: 0.96 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -12, scale: 0.96 }}
              className="pointer-events-auto flex items-center gap-2.5 rounded-full border border-white/10 bg-ink-2/95 py-2.5 pl-3 pr-2 text-sm font-medium shadow-xl backdrop-blur"
            >
              <CircleCheck className="size-5 text-success" aria-hidden="true" />
              {toast.message}
              <button
                type="button"
                onClick={() => {
                  hideToast();
                  openCart();
                }}
                className="rounded-full bg-brand px-3 py-1 text-xs font-bold text-ink hover:bg-brand-strong"
              >
                Ver carrito
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Barra de carrito (móvil) */}
      <AnimatePresence>
        {showBar && (
          <motion.div
            initial={{ y: 90 }}
            animate={{ y: 0 }}
            exit={{ y: 90 }}
            transition={{ type: "spring", damping: 28, stiffness: 320 }}
            className="fixed inset-x-0 bottom-0 z-40 px-3 pb-[max(0.75rem,env(safe-area-inset-bottom))] md:hidden"
          >
            <button
              type="button"
              onClick={() => openCart()}
              className="flex h-14 w-full items-center justify-between gap-3 rounded-full bg-brand pl-2 pr-5 font-semibold text-ink shadow-[0_14px_40px_-12px_rgb(255_121_0/0.9)] active:scale-[0.98]"
            >
              <span className="flex items-center gap-2.5">
                <span className="price grid size-10 place-items-center rounded-full bg-ink text-sm text-brand">
                  {count}
                </span>
                Ver mi pedido
              </span>
              <span className="price flex items-center gap-2">
                {formatCOP(subtotal)}
                <ShoppingBag className="size-5" aria-hidden="true" />
              </span>
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* WhatsApp flotante */}
      {!hidden && (
        <a
          href={greetingUrl()}
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Escríbenos por WhatsApp"
          className={`group fixed right-4 z-40 grid size-14 place-items-center rounded-full bg-[#25D366] text-[#06210f] shadow-[0_12px_30px_-8px_rgb(37_211_102/0.6)] transition-[transform,bottom] duration-300 hover:scale-105 sm:right-6 md:bottom-6 ${
            showBar ? "bottom-[5.5rem]" : "bottom-5"
          }`}
        >
          <span className="absolute inset-0 animate-ping rounded-full bg-[#25D366]/40 [animation-duration:2.6s] motion-reduce:hidden" aria-hidden="true" />
          <WhatsAppIcon className="relative size-7" />
        </a>
      )}
    </>
  );
}
