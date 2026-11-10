/* ==================================================================
 * CATÁLOGO DE FULLETIAO FAST FOOD  —  archivo editable
 * ==================================================================
 *
 * Fuente: menú físico aportado por el negocio (transcrito en el brief).
 *
 * ⚠ ESTADO DE VERIFICACIÓN
 * - Las imágenes originales del menú NO estaban en el repositorio al crear
 *   este archivo, por lo que nombres y precios NO se han podido contrastar
 *   visualmente. Todos los productos llevan la nota "verificar-precio".
 * - No se inventaron ingredientes: `description` e `ingredients` están en
 *   `null` (pendiente) hasta que el negocio los confirme.
 * - Ningún producto tiene foto real aún: `image: null` muestra un
 *   placeholder con el nombre y la categoría.
 *
 * CÓMO EDITAR
 * - Precio: cambia `price` (entero en COP, sin puntos: 12000).
 * - Foto: copia el archivo a /public/assets/products/ y usa
 *     image: { src: "/assets/products/perro-ranchero.jpg", alt: "Perro ranchero" }
 * - Ingredientes: description: "Salchicha, ...", ingredients: ["...", "..."]
 * - Etiquetas: tags: ["destacado"] (ver `productTags` abajo).
 * - Agotado: available: false
 * - Adicionales por producto: optionGroups: [adicionalesBasicos]
 *   (solo se muestran en el detalle cuando están configurados).
 * - Variantes (tamaños): variants: [{ id: "personal", name: "Personal", price: 25000 }]
 * ================================================================== */

import type {
  Category,
  Product,
  ProductOptionGroup,
  ProductTag,
  ProductTagId,
} from "@/types";

export const categories: Category[] = [
  { id: "perros-calientes", name: "Perros calientes", singular: "Perro caliente" },
  { id: "salchipapas", name: "Salchipapas", singular: "Salchipapa" },
  { id: "salvajadas", name: "Salvajadas", singular: "Salvajada", tagline: "Para compartir" },
  { id: "hamburguesas", name: "Hamburguesas", singular: "Hamburguesa" },
  { id: "bebidas", name: "Bebidas", singular: "Bebida" },
  { id: "adicionales", name: "Adicionales", singular: "Adicional" },
];

export const productTags: Record<ProductTagId, ProductTag> = {
  destacado: { id: "destacado", label: "Destacado" },
  insignia: { id: "insignia", label: "De la casa" },
  "para-compartir": { id: "para-compartir", label: "Para compartir" },
  nuevo: { id: "nuevo", label: "Nuevo" },
};

/**
 * Grupo de adicionales reutilizable. NO está asignado a ningún producto
 * porque el menú no indica a qué platos aplica. Para activarlo, añade
 * `optionGroups: [adicionalesBasicos]` al producto correspondiente.
 */
export const adicionalesBasicos: ProductOptionGroup = {
  id: "adicionales",
  name: "Adicionales",
  options: [{ id: "papas-francesas", name: "Papas francesas", price: 3000 }],
};

const VERIFY = ["verificar-precio-con-menu-original", "ingredientes-pendientes", "foto-pendiente"];

/** Helper para mantener el archivo legible. */
function item(
  p: Omit<Product, "description" | "ingredients" | "image" | "available" | "pending"> &
    Partial<Pick<Product, "description" | "ingredients" | "image" | "available" | "pending">>,
): Product {
  return {
    description: null,
    ingredients: null,
    image: null,
    available: true,
    pending: VERIFY,
    ...p,
  };
}

export const products: Product[] = [
  /* ---------------------- PERROS CALIENTES ---------------------- */
  item({ id: "perro-sencillo", categoryId: "perros-calientes", menuName: "Sencillo", name: "Perro sencillo", price: 6000 }),
  item({ id: "perro-ranchero", categoryId: "perros-calientes", menuName: "Ranchero", name: "Perro ranchero", price: 12000 }),
  item({ id: "perro-italiano", categoryId: "perros-calientes", menuName: "Italiano", name: "Perro italiano", price: 12000 }),
  item({ id: "perro-suizo", categoryId: "perros-calientes", menuName: "Suizo", name: "Perro suizo", price: 15000 }),
  item({ id: "perro-medio-suizo", categoryId: "perros-calientes", menuName: "Medio suizo", name: "Perro medio suizo", price: 8000 }),
  item({ id: "full-perro", categoryId: "perros-calientes", menuName: "Full perro", name: "Full perro", price: 20000, tags: ["destacado"], featured: true }),

  /* ------------------------- SALCHIPAPAS ------------------------ */
  item({ id: "salchipapa-sencilla", categoryId: "salchipapas", menuName: "Sencilla", name: "Salchipapa sencilla", price: 12000 }),
  item({ id: "salchipapa-chorributy", categoryId: "salchipapas", menuName: "Chorributy", name: "Salchipapa Chorributy", price: 15000 }),
  item({ id: "salchipapa-ranchera", categoryId: "salchipapas", menuName: "Ranchera", name: "Salchipapa ranchera", price: 16000 }),
  item({ id: "salchipollo", categoryId: "salchipapas", menuName: "Salchipollo", name: "Salchipollo", price: 22000 }),
  item({ id: "salchipollosuiza", categoryId: "salchipapas", menuName: "Salchipollosuiza", name: "Salchipollosuiza", price: 26000, featured: true, tags: ["destacado"] }),
  item({ id: "salchisuiza", categoryId: "salchipapas", menuName: "Salchisuiza", name: "Salchisuiza", price: 18000 }),

  /* ------------------------- SALVAJADAS ------------------------- */
  item({ id: "fulletiao-personal", categoryId: "salvajadas", menuName: "Fulletiao Personal", name: "Fulletiao Personal", price: 25000, tags: ["insignia"], featured: true }),
  item({ id: "fulletiao-x2", categoryId: "salvajadas", menuName: "Fulletiao X2", name: "Fulletiao X2", price: 35000, tags: ["insignia", "para-compartir"], featured: true }),
  item({ id: "fulletiao-junior", categoryId: "salvajadas", menuName: "Fulletiao Junior", name: "Fulletiao Junior", price: 45000, tags: ["insignia"] }),
  item({ id: "fulletiao-familiar", categoryId: "salvajadas", menuName: "Fulletiao Familiar", name: "Fulletiao Familiar", price: 55000, tags: ["insignia", "para-compartir"], featured: true }),

  /* ------------------------ HAMBURGUESAS ------------------------ */
  item({ id: "hamburguesa-pollo", categoryId: "hamburguesas", menuName: "Pollo", name: "Hamburguesa de pollo", price: 14000 }),
  item({ id: "hamburguesa-carne", categoryId: "hamburguesas", menuName: "Carne", name: "Hamburguesa de carne", price: 16000 }),
  item({ id: "hamburguesa-mixta", categoryId: "hamburguesas", menuName: "Mixta", name: "Hamburguesa mixta", price: 22000 }),
  item({ id: "hamburguesa-adhara-full", categoryId: "hamburguesas", menuName: "Adhara Full", name: "Hamburguesa Adhara Full", price: 28000, tags: ["destacado"], featured: true }),

  /* -------------------------- BEBIDAS --------------------------- */
  item({ id: "coca-cola-1-5l", categoryId: "bebidas", menuName: "Coca-Cola 1.5 litros", name: "Coca-Cola 1.5 L", price: 8000 }),
  item({ id: "coca-cola-400ml", categoryId: "bebidas", menuName: "Coca-Cola 400 ml", name: "Coca-Cola 400 ml", price: 4000 }),
  item({ id: "postobon-1-5l", categoryId: "bebidas", menuName: "Postobón 1.5 litros", name: "Postobón 1.5 L", price: 7000 }),
  item({ id: "postobon-mini", categoryId: "bebidas", menuName: "Postobón mini", name: "Postobón mini", price: 2000 }),
  item({ id: "hit-litro", categoryId: "bebidas", menuName: "Hit litro", name: "Hit litro", price: 8000 }),
  item({ id: "hit-personal", categoryId: "bebidas", menuName: "Hit personal", name: "Hit personal", price: 4000 }),

  /* ------------------------ ADICIONALES ------------------------- */
  item({ id: "papas-francesas", categoryId: "adicionales", menuName: "Papas francesas", name: "Papas francesas", price: 3000 }),
];

/* --------------------------- Utilidades --------------------------- */

export const categoryById = Object.fromEntries(categories.map((c) => [c.id, c])) as Record<
  Category["id"],
  Category
>;

export function getProductById(id: string): Product | undefined {
  return products.find((p) => p.id === id);
}

export const featuredProducts = products.filter((p) => p.featured);

export const lowestPriceByCategory = (categoryId: Category["id"]) =>
  Math.min(...products.filter((p) => p.categoryId === categoryId).map((p) => p.price));
