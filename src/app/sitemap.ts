import type { MetadataRoute } from "next";
import { getArticles } from "@/lib/articles";
import { absoluteUrl } from "@/lib/site";

export const runtime = "edge";

const CATEGORIAS = ["noticias", "resenas", "tecnologia"];

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const articulos = await getArticles(1000).catch(() => []);

  const fijas: MetadataRoute.Sitemap = [
    { url: absoluteUrl("/"), changeFrequency: "hourly", priority: 1 },
    ...CATEGORIAS.map((c) => ({
      url: absoluteUrl(`/categoria/${c}/`),
      changeFrequency: "daily" as const,
      priority: 0.8,
    })),
  ];

  const noticias: MetadataRoute.Sitemap = articulos.map((a) => {
    const img = a.portada
      ? a.portada.startsWith("http")
        ? a.portada
        : absoluteUrl(a.portada)
      : null;
    return {
      url: absoluteUrl(`/${a.slug}/`),
      lastModified: a.fecha ? new Date(a.fecha) : undefined,
      changeFrequency: "weekly" as const,
      priority: 0.7,
      ...(img ? { images: [img] } : {}),
    };
  });

  return [...fijas, ...noticias];
}
