/**
 * Configuración central del sitio. Usada por metadatos, SEO, sitemap y robots.
 * Cambia NEXT_PUBLIC_SITE_URL en .env.local para tu dominio real en producción.
 */
export const SITE = {
  name: "Carros Eléctricos",
  shortName: "Carros Eléctricos",
  description:
    "Noticias, reseñas y tecnología de los autos eléctricos en Ecuador y el mundo.",
  url: (process.env.NEXT_PUBLIC_SITE_URL || "https://carroselectrico.com").replace(
    /\/$/,
    "",
  ),
  locale: "es_EC",
  social: {
    instagram: "https://instagram.com/carroselectricosec",
    facebook: "https://facebook.com/carroselectricosec",
    tiktok: "https://tiktok.com/@carroselectricosec",
  },
} as const;

/** Convierte una ruta relativa en URL absoluta (para canonical/OG/sitemap). */
export function absoluteUrl(path = "/"): string {
  return `${SITE.url}${path.startsWith("/") ? path : `/${path}`}`;
}
