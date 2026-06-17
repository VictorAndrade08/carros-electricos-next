import type { Metadata } from "next";
import { Archivo } from "next/font/google";
import "./globals.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import ImageFallback from "@/components/ImageFallback";
import ClientFx from "@/components/ClientFx";
import { SITE, absoluteUrl } from "@/lib/site";

// Fuente de Google descargada y auto-alojada en build (sin pedidos al CDN de Google).
const archivo = Archivo({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800", "900"],
  display: "swap",
  variable: "--font-archivo",
});

export const metadata: Metadata = {
  metadataBase: new URL(SITE.url),
  title: {
    default: `${SITE.name} · El medio de los autos eléctricos en Ecuador`,
    template: `%s · ${SITE.name}`,
  },
  description: SITE.description,
  applicationName: SITE.name,
  keywords: [
    "carros eléctricos",
    "autos eléctricos",
    "vehículos eléctricos",
    "Ecuador",
    "noticias",
    "reseñas",
    "tecnología",
    "movilidad eléctrica",
  ],
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    siteName: SITE.name,
    locale: SITE.locale,
    url: SITE.url,
    title: `${SITE.name} · El medio de los autos eléctricos en Ecuador`,
    description: SITE.description,
    images: [{ url: "/logo.png", width: 760, height: 200, alt: SITE.name }],
  },
  twitter: {
    card: "summary_large_image",
    title: SITE.name,
    description: SITE.description,
    images: ["/logo.png"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, "max-image-preview": "large" },
  },
};

const orgJsonLd = {
  "@context": "https://schema.org",
  "@type": "NewsMediaOrganization",
  name: SITE.name,
  url: SITE.url,
  logo: absoluteUrl("/logo.png"),
  description: SITE.description,
  sameAs: [SITE.social.instagram, SITE.social.facebook, SITE.social.tiktok],
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="es" className={archivo.variable}>
      <body className="bg-white text-neutral-900 antialiased">
        {/* Marca que hay JS antes de pintar: evita parpadeo en las animaciones. */}
        <script
          dangerouslySetInnerHTML={{
            __html: "document.documentElement.classList.add('js')",
          }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(orgJsonLd) }}
        />
        <ClientFx />
        <Header />
        <main className="min-h-[60vh]">{children}</main>
        <Footer />
        <ImageFallback />
      </body>
    </html>
  );
}
