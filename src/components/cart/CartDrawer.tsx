"use client";

import { AnimatePresence } from "motion/react";
import { ArrowRight, ChevronLeft, ShoppingBag, X } from "lucide-react";
import { business } from "@/data/business";
import { formatCOP } from "@/lib/format";
import { useCart } from "@/hooks/useCart";
import { useCartStore } from "@/store/cart";
import { useUIStore } from "@/store/ui";
import { Dialog } from "@/components/ui/Dialog";
import { Button, IconButton } from "@/components/ui/Button";
import { CheckoutForm } from "@/components/checkout/CheckoutForm";
import { OrderSent } from "@/components/checkout/OrderSent";
import { CartItemRow } from "./CartItemRow";

const TITLES = { cart: "Tu pedido", checkout: "Finalizar pedido", sent: "Último paso" } as const;

export function CartDrawer() {
  const open = useUIStore((s) => s.cartOpen);
  const view = useUIStore((s) => s.cartView);
  const closeCart = useUIStore((s) => s.closeCart);
  const setCartView = useUIStore((s) => s.setCartView);
  const clear = useCartStore((s) => s.clear);
  const { items, count, subtotal } = useCart();

  const goToMenu = () => {
    closeCart();
    document.getElementById("menu")?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <Dialog open={open} onClose={closeCart} labelledBy="cart-title" variant="drawer">
      <header className="flex items-center gap-2 border-b border-white/[0.07] px-4 py-3 sm:px-5">
        {view === "checkout" && (
          <IconButton label="Volver al carrito" onClick={() => setCartView("cart")} className="-ml-2">
            <ChevronLeft className="size-5" />
          </IconButton>
        )}
        <h2 id="cart-title" className="flex-1 font-display text-2xl uppercase tracking-wide">
          {TITLES[view]}
          {view === "cart" && count > 0 && (
            <span className="price ml-2 align-middle font-sans text-sm font-semibold text-muted">
              ({count} {count === 1 ? "producto" : "productos"})
            </span>
          )}
        </h2>
        <IconButton label="Cerrar carrito" onClick={closeCart} className="-mr-2">
          <X className="size-5" />
        </IconButton>
      </header>

      {view === "sent" ? (
        <OrderSent />
      ) : items.length === 0 ? (
        <div className="flex flex-1 flex-col items-center justify-center px-8 text-center">
          <span className="grid size-20 place-items-center rounded-full bg-brand/10 text-brand">
            <ShoppingBag className="size-9" aria-hidden="true" />
          </span>
          <p className="mt-5 font-display text-3xl uppercase tracking-wide">Tu carrito está vacío</p>
          <p className="mt-2 max-w-xs text-muted">
            Antójate de algo de la carta y arma tu pedido en minutos.
          </p>
          <Button className="mt-7" size="lg" onClick={goToMenu} data-autofocus>
            Ver el menú
          </Button>
        </div>
      ) : view === "checkout" ? (
        <CheckoutForm />
      ) : (
        <>
          <ul className="min-h-0 flex-1 overflow-y-auto overscroll-contain px-4 sm:px-5" aria-label="Productos en el carrito">
            <AnimatePresence initial={false}>
              {items.map((item) => (
                <CartItemRow key={item.lineId} item={item} />
              ))}
            </AnimatePresence>
          </ul>

          <footer className="border-t border-white/[0.07] bg-ink-2 px-4 pb-[max(1rem,env(safe-area-inset-bottom))] pt-4 sm:px-5">
            <dl className="space-y-1.5 text-sm">
              <div className="flex justify-between">
                <dt className="text-muted">Subtotal</dt>
                <dd className="price font-semibold">{formatCOP(subtotal)}</dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-muted">Domicilio</dt>
                <dd className="text-muted">
                  {business.deliveryFee === null ? "Por confirmar" : formatCOP(business.deliveryFee)}
                </dd>
              </div>
            </dl>
            <Button
              size="lg"
              className="mt-4 w-full justify-between"
              onClick={() => setCartView("checkout")}
              data-autofocus
            >
              <span>Finalizar pedido</span>
              <span className="price flex items-center gap-2">
                {formatCOP(subtotal)}
                <ArrowRight className="size-5" aria-hidden="true" />
              </span>
            </Button>
            <div className="mt-2 flex justify-between text-sm">
              <button type="button" onClick={goToMenu} className="rounded px-1 py-1 text-muted hover:text-paper">
                Seguir comprando
              </button>
              <button
                type="button"
                onClick={() => {
                  if (window.confirm("¿Vaciar todo el carrito?")) clear();
                }}
                className="rounded px-1 py-1 text-muted hover:text-danger"
              >
                Vaciar carrito
              </button>
            </div>
          </footer>
        </>
      )}
    </Dialog>
  );
}
