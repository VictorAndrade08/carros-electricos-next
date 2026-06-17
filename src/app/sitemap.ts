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

  const noticias: MetadataRoute.Sitemap = articulos.map((a) => ({
    url: absoluteUrl(`/${a.slug}/`),
    lastModified: a.fecha ? new Date(a.fecha) : undefined,
    changeFrequency: "weekly",
    priority: 0.7,
  }));

  return [...fijas, ...noticias];
}
