import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getArticle, getArticles } from "@/lib/articles";
import { formatFecha } from "@/lib/format";
import { slugify } from "@/lib/text";
import { SITE, absoluteUrl } from "@/lib/site";
import NewsCard from "@/components/NewsCard";
import ShareButtons from "@/components/ShareButtons";

export const runtime = "edge";

type Params = { slug: string };

/** Texto plano (sin HTML) para descripciones SEO, recortado a ~160 caracteres. */
function resumen(a: { extracto: string | null; html: string | null }): string {
  const base = a.extracto || (a.html || "").replace(/<[^>]+>/g, " ");
  const limpio = base.replace(/\s+/g, " ").trim();
  return limpio.length > 160 ? `${limpio.slice(0, 157)}…` : limpio;
}

export async function generateMetadata({
  params,
}: {
  params: Promise<Params>;
}): Promise<Metadata> {
  const { slug } = await params;
  const a = await getArticle(slug);
  if (!a) return { title: "Noticia no encontrada" };

  const desc = resumen(a) || SITE.description;
  const url = absoluteUrl(`/${slug}/`);
  const img = a.portada ? [a.portada] : ["/logo.png"];

  return {
    title: a.titulo,
    description: desc,
    alternates: { canonical: `/${slug}/` },
    openGraph: {
      type: "article",
      url,
      title: a.titulo,
      description: desc,
      siteName: SITE.name,
      locale: SITE.locale,
      publishedTime: a.fecha || undefined,
      section: a.categorias[0],
      tags: a.tags,
      images: img,
    },
    twitter: {
      card: "summary_large_image",
      title: a.titulo,
      description: desc,
      images: img,
    },
  };
}

export default async function ArticlePage({
  params,
}: {
  params: Promise<Params>;
}) {
  const { slug } = await params;
  const a = await getArticle(slug);
  if (!a) notFound();

  const related = (await getArticles(8))
    .filter((r) => r.slug !== slug)
    .slice(0, 3);

  // Datos estructurados (Google los usa para resultados enriquecidos).
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "NewsArticle",
    headline: a.titulo,
    description: resumen(a),
    image: a.portada ? [a.portada] : [absoluteUrl("/logo.png")],
    datePublished: a.fecha || undefined,
    dateModified: a.fecha || undefined,
    articleSection: a.categorias[0],
    keywords: a.tags.join(", "),
    mainEntityOfPage: { "@type": "WebPage", "@id": absoluteUrl(`/${slug}/`) },
    author: { "@type": "Organization", name: SITE.name, url: SITE.url },
    publisher: {
      "@type": "Organization",
      name: SITE.name,
      logo: { "@type": "ImageObject", url: absoluteUrl("/logo.png") },
    },
  };

  return (
    <article>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      {/* Cabecera del artículo */}
      <header className="mx-auto max-w-3xl px-5 pt-10">
        <nav className="text-sm font-bold uppercase tracking-widest text-neutral-500">
          <Link href="/" className="hover:text-lime-600">
            Inicio
          </Link>
          {a.categorias[0] && (
            <>
              <span className="mx-2">/</span>
              <Link
                href={`/categoria/${slugify(a.categorias[0])}/`}
                className="hover:text-lime-600"
              >
                {a.categorias[0]}
              </Link>
            </>
          )}
        </nav>

        <h1 className="mt-4 text-4xl font-black uppercase leading-[1.02] text-ink md:text-5xl">
          {a.titulo}
        </h1>
        <p className="mt-5 text-sm font-bold uppercase tracking-widest text-neutral-500">
          Carros Eléctricos · {formatFecha(a.fecha)}
        </p>
      </header>

      {a.portada && (
        <div className="mx-auto mt-7 max-w-4xl px-5">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={a.portada}
            alt={a.titulo}
            fetchPriority="high"
            decoding="async"
            sizes="(max-width: 896px) 100vw, 896px"
            className="aspect-[16/9] w-full rounded-2xl object-cover"
          />
        </div>
      )}

      <div
        className="article-body mx-auto mt-8 max-w-3xl px-5"
        dangerouslySetInnerHTML={{ __html: a.html ?? "" }}
      />

      <ShareButtons url={absoluteUrl(`/${slug}/`)} title={a.titulo} />

      {a.tags.length > 0 && (
        <div className="mx-auto mt-9 flex max-w-3xl flex-wrap gap-2 px-5">
          {a.tags.map((t) => (
            <Link
              key={t}
              href={`/buscar/?s=${encodeURIComponent(t)}`}
              className="rounded-full bg-neutral-100 px-3 py-1.5 text-sm font-bold uppercase tracking-wide text-neutral-600 transition hover:bg-brand hover:text-black"
            >
              #{t}
            </Link>
          ))}
        </div>
      )}

      {related.length > 0 && (
        <section className="mx-auto mt-16 max-w-7xl border-t border-neutral-200 px-5 py-12 md:px-12">
          <h2 className="mb-8 text-3xl font-black uppercase tracking-tight text-ink">
            Más noticias<span className="text-brand">.</span>
          </h2>
          <div className="grid gap-x-6 gap-y-10 sm:grid-cols-3">
            {related.map((r) => (
              <NewsCard key={r.slug} a={r} />
            ))}
          </div>
        </section>
      )}
    </article>
  );
}
