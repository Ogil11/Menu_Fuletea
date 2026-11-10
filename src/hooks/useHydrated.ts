"use client";

import { useSyncExternalStore } from "react";

const subscribe = () => () => {};

/**
 * `true` solo en el navegador tras la hidratación. Evita discrepancias entre
 * el HTML del servidor (carrito vacío) y el carrito restaurado de localStorage.
 */
export function useHydrated(): boolean {
  return useSyncExternalStore(
    subscribe,
    () => true,
    () => false,
  );
}
