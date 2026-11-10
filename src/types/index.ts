/* ------------------------------------------------------------------
 * Tipos del dominio: catálogo, carrito y checkout.
 * ------------------------------------------------------------------ */

export type CategoryId =
  | "perros-calientes"
  | "salchipapas"
  | "salvajadas"
  | "hamburguesas"
  | "bebidas"
  | "adicionales";

/** "todos" es un filtro de la UI, no una categoría real. */
export type CategoryFilter = CategoryId | "todos";

export interface Category {
  id: CategoryId;
  name: string;
  /** Nombre en singular usado en placeholders y tarjetas. */
  singular: string;
  /** Texto corto para la pestaña / encabezado (opcional). */
  tagline?: string;
}

/** Etiquetas configurables que se muestran sobre la tarjeta. */
export type ProductTagId = "destacado" | "insignia" | "para-compartir" | "nuevo";

export interface ProductTag {
  id: ProductTagId;
  label: string;
}

export interface ProductImage {
  /** Ruta dentro de /public, p. ej. "/assets/products/perro-ranchero.jpg" */
  src: string;
  alt: string;
}

/** Variante excluyente del producto (p. ej. tamaño). Reemplaza el precio base. */
export interface ProductVariant {
  id: string;
  name: string;
  price: number;
}

/** Opción dentro de un grupo de adicionales. Su precio se SUMA al producto. */
export interface ProductOption {
  id: string;
  name: string;
  price: number;
}

/** Grupo de adicionales configurables por producto. */
export interface ProductOptionGroup {
  id: string;
  name: string;
  /** Máximo de opciones seleccionables en el grupo (por defecto ilimitado). */
  maxSelect?: number;
  options: ProductOption[];
}

export interface Product {
  id: string;
  categoryId: CategoryId;
  /** Nombre completo, legible en carrito y WhatsApp. */
  name: string;
  /** Nombre tal como aparece en el menú físico. */
  menuName: string;
  /** Descripción verificada. `null` = pendiente de confirmar con el negocio. */
  description: string | null;
  /** Ingredientes verificados. `null` = pendiente. */
  ingredients: string[] | null;
  /** Precio base en COP (entero, sin decimales). */
  price: number;
  /** Foto REAL del producto. `null` = se muestra un placeholder elegante. */
  image: ProductImage | null;
  tags?: ProductTagId[];
  /** Aparece en la sección "Destacados" del inicio. */
  featured?: boolean;
  /** `false` oculta el botón de agregar y muestra "Agotado". */
  available: boolean;
  variants?: ProductVariant[];
  optionGroups?: ProductOptionGroup[];
  /** Notas internas de verificación. No se muestran al cliente. */
  pending?: string[];
}

/* ----------------------------- Carrito ----------------------------- */

export interface SelectedOption {
  groupId: string;
  optionId: string;
  name: string;
  price: number;
}

export interface CartItem {
  /** Identificador único de la línea: producto + configuración + notas. */
  lineId: string;
  productId: string;
  name: string;
  categoryId: CategoryId;
  image: ProductImage | null;
  /** Precio base o de la variante elegida. */
  basePrice: number;
  variant: { id: string; name: string } | null;
  options: SelectedOption[];
  notes: string;
  quantity: number;
}

export interface CartItemInput {
  product: Product;
  quantity: number;
  variantId?: string | null;
  optionIds?: string[];
  notes?: string;
}

/* ----------------------------- Checkout ---------------------------- */

export type DeliveryMode = "domicilio" | "recoger";
export type PaymentMethod = "efectivo" | "transferencia";

export interface CheckoutData {
  name: string;
  phone: string;
  deliveryMode: DeliveryMode;
  address: string;
  reference: string;
  paymentMethod: PaymentMethod;
  notes: string;
}

export type CheckoutErrors = Partial<Record<keyof CheckoutData, string>>;
