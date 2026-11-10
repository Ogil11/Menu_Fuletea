import { describe, expect, it } from "vitest";
import { categories, featuredProducts, products } from "@/data/catalog";
import { formatCOP } from "@/lib/format";
import { filterProducts } from "@/lib/search";

describe("catálogo", () => {
  it("tiene 27 productos con ids únicos y categorías válidas", () => {
    // 6 perros + 6 salchipapas + 4 salvajadas + 4 hamburguesas + 6 bebidas + 1 adicional
    expect(products).toHaveLength(27);
    expect(new Set(products.map((p) => p.id)).size).toBe(products.length);
    const ids = new Set(categories.map((c) => c.id));
    for (const p of products) {
      expect(ids.has(p.categoryId)).toBe(true);
      expect(Number.isInteger(p.price) && p.price > 0).toBe(true);
    }
  });

  it("conserva los precios del menú del brief", () => {
    const price = (id: string) => products.find((p) => p.id === id)?.price;
    expect(price("perro-sencillo")).toBe(6000);
    expect(price("full-perro")).toBe(20000);
    expect(price("salchipollosuiza")).toBe(26000);
    expect(price("fulletiao-familiar")).toBe(55000);
    expect(price("hamburguesa-adhara-full")).toBe(28000);
    expect(price("postobon-mini")).toBe(2000);
    expect(price("papas-francesas")).toBe(3000);
  });

  it("no inventa ingredientes ni fotos", () => {
    for (const p of products) {
      expect(p.description).toBeNull();
      expect(p.ingredients).toBeNull();
      expect(p.image).toBeNull();
    }
  });

  it("tiene productos destacados", () => {
    expect(featuredProducts.length).toBeGreaterThan(0);
  });
});

describe("formatCOP", () => {
  it("formatea pesos colombianos", () => {
    expect(formatCOP(0)).toBe("$0");
    expect(formatCOP(2000)).toBe("$2.000");
    expect(formatCOP(36000)).toBe("$36.000");
    expect(formatCOP(1234567)).toBe("$1.234.567");
  });
});

describe("búsqueda y filtros", () => {
  it("filtra por categoría", () => {
    const r = filterProducts(products, "bebidas", "");
    expect(r).toHaveLength(6);
    expect(r.every((p) => p.categoryId === "bebidas")).toBe(true);
  });

  it("busca sin importar mayúsculas ni tildes", () => {
    expect(filterProducts(products, "todos", "POSTOBON").map((p) => p.id)).toEqual([
      "postobon-1-5l",
      "postobon-mini",
    ]);
    expect(filterProducts(products, "todos", "ranchero").map((p) => p.id)).toEqual([
      "perro-ranchero",
    ]);
  });

  it("combina categoría y texto, y devuelve vacío sin coincidencias", () => {
    expect(filterProducts(products, "hamburguesas", "pollo").map((p) => p.id)).toEqual([
      "hamburguesa-pollo",
    ]);
    expect(filterProducts(products, "bebidas", "pollo")).toEqual([]);
    expect(filterProducts(products, "todos", "pizza")).toEqual([]);
  });
});
