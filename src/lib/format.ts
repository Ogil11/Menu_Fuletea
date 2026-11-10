/**
 * Formatea un entero en pesos colombianos: 24000 -> "$24.000".
 * Implementación determinista (igual en servidor y navegador) para evitar
 * diferencias de hidratación entre versiones de ICU.
 */
export function formatCOP(value: number): string {
  const rounded = Math.round(Math.abs(value));
  const grouped = rounded.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
  return `${value < 0 ? "-" : ""}$${grouped}`;
}

/** Normaliza texto para búsqueda: minúsculas y sin tildes. */
export function normalizeText(value: string): string {
  return value
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .trim();
}
