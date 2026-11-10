/* ------------------------------------------------------------------
 * CONFIGURACIÓN CENTRAL DEL NEGOCIO
 * Edita este archivo para cambiar datos de contacto, textos de marca,
 * banner promocional, redes sociales e imágenes de marca.
 *
 * Regla: los campos en `null` o vacíos se ocultan automáticamente.
 * No se inventan horarios, direcciones, promociones ni costos de envío.
 * ------------------------------------------------------------------ */

export type SocialNetwork = "instagram" | "facebook" | "tiktok";

export interface SocialLink {
  network: SocialNetwork;
  label: string;
  /** Deja vacío ("") para ocultar la red. */
  url: string;
}

export const business = {
  name: "FULLETIAO FAST FOOD",
  shortName: "Fulletiao",
  slogan: "Sabor que manda en la calle",
  secondarySlogan: "Rápido, rico y sin filtro",
  locale: "es-CO",
  currency: "COP",

  whatsapp: {
    /** Número en formato internacional sin "+" ni espacios. */
    number: "573023705830",
    display: "+57 302 370 5830",
    /** Mensaje del botón "Pedir por WhatsApp" (sin carrito). */
    greeting: "Hola FULLETIAO 👋 Quiero hacer un pedido.",
  },

  /**
   * Logo original. Copia el archivo en /public/assets/branding/ y escribe la
   * ruta aquí (p. ej. "/assets/branding/logo.png"). Mientras sea `null` se
   * muestra un wordmark tipográfico provisional.
   */
  logo: null as { src: string; width: number; height: number } | null,

  /** Fotografía real del negocio para el hero. `null` = composición gráfica. */
  heroImage: null as { src: string; alt: string } | null,

  /** PENDIENTE: dirección física. `null` = no se muestra. */
  address: null as string | null,

  /** PENDIENTE: horarios de atención. Lista vacía = no se muestra. */
  hours: [] as { days: string; time: string }[],

  /**
   * Tarifa de domicilio en COP. `null` = "Domicilio por confirmar" y NO se
   * suma al total. Solo cambiar cuando el negocio defina una tarifa fija.
   */
  deliveryFee: null as number | null,

  /** Redes sociales. Las que tengan url vacía no se muestran. */
  socials: [
    { network: "instagram", label: "Instagram", url: "" },
    { network: "facebook", label: "Facebook", url: "" },
    { network: "tiktok", label: "TikTok", url: "" },
  ] satisfies SocialLink[] as SocialLink[],

  /** Banner promocional editable. Solo contenido verificado (precios del menú). */
  promoBanner: {
    enabled: true,
    eyebrow: "Salvajadas",
    title: "Para compartir con el parche",
    text: "Las Fulletiao vienen en tamaño Personal, X2, Junior y Familiar. Elige la tuya.",
    highlight: "Desde $25.000",
    ctaLabel: "Ver salvajadas",
    /** Categoría que se abre al pulsar el botón. */
    ctaCategory: "salvajadas" as const,
  },

  about: {
    title: "Comida rápida con carácter de calle",
    paragraphs: [
      "En FULLETIAO hacemos comida rápida colombiana como se disfruta en la calle: perros calientes, salchipapas, hamburguesas y nuestras salvajadas, servidas con actitud.",
      "Arma tu pedido en esta carta digital y envíalo listo por WhatsApp. Sin vueltas.",
    ],
    pillars: [
      { title: "Rápido", text: "Pides en minutos desde el celular." },
      { title: "Rico", text: "Sabor callejero en cada bocado." },
      { title: "Sin filtro", text: "Comida de verdad, sin poses." },
    ],
  },
} as const;

export const siteUrl =
  process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "") ?? "http://localhost:3000";

export const activeSocials = business.socials.filter((s) => s.url.trim() !== "");
