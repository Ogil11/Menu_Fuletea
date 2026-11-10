import type { CategoryFilter, Product } from "@/types";
import { categoryById } from "@/data/catalog";
import { normalizeText } from "./format";

/** Filtra por categoría y por texto (nombre, nombre del menú o categoría). */
export function filterProducts(
  list: Product[],
  category: CategoryFilter,
  query: string,
): Product[] {
  const terms = normalizeText(query).split(/\s+/).filter(Boolean);

  return list.filter((p) => {
    if (category !== "todos" && p.categoryId !== category) return false;
    if (terms.length === 0) return true;
    const haystack = normalizeText(
      [p.name, p.menuName, categoryById[p.categoryId].name, p.description ?? ""].join(" "),
    );
    return terms.every((t) => haystack.includes(t));
  });
}
