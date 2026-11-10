"use client";

import { MessageCircleWarning } from "lucide-react";
import { useCartStore } from "@/store/cart";
import { emptyCheckout, useUIStore } from "@/store/ui";
import { Button, buttonClasses } from "@/components/ui/Button";
import { WhatsAppIcon } from "@/components/ui/BrandIcons";

/**
 * Pantalla posterior a abrir WhatsApp. NO afirma que el pedido fue recibido:
 * la compra se completa cuando el cliente envía el mensaje.
 */
export function OrderSent() {
  const url = useUIStore((s) => s.lastOrderUrl);
  const closeCart = useUIStore((s) => s.closeCart);
  const setCartView = useUIStore((s) => s.setCartView);
  const setDraft = useUIStore((s) => s.setCheckoutDraft);
  const draft = useUIStore((s) => s.checkoutDraft);
  const clear = useCartStore((s) => s.clear);

  const startNew = () => {
    clear();
    // Conserva nombre y teléfono para el próximo pedido; limpia lo demás.
    setDraft({ ...emptyCheckout, name: draft.name, phone: draft.phone });
    setCartView("cart");
    closeCart();
  };

  return (
    <div className="flex flex-1 flex-col items-center justify-center overflow-y-auto px-7 py-10 text-center">
      <span className="grid size-20 place-items-center rounded-full bg-[#25D366]/15 text-[#25D366]">
        <WhatsAppIcon className="size-10" />
      </span>
      <p className="mt-6 font-display text-3xl uppercase leading-none tracking-wide">
        Envía el mensaje en WhatsApp
      </p>
      <p className="mt-3 max-w-xs text-muted">
        Abrimos WhatsApp con tu pedido listo. <strong className="text-paper">Tu pedido se completa
        cuando presiones enviar</strong> en el chat con {"FULLETIAO"}.
      </p>

      <div className="mt-5 flex max-w-xs gap-2.5 rounded-xl bg-white/[0.04] p-3 text-left text-sm text-muted">
        <MessageCircleWarning className="mt-0.5 size-4 shrink-0 text-brand" aria-hidden="true" />
        ¿No se abrió WhatsApp? Tu navegador pudo bloquear la ventana. Usa el botón de abajo.
      </div>

      {url && (
        <a
          href={url}
          target="_blank"
          rel="noopener noreferrer"
          className={buttonClasses("whatsapp", "lg", "mt-7 w-full max-w-xs")}
          data-autofocus
        >
          <WhatsAppIcon className="size-5" />
          Abrir WhatsApp de nuevo
        </a>
      )}
      <Button variant="secondary" size="lg" className="mt-3 w-full max-w-xs" onClick={startNew}>
        Ya lo envié · Nuevo pedido
      </Button>
      <button
        type="button"
        onClick={() => setCartView("cart")}
        className="mt-4 rounded px-2 py-1 text-sm text-muted hover:text-paper"
      >
        Volver a mi carrito
      </button>
    </div>
  );
}
