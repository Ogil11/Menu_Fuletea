"use client";

import { useEffect, useRef } from "react";
import { AnimatePresence, motion } from "motion/react";
import { cn } from "@/lib/cn";

const FOCUSABLE =
  'a[href], button:not([disabled]), textarea:not([disabled]), input:not([disabled]), select:not([disabled]), [tabindex]:not([tabindex="-1"])';

interface DialogProps {
  open: boolean;
  onClose: () => void;
  /** id del título visible del diálogo (aria-labelledby). */
  labelledBy: string;
  /** "modal": centrado (hoja inferior en móvil). "drawer": lateral derecho. */
  variant?: "modal" | "drawer";
  className?: string;
  children: React.ReactNode;
}

/**
 * Diálogo accesible: role="dialog", aria-modal, cierre con Escape y clic
 * en el fondo, foco atrapado dentro, bloqueo de scroll y devolución del
 * foco al elemento que lo abrió.
 */
export function Dialog({
  open,
  onClose,
  labelledBy,
  variant = "modal",
  className,
  children,
}: DialogProps) {
  const panelRef = useRef<HTMLDivElement>(null);
  const onCloseRef = useRef(onClose);

  useEffect(() => {
    onCloseRef.current = onClose;
  }, [onClose]);

  useEffect(() => {
    if (!open) return;
    const previouslyFocused = document.activeElement as HTMLElement | null;
    const { overflow, paddingRight } = document.body.style;
    const scrollbar = window.innerWidth - document.documentElement.clientWidth;
    document.body.style.overflow = "hidden";
    if (scrollbar > 0) document.body.style.paddingRight = `${scrollbar}px`;

    const focusTimer = window.setTimeout(() => {
      const panel = panelRef.current;
      if (!panel) return;
      const preferred = panel.querySelector<HTMLElement>("[data-autofocus]");
      (preferred ?? panel).focus({ preventScroll: true });
    }, 30);

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        e.stopPropagation();
        onCloseRef.current();
        return;
      }
      if (e.key !== "Tab" || !panelRef.current) return;
      const nodes = Array.from(panelRef.current.querySelectorAll<HTMLElement>(FOCUSABLE)).filter(
        (n) => n.offsetParent !== null,
      );
      if (nodes.length === 0) return;
      const first = nodes[0]!;
      const last = nodes[nodes.length - 1]!;
      if (e.shiftKey && (document.activeElement === first || document.activeElement === panelRef.current)) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    };
    document.addEventListener("keydown", onKeyDown);

    return () => {
      window.clearTimeout(focusTimer);
      document.removeEventListener("keydown", onKeyDown);
      document.body.style.overflow = overflow;
      document.body.style.paddingRight = paddingRight;
      previouslyFocused?.focus?.({ preventScroll: true });
    };
  }, [open]);

  const isDrawer = variant === "drawer";

  return (
    <AnimatePresence>
      {open && (
        <div
          className={cn(
            "fixed inset-0 z-[60] flex",
            isDrawer ? "justify-end" : "items-end justify-center sm:items-center sm:p-6",
          )}
        >
          <motion.div
            aria-hidden="true"
            className="absolute inset-0 bg-black/70 backdrop-blur-[3px]"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={onClose}
          />
          <motion.div
            ref={panelRef}
            role="dialog"
            aria-modal="true"
            aria-labelledby={labelledBy}
            tabIndex={-1}
            className={cn(
              "relative flex w-full flex-col overflow-hidden bg-ink-2 text-paper shadow-2xl outline-none ring-1 ring-white/10",
              isDrawer
                ? "h-dvh max-w-md sm:rounded-l-[1.75rem]"
                : "max-h-[92dvh] rounded-t-[1.75rem] sm:max-w-3xl sm:rounded-[1.75rem]",
              className,
            )}
            initial={isDrawer ? { x: "100%" } : { y: 40, opacity: 0 }}
            animate={isDrawer ? { x: 0 } : { y: 0, opacity: 1 }}
            exit={isDrawer ? { x: "100%" } : { y: 40, opacity: 0 }}
            transition={{ type: "spring", damping: 32, stiffness: 340, mass: 0.8 }}
          >
            {children}
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
