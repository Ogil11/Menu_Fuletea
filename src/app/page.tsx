import { business, siteUrl } from "@/data/business";
import { categories, products } from "@/data/catalog";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Hero } from "@/components/home/Hero";
import { FeaturedProducts } from "@/components/home/FeaturedProducts";
import { PromoBanner } from "@/components/home/PromoBanner";
import { About } from "@/components/home/About";
import { Contact } from "@/components/home/Contact";
import { MenuSection } from "@/components/menu/MenuSection";
import { SloganTape } from "@/components/ui/Decorations";

/** Datos estructurados (schema.org) del restaurante y su menú. */
function jsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "Restaurant",
    name: business.name,
    slogan: business.slogan,
    servesCuisine: ["Comida rápida", "Colombiana"],
    telephone: `+${business.whatsapp.number}`,
    url: siteUrl,
    currenciesAccepted: "COP",
    ...(business.address ? { address: business.address } : {}),
    hasMenu: {
      "@type": "Menu",
      hasMenuSection: categories.map((c) => ({
        "@type": "MenuSection",
        name: c.name,
        hasMenuItem: products
          .filter((p) => p.categoryId === c.id)
          .map((p) => ({
            "@type": "MenuItem",
            name: p.name,
            offers: { "@type": "Offer", price: p.price, priceCurrency: "COP" },
          })),
      })),
    },
  };
}

export default function HomePage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd()).replace(/</g, "\\u003c") }}
      />
      <Header />
      <main id="contenido">
        <Hero />
        <SloganTape words={["Sabor que manda en la calle", "Rápido", "Rico", "Sin filtro"]} />
        <FeaturedProducts />
        <PromoBanner />
        <MenuSection />
        <About />
        <Contact />
      </main>
      <Footer />
    </>
  );
}
