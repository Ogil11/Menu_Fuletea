"use client";

import { useRef, useState } from "react";
import { Banknote, Bike, Landmark, Store } from "lucide-react";
import { business } from "@/data/business";
import { cn } from "@/lib/cn";
import { formatCOP } from "@/lib/format";
import { LIMITS, validateCheckout } from "@/lib/validation";
import { buildOrderMessage, whatsappUrl } from "@/lib/whatsapp";
import { useCart } from "@/hooks/useCart";
import { useUIStore } from "@/store/ui";
import type { CheckoutData, CheckoutErrors } from "@/types";
import { Button } from "@/components/ui/Button";
import { WhatsAppIcon } from "@/components/ui/BrandIcons";

const FIELD_ORDER: (keyof CheckoutData)[] = ["name", "phone", "address", "reference", "notes"];

const inputClass = (error?: string) =>
  cn(
    "mt-1.5 w-full rounded-xl border bg-ink px-4 text-[0.95rem] text-paper placeholder:text-muted/70 transition-colors focus:outline-none",
    error ? "border-danger focus:border-danger" : "border-white/10 focus:border-brand",
  );

export function CheckoutForm() {
  const { items, subtotal } = useCart();
  const data = useUIStore((s) => s.checkoutDraft);
  const setData = useUIStore((s) => s.setCheckoutDraft);
  const setCartView = useUIStore((s) => s.setCartView);
  const setLastOrderUrl = useUIStore((s) => s.setLastOrderUrl);
  const [errors, setErrors] = useState<CheckoutErrors>({});
  const [submitted, setSubmitted] = useState(false);
  const formRef = useRef<HTMLFormElement>(null);

  const isDelivery = data.deliveryMode === "domicilio";
  const fee = business.deliveryFee;
  const total = isDelivery && fee !== null ? subtotal + fee : subtotal;

  const update = <K extends keyof CheckoutData>(key: K, value: CheckoutData[K]) => {
    const next = { ...data, [key]: value };
    setData(next);
    // Revalida en vivo después del primer intento de envío.
    if (submitted) setErrors(validateCheckout(next));
  };

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
    const result = validateCheckout(data);
    setErrors(result);

    const firstInvalid = FIELD_ORDER.find((k) => result[k]);
    if (firstInvalid) {
      formRef.current?.querySelector<HTMLElement>(`[name="${firstInvalid}"]`)?.focus();
      return;
    }

    const url = whatsappUrl(buildOrderMessage(items, data));
    setLastOrderUrl(url);
    // Se abre dentro del gesto del usuario para que el navegador no lo bloquee.
    window.open(url, "_blank", "noopener,noreferrer");
    setCartView("sent");
  };

  const errorId = (k: keyof CheckoutData) => (errors[k] ? `${k}-error` : undefined);
  const renderError = (field: keyof CheckoutData) =>
    errors[field] ? (
      <p id={`${field}-error`} className="mt-1.5 text-sm text-danger" role="alert">
        {errors[field]}
      </p>
    ) : null;

  return (
    <form ref={formRef} noValidate onSubmit={onSubmit} className="flex min-h-0 flex-1 flex-col">
      <div className="min-h-0 flex-1 space-y-6 overflow-y-auto overscroll-contain px-4 py-5 sm:px-5">
        {/* Datos de contacto */}
        <fieldset className="space-y-4">
          <legend className="mb-3 text-xs font-semibold uppercase tracking-[0.2em] text-brand">
            Tus datos
          </legend>
          <div>
            <label htmlFor="name" className="text-sm font-semibold">
              Nombre <span className="text-brand" aria-hidden="true">*</span>
            </label>
            <input
              id="name"
              name="name"
              autoComplete="name"
              data-autofocus
              required
              maxLength={LIMITS.name}
              value={data.name}
              onChange={(e) => update("name", e.target.value)}
              aria-invalid={!!errors.name}
              aria-describedby={errorId("name")}
              className={cn(inputClass(errors.name), "h-12")}
              placeholder="¿A nombre de quién?"
            />
            {renderError("name")}
          </div>
          <div>
            <label htmlFor="phone" className="text-sm font-semibold">
              Teléfono / WhatsApp <span className="text-brand" aria-hidden="true">*</span>
            </label>
            <input
              id="phone"
              name="phone"
              type="tel"
              inputMode="tel"
              autoComplete="tel-national"
              required
              maxLength={20}
              value={data.phone}
              onChange={(e) => update("phone", e.target.value.replace(/[^\d\s+()-]/g, ""))}
              aria-invalid={!!errors.phone}
              aria-describedby={errorId("phone")}
              className={cn(inputClass(errors.phone), "h-12")}
              placeholder="300 123 4567"
            />
            {renderError("phone")}
          </div>
        </fieldset>

        {/* Modalidad */}
        <fieldset>
          <legend className="mb-3 text-xs font-semibold uppercase tracking-[0.2em] text-brand">
            ¿Cómo lo quieres?
          </legend>
          <div className="grid grid-cols-2 gap-2">
            {(
              [
                { id: "domicilio", label: "Domicilio", Icon: Bike },
                { id: "recoger", label: "Recoger", Icon: Store },
              ] as const
            ).map(({ id, label, Icon }) => (
              <ChoiceCard
                key={id}
                name="deliveryMode"
                value={id}
                checked={data.deliveryMode === id}
                onChange={() => update("deliveryMode", id)}
                label={label}
                icon={<Icon className="size-5" aria-hidden="true" />}
              />
            ))}
          </div>

          {isDelivery && (
            <div className="mt-4 space-y-4">
              <div>
                <label htmlFor="address" className="text-sm font-semibold">
                  Dirección de entrega <span className="text-brand" aria-hidden="true">*</span>
                </label>
                <input
                  id="address"
                  name="address"
                  autoComplete="street-address"
                  required
                  maxLength={LIMITS.address}
                  value={data.address}
                  onChange={(e) => update("address", e.target.value)}
                  aria-invalid={!!errors.address}
                  aria-describedby={errorId("address")}
                  className={cn(inputClass(errors.address), "h-12")}
                  placeholder="Calle, número, barrio"
                />
                {renderError("address")}
              </div>
              <div>
                <label htmlFor="reference" className="text-sm font-semibold">
                  Referencia <span className="font-normal text-muted">(opcional)</span>
                </label>
                <input
                  id="reference"
                  name="reference"
                  maxLength={LIMITS.reference}
                  value={data.reference}
                  onChange={(e) => update("reference", e.target.value)}
                  aria-invalid={!!errors.reference}
                  aria-describedby={errorId("reference")}
                  className={cn(inputClass(errors.reference), "h-12")}
                  placeholder="Apto, torre, casa esquinera…"
                />
                {renderError("reference")}
              </div>
              {fee === null && (
                <p className="rounded-xl bg-brand/10 px-4 py-3 text-sm text-paper/85">
                  El valor del domicilio <strong className="text-brand">se confirma por WhatsApp</strong>{" "}
                  y no está incluido en el total.
                </p>
              )}
            </div>
          )}
        </fieldset>

        {/* Pago */}
        <fieldset>
          <legend className="mb-3 text-xs font-semibold uppercase tracking-[0.2em] text-brand">
            Método de pago
          </legend>
          <div className="grid grid-cols-2 gap-2">
            {(
              [
                { id: "efectivo", label: "Efectivo", Icon: Banknote },
                { id: "transferencia", label: "Transferencia", Icon: Landmark },
              ] as const
            ).map(({ id, label, Icon }) => (
              <ChoiceCard
                key={id}
                name="paymentMethod"
                value={id}
                checked={data.paymentMethod === id}
                onChange={() => update("paymentMethod", id)}
                label={label}
                icon={<Icon className="size-5" aria-hidden="true" />}
              />
            ))}
          </div>
          {data.paymentMethod === "transferencia" && (
            <p className="mt-3 text-sm text-muted">
              Los datos para transferir te los comparte el negocio por WhatsApp.
            </p>
          )}
        </fieldset>

        <div>
          <label htmlFor="notes" className="text-sm font-semibold">
            Observaciones generales <span className="font-normal text-muted">(opcional)</span>
          </label>
          <textarea
            id="notes"
            name="notes"
            rows={3}
            maxLength={LIMITS.notes}
            value={data.notes}
            onChange={(e) => update("notes", e.target.value)}
            aria-invalid={!!errors.notes}
            aria-describedby={errorId("notes")}
            className={cn(inputClass(errors.notes), "resize-none py-3")}
            placeholder="Algo más que debamos saber"
          />
          {renderError("notes")}
        </div>
      </div>

      <footer className="border-t border-white/[0.07] bg-ink-2 px-4 pb-[max(1rem,env(safe-area-inset-bottom))] pt-4 sm:px-5">
        <dl className="space-y-1.5 text-sm">
          <div className="flex justify-between">
            <dt className="text-muted">Subtotal</dt>
            <dd className="price font-semibold">{formatCOP(subtotal)}</dd>
          </div>
          {isDelivery && (
            <div className="flex justify-between">
              <dt className="text-muted">Domicilio</dt>
              <dd className="text-muted">{fee === null ? "Por confirmar" : formatCOP(fee)}</dd>
            </div>
          )}
          <div className="flex justify-between border-t border-white/[0.07] pt-2 text-base">
            <dt className="font-semibold">
              {isDelivery && fee === null ? "Total de productos" : "Total"}
            </dt>
            <dd className="price font-bold">{formatCOP(total)}</dd>
          </div>
        </dl>
        <Button type="submit" variant="whatsapp" size="lg" className="mt-4 w-full">
          <WhatsAppIcon className="size-5" />
          Enviar pedido por WhatsApp
        </Button>
        <p className="mt-2 text-center text-xs text-muted">
          Se abrirá WhatsApp con tu pedido listo. Tu pedido se completa cuando envíes el mensaje.
        </p>
      </footer>
    </form>
  );
}

function ChoiceCard({
  name,
  value,
  checked,
  onChange,
  label,
  icon,
}: {
  name: string;
  value: string;
  checked: boolean;
  onChange: () => void;
  label: string;
  icon: React.ReactNode;
}) {
  return (
    <label
      className={cn(
        "flex h-14 cursor-pointer items-center gap-2.5 rounded-xl border px-4 font-semibold transition-colors has-[:focus-visible]:ring-2 has-[:focus-visible]:ring-brand",
        checked
          ? "border-brand bg-brand/10 text-paper"
          : "border-white/10 text-paper/80 hover:border-white/25",
      )}
    >
      <input
        type="radio"
        name={name}
        value={value}
        checked={checked}
        onChange={onChange}
        className="sr-only"
      />
      <span className={checked ? "text-brand" : "text-muted"}>{icon}</span>
      {label}
    </label>
  );
}
