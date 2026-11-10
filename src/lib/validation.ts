import type { CheckoutData, CheckoutErrors } from "@/types";

/** Deja solo dígitos y quita el indicativo 57 si viene incluido. */
export function cleanPhone(raw: string): string {
  const digits = raw.replace(/\D/g, "");
  return digits.length === 12 && digits.startsWith("57") ? digits.slice(2) : digits;
}

/** Celular colombiano (10 dígitos, empieza por 3) o fijo nacional (60X + 7 dígitos). */
export function isValidColombianPhone(raw: string): boolean {
  const d = cleanPhone(raw);
  return /^3\d{9}$/.test(d) || /^60\d{8}$/.test(d);
}

export const LIMITS = { name: 60, address: 150, reference: 150, notes: 300 } as const;

export function validateCheckout(data: CheckoutData): CheckoutErrors {
  const errors: CheckoutErrors = {};
  const name = data.name.trim();

  if (name.length < 2) errors.name = "Escribe tu nombre (mínimo 2 letras).";
  else if (name.length > LIMITS.name) errors.name = "El nombre es demasiado largo.";
  else if (!/\p{L}/u.test(name)) errors.name = "El nombre debe contener letras.";

  if (!data.phone.trim()) errors.phone = "Escribe un número de contacto.";
  else if (!isValidColombianPhone(data.phone))
    errors.phone = "Número no válido. Ejemplo: 300 123 4567.";

  if (data.deliveryMode === "domicilio") {
    const address = data.address.trim();
    if (address.length < 6) errors.address = "Escribe la dirección completa de entrega.";
    else if (address.length > LIMITS.address) errors.address = "La dirección es demasiado larga.";
    if (data.reference.length > LIMITS.reference)
      errors.reference = `Máximo ${LIMITS.reference} caracteres.`;
  }

  if (data.notes.length > LIMITS.notes) errors.notes = `Máximo ${LIMITS.notes} caracteres.`;

  return errors;
}
