import Link from "next/link";
import { getArticles } from "@/lib/articles";
import NewsCard from "@/components/NewsCard";

export const runtime = "edge";

export default async function Home() {
  const all = await getArticles(60);
  const hero = all[0];
  const featured = all.slice(1, 5);
  const grid = all.slice(5);

  return (
    <div>
      {/* HERO grande estilo Lynk & Co */}
      {hero && (
        <section className="relative bg-black">
          <Link href={`/${hero.slug}/`} className="group block">
            <div className="relative h-[68vh] min-h-[460px] w-full overflow-hidden">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={hero.portada || "/logo.png"}
                alt={hero.titulo}
                fetchPriority="high"
                decoding="async"
                sizes="100vw"
                className="h-full w-full object-cover opacity-90 transition duration-700 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black via-black/45 to-transparent" />
              <div className="absolute inset-x-0 bottom-0">
                <div className="mx-auto max-w-7xl px-5 pb-12 md:px-12">
                  <span className="inline-block bg-brand px-3 py-1 text-sm font-black uppercase tracking-widest text-black">
                    {hero.categorias[0] || "Noticias"}
                  </span>
                  <h1 className="mt-4 max-w-4xl text-4xl font-black uppercase leading-[0.95] text-white md:text-6xl">
                    {hero.titulo}
                  </h1>
                  {hero.extracto && (
                    <p className="mt-4 max-w-2xl text-base text-neutral-200 md:text-lg">
                      {hero.extracto}
                    </p>
                  )}
                  <span className="mt-6 inline-flex items-center gap-2 text-base font-bold uppercase tracking-wider text-brand">
                    Leer más
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M5 12h14M13 6l6 6-6 6" />
                    </svg>
                  </span>
                </div>
              </div>
            </div>
          </Link>
        </section>
      )}

      <div className="mx-auto max-w-7xl px-5 md:px-12">
        {/* Últimas */}
        {featured.length > 0 && (
          <section className="grid gap-x-6 gap-y-8 py-12 sm:grid-cols-2 lg:grid-cols-4">
            {featured.map((a) => (
              <NewsCard key={a.slug} a={a} />
            ))}
          </section>
        )}

        {/* Todas las noticias */}
        <section className="border-t border-neutral-200 py-12">
          <h2 className="mb-8 text-4xl font-black uppercase tracking-tight text-ink">
            Todas las Noticias<span className="text-brand">.</span>
          </h2>
          <div className="grid gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-3">
            {grid.map((a) => (
              <NewsCard key={a.slug} a={a} />
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
