# FULLETIAO FAST FOOD · Menú digital

> **Sabor que manda en la calle** — Rápido, rico y sin filtro.

Menú digital para FULLETIAO FAST FOOD: catálogo con filtros y búsqueda, detalle de producto, carrito persistente y checkout que arma el pedido y lo envía a WhatsApp (**+57 302 370 5830**).

**Stack:** Next.js 16 (App Router) · TypeScript · Tailwind CSS 4 · Zustand 5 (con `localStorage`) · Motion · Lucide React · `next/image` · Vitest.

En esta primera fase no hay autenticación, base de datos ni pasarela de pagos.

---

## Requisitos

- Node.js 20.9 o superior (probado con Node 24)
- npm 10 o superior

## Instalación y comandos

```bash
npm install          # instala las dependencias
npm run dev          # desarrollo en http://localhost:3000
npm run build        # compilación de producción
npm start            # sirve la compilación de producción
npm run lint         # ESLint (reglas de Next + TypeScript)
npm run typecheck    # TypeScript sin emitir archivos
npm test             # pruebas unitarias (Vitest)
```

Variables de entorno (opcional): copia `.env.example` a `.env.local` y define `NEXT_PUBLIC_SITE_URL` con el dominio final. Se usa en SEO, Open Graph y el sitemap.

---

## Dónde editar cada cosa

| Qué | Archivo |
| --- | --- |
| Datos del negocio, WhatsApp, logo, foto del hero, dirección, horarios, tarifa de domicilio, redes, banner promocional, sección Nosotros | [`src/data/business.ts`](src/data/business.ts) |
| **Catálogo**: categorías, productos, precios, fotos, etiquetas, adicionales y variantes | [`src/data/catalog.ts`](src/data/catalog.ts) |
| Enlaces de navegación | [`src/data/navigation.ts`](src/data/navigation.ts) |
| Colores y tipografías | [`src/app/globals.css`](src/app/globals.css) (`@theme`) |
| Formato del mensaje de WhatsApp | [`src/lib/whatsapp.ts`](src/lib/whatsapp.ts) |

### Catálogo (`src/data/catalog.ts`)

- **Precio:** `price: 12000` (número entero, sin puntos).
- **Foto real:** copia el archivo en `public/assets/products/` y añade
  `image: { src: "/assets/products/perro-ranchero.jpg", alt: "Perro ranchero" }`.
  Mientras `image` sea `null`, se muestra un placeholder con el nombre y la categoría. Nunca se muestra la foto de otro plato.
- **Descripción e ingredientes:** `description: "…"`, `ingredients: ["…", "…"]`.
- **Etiquetas:** `tags: ["destacado" | "insignia" | "para-compartir" | "nuevo"]`. Los textos se editan en `productTags`.
- **Destacados del inicio:** `featured: true`.
- **Agotado:** `available: false`.
- **Adicionales:** `optionGroups: [adicionalesBasicos]`. Solo aparecen en el detalle del producto cuando están configurados.
- **Variantes (tamaños):** `variants: [{ id: "doble", name: "Doble", price: 22000 }]`.

### Imágenes de marca

1. Logo original → `public/assets/branding/` y en `business.ts`:
   `logo: { src: "/assets/branding/logo.png", width: 400, height: 160 }` (usa las dimensiones reales del archivo). Se muestra con `object-contain`, sin recortes ni deformación.
2. Foto real del negocio para el hero → `public/assets/banners/` y `heroImage: { src, alt }`.
3. Las piezas promocionales que llevan texto no deben usarse como foto de producto.

### Domicilio

`deliveryFee: null` muestra "Domicilio por confirmar" y **no** lo suma al total. Si el negocio define una tarifa fija, cambia el valor (por ejemplo, `4000`) y se sumará automáticamente.

---

## ⚠ Datos pendientes de verificar

Al crear el proyecto, **el repositorio no contenía las imágenes del negocio** (`public/assets/` estaba vacío), así que:

- [ ] **Nombres y precios** se transcribieron del brief, pero no se han contrastado con la foto del menú físico. Cada producto lleva la nota `pending: ["verificar-precio-con-menu-original", …]`.
- [ ] **Ingredientes y descripciones:** todos en `null`. No se inventaron. El detalle muestra un aviso neutro.
- [ ] **Fotos de producto:** ninguna. Se usan placeholders.
- [ ] **Logo original:** se usa un wordmark tipográfico provisional hasta que se configure el archivo.
- [ ] **Foto del hero:** se usa una composición gráfica con los precios "desde" de cada categoría.
- [ ] **Dirección, horarios y redes sociales:** vacíos, así que no se muestran.
- [ ] **Adicionales por producto:** "Papas francesas" existe como producto, pero no está asignada como adicional a ningún plato, porque el menú no indica a cuáles aplica.
- [ ] **Destacados y etiquetas:** es una selección editorial inicial. Ajústala con el negocio.

---

## Flujo de compra

1. El cliente elige un producto. En el detalle ajusta la cantidad, las observaciones y, si están configurados, adicionales o variantes, con el total calculado al momento.
2. El carrito (drawer lateral) permite cambiar cantidades, editar o eliminar observaciones y vaciarlo. Se guarda en `localStorage` y se restaura al recargar; al restaurar, los precios se recalculan desde el catálogo vigente.
   - Un mismo producto con distinta variante, adicionales u observaciones queda en líneas separadas. Las configuraciones idénticas se agrupan.
3. En el checkout se piden nombre, teléfono, modalidad (domicilio o recoger), dirección y referencia si es domicilio, método de pago (efectivo o transferencia) y observaciones. No se piden datos bancarios.
4. Se abre `https://wa.me/573023705830?text=…` con el pedido codificado. La pantalla final **no afirma que el pedido fue recibido**: indica que se completa cuando el cliente envía el mensaje. El carrito solo se vacía cuando el cliente pulsa "Ya lo envié · Nuevo pedido".

---

## Estructura

```
src/
  app/            layout, página, estilos, OG image, robots, sitemap, favicon
  components/
    layout/       Header, Footer, Logo, Providers, FloatingActions (WhatsApp, barra móvil, toast)
    home/         Hero, FeaturedProducts, PromoBanner, About, Contact
    menu/         MenuSection, ProductCard, ProductModal, ProductImage, CategoryIllustration
    cart/         CartDrawer, CartItemRow
    checkout/     CheckoutForm, OrderSent
    ui/           Button, Dialog accesible, QuantityStepper, SectionHeading, iconos, decoraciones
  data/           business.ts, catalog.ts, navigation.ts
  types/          tipos de catálogo, carrito y checkout
  store/          cart.ts (Zustand + persist), ui.ts
  lib/            cart, whatsapp, validation, search, format
  hooks/          useCart, useHydrated, useScrolled
public/assets/    branding/, products/, banners/
tests/            pruebas de catálogo, carrito/persistencia y checkout/WhatsApp
```

## Accesibilidad y rendimiento

- Diálogos con `role="dialog"`, `aria-modal`, foco atrapado, cierre con Escape y devolución del foco al elemento que los abrió.
- Enlace "Saltar al contenido", foco visible, etiquetas en todos los campos, errores asociados con `aria-describedby` y foco en el primer campo inválido.
- Animaciones con Motion, que respetan `prefers-reduced-motion` (`MotionConfig reducedMotion="user"` y CSS).
- Página prerenderizada estática, fuentes con `next/font`, imágenes con `next/image` (AVIF/WebP) y datos estructurados `schema.org/Restaurant`.

---

## Despliegue en Vercel

1. Sube el repositorio a GitHub, GitLab o Bitbucket.
2. En [vercel.com/new](https://vercel.com/new), importa el repositorio. Vercel detecta Next.js automáticamente: no hace falta cambiar los comandos de build.
3. En **Settings → Environment Variables**, añade `NEXT_PUBLIC_SITE_URL` con el dominio final (por ejemplo, `https://fulletiao.com`).
4. Pulsa **Deploy**. Cada `push` a la rama principal vuelve a desplegar el sitio.

Con la CLI: `npm i -g vercel && vercel` (vista previa) y `vercel --prod` (producción).
