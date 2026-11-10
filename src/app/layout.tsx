import type { Metadata, Viewport } from "next";
import { Anton, Inter, Permanent_Marker } from "next/font/google";
import { business, siteUrl } from "@/data/business";
import { Providers } from "@/components/layout/Providers";
import "./globals.css";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter", display: "swap" });
const anton = Anton({ subsets: ["latin"], weight: "400", variable: "--font-anton", display: "swap" });
const marker = Permanent_Marker({
  subsets: ["latin"],
  weight: "400",
  variable: "--font-pm",
  display: "swap",
});

const title = `${business.name} · ${business.slogan}`;
const description = `Menú digital de ${business.name}: perros calientes, salchipapas, salvajadas, hamburguesas y bebidas. Arma tu pedido y envíalo por WhatsApp. ${business.secondarySlogan}.`;

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: { default: title, template: `%s · ${business.shortName}` },
  description,
  applicationName: business.name,
  keywords: [
    "comidas rápidas",
    "perros calientes",
    "salchipapas",
    "hamburguesas",
    "salvajadas",
    "domicilios",
    "Colombia",
    "Fulletiao",
  ],
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    locale: "es_CO",
    url: "/",
    siteName: business.name,
    title,
    description,
  },
  twitter: { card: "summary_large_image", title, description },
  robots: { index: true, follow: true },
};

export const viewport: Viewport = {
  themeColor: "#101010",
  colorScheme: "dark",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es-CO" className={`${inter.variable} ${anton.variable} ${marker.variable}`}>
      <body className="min-h-dvh overflow-x-hidden">
        <a
          href="#contenido"
          className="sr-only z-[100] rounded-full bg-brand px-4 py-2 font-semibold text-ink focus:not-sr-only focus:fixed focus:left-4 focus:top-4"
        >
          Saltar al contenido
        </a>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
