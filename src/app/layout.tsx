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
  authors: [{ name: SITE.name, url: SITE.url }],
  creator: SITE.name,
  publisher: SITE.name,
  category: "Automóviles",
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
  alternates: {
    canonical: "/",
    types: { "application/rss+xml": "/feed.xml" },
  },
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
    "max-snippet": -1,
    "max-image-preview": "large",
    "max-video-preview": -1,
    googleBot: {
      index: true,
      follow: true,
      "max-snippet": -1,
      "max-image-preview": "large",
      "max-video-preview": -1,
    },
  },
};

const siteJsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "NewsMediaOrganization",
      "@id": `${SITE.url}/#organization`,
      name: SITE.name,
      url: SITE.url,
      logo: { "@type": "ImageObject", url: absoluteUrl("/logo.png") },
      description: SITE.description,
      sameAs: [SITE.social.instagram, SITE.social.facebook, SITE.social.tiktok],
    },
    {
      "@type": "WebSite",
      "@id": `${SITE.url}/#website`,
      url: SITE.url,
      name: SITE.name,
      description: SITE.description,
      inLanguage: "es-EC",
      publisher: { "@id": `${SITE.url}/#organization` },
      potentialAction: {
        "@type": "SearchAction",
        target: {
          "@type": "EntryPoint",
          urlTemplate: `${SITE.url}/buscar/?s={search_term_string}`,
        },
        "query-input": "required name=search_term_string",
      },
    },
  ],
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="es" className={archivo.variable}>
      {/* Conexión anticipada al host de imágenes (R2): adelanta DNS+TLS para que
          la imagen LCP del hero cargue antes. React 19 lo eleva al <head>. */}
      <link rel="preconnect" href="https://pub-25cde2184a5249da96fa022aae951321.r2.dev" crossOrigin="" />
      <link rel="dns-prefetch" href="https://pub-25cde2184a5249da96fa022aae951321.r2.dev" />
      <body className="bg-white text-neutral-900 antialiased">
        {/* Marca que hay JS antes de pintar: evita parpadeo en las animaciones. */}
        <script
          dangerouslySetInnerHTML={{
            __html: "document.documentElement.classList.add('js')",
          }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(siteJsonLd) }}
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
