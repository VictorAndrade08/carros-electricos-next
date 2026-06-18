import type { Metadata } from "next";
import { getArticlesByCategory, getArticles } from "@/lib/articles";
import { SITE, absoluteUrl } from "@/lib/site";
import NewsCard from "@/components/NewsCard";

export const runtime = "edge";

type Params = { slug: string };

const TITULOS: Record<string, string> = {
  noticias: "Noticias",
  resenas: "Reseñas",
  tecnologia: "Tecnología",
  destacado: "Destacado",
  motores: "Motores",
};

function titulo(slug: string): string {
  return TITULOS[slug] || slug.replace(/-/g, " ");
}

export async function generateMetadata({
  params,
}: {
  params: Promise<Params>;
}): Promise<Metadata> {
  const { slug } = await params;
  const t = titulo(slug);
  const desc = `Lo último en ${t.toLowerCase()} sobre autos eléctricos en Ecuador y el mundo.`;
  return {
    title: t,
    description: desc,
    alternates: { canonical: `/categoria/${slug}/` },
    openGraph: { title: t, description: desc, type: "website" },
  };
}

export default async function CategoryPage({
  params,
}: {
  params: Promise<Params>;
}) {
  const { slug } = await params;
  let articles = await getArticlesByCategory(slug);
  // Si la categoría aún no tiene noticias, mostramos las más recientes.
  if (articles.length === 0) articles = await getArticles(30);

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Inicio", item: SITE.url },
      {
        "@type": "ListItem",
        position: 2,
        name: titulo(slug),
        item: absoluteUrl(`/categoria/${slug}/`),
      },
    ],
  };

  return (
    <div className="mx-auto max-w-7xl px-5 py-12 md:px-12">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <h1 className="mb-10 inline-block border-b-4 border-brand pb-3 text-4xl font-black uppercase tracking-tight text-ink md:text-5xl">
        {titulo(slug)}
      </h1>
      <div className="grid gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-3">
        {articles.map((a) => (
          <NewsCard key={a.slug} a={a} />
        ))}
      </div>
    </div>
  );
}
