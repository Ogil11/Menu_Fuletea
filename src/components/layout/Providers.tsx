"use client";

import { MotionConfig } from "motion/react";
import { ProductModal } from "@/components/menu/ProductModal";
import { CartDrawer } from "@/components/cart/CartDrawer";
import { FloatingActions } from "./FloatingActions";

/**
 * - MotionConfig "user": respeta prefers-reduced-motion en todas las animaciones.
 * - Los diálogos se montan aquí (fuera del header) para que `position: fixed`
 *   no quede atrapado por elementos con backdrop-filter.
 */
export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <MotionConfig reducedMotion="user">
      {children}
      <FloatingActions />
      <ProductModal />
      <CartDrawer />
    </MotionConfig>
  );
}
