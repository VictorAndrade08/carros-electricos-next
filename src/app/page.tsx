import Link from "next/link";
import { getArticles } from "@/lib/articles";
import NewsCard from "@/components/NewsCard";

export const runtime = "edge";

/** Mezcla un arreglo (Fisher-Yates) para que el home se vea variado y no agrupe
 *  temas parecidos. Se baraja en cada render (el CDN lo cachea ~30s). */
function mezclar<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

export default async function Home() {
  const all = await getArticles(60);
  const hero = all[0]; // la más reciente queda de portada
  const resto = mezclar(all.slice(1)); // el resto, mezclado
  const featured = resto.slice(0, 4);
  const grid = resto.slice(4);

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
                  <span className="anim-rise inline-block bg-brand px-3 py-1 text-sm font-black uppercase tracking-widest text-black">
                    {hero.categorias[0] || "Noticias"}
                  </span>
                  <h1 className="anim-rise-2 mt-4 max-w-4xl text-4xl font-black uppercase leading-[0.95] text-white md:text-6xl">
                    {hero.titulo}
                  </h1>
                  {hero.extracto && (
                    <p className="anim-rise-3 mt-4 max-w-2xl text-base text-neutral-200 md:text-lg">
                      {hero.extracto}
                    </p>
                  )}
                  <span className="anim-rise-4 mt-6 inline-flex items-center gap-2 text-base font-bold uppercase tracking-wider text-brand">
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
          <h2 className="reveal mb-8 text-4xl font-black uppercase tracking-tight text-ink">
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
