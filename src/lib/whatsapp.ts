import { business } from "@/data/business";
import type { CartItem, CheckoutData } from "@/types";
import { cartSubtotal, lineTotal } from "./cart";
import { formatCOP } from "./format";
import { cleanPhone } from "./validation";

const DELIVERY_LABEL: Record<CheckoutData["deliveryMode"], string> = {
  domicilio: "Domicilio",
  recoger: "Recoger en el local",
};

const PAYMENT_LABEL: Record<CheckoutData["paymentMethod"], string> = {
  efectivo: "Efectivo",
  transferencia: "Transferencia",
};

/** Construye el texto plano del pedido (sin codificar). */
export function buildOrderMessage(
  items: CartItem[],
  data: CheckoutData,
  deliveryFee: number | null = business.deliveryFee,
): string {
  const subtotal = cartSubtotal(items);
  const isDelivery = data.deliveryMode === "domicilio";
  const hasFee = isDelivery && deliveryFee !== null;
  const feePending = isDelivery && deliveryFee === null;
  const lines: string[] = [];

  lines.push(`🍔 ${business.name}`, "NUEVO PEDIDO", "");
  lines.push(`Cliente: ${data.name.trim()}`);
  lines.push(`Teléfono: ${cleanPhone(data.phone)}`);
  lines.push(`Modalidad: ${DELIVERY_LABEL[data.deliveryMode]}`);
  if (isDelivery) {
    lines.push(`Dirección: ${data.address.trim()}`);
    if (data.reference.trim()) lines.push(`Referencia: ${data.reference.trim()}`);
  }

  lines.push("", "PRODUCTOS:");
  for (const item of items) {
    const name = item.variant ? `${item.name} (${item.variant.name})` : item.name;
    lines.push(`${item.quantity} x ${name} — ${formatCOP(lineTotal(item))}`);
    for (const opt of item.options) {
      lines.push(`   + ${opt.name} (${formatCOP(opt.price)} c/u)`);
    }
    if (item.notes) lines.push(`   Nota: ${item.notes}`);
  }

  lines.push("", `Subtotal: ${formatCOP(subtotal)}`);
  if (isDelivery) {
    lines.push(`Domicilio: ${hasFee ? formatCOP(deliveryFee) : "Por confirmar"}`);
  }
  // Con domicilio sin tarifa, el total solo cubre productos (no se inventa el costo).
  const total = hasFee ? subtotal + deliveryFee : subtotal;
  lines.push(`${feePending ? "Total de productos" : "Total"}: ${formatCOP(total)}`);

  lines.push("", `Método de pago: ${PAYMENT_LABEL[data.paymentMethod]}`);
  if (data.notes.trim()) lines.push(`Observaciones: ${data.notes.trim()}`);

  return lines.join("\n");
}

export function whatsappUrl(text: string, number: string = business.whatsapp.number): string {
  return `https://wa.me/${number}?text=${encodeURIComponent(text)}`;
}

export const greetingUrl = () => whatsappUrl(business.whatsapp.greeting);
