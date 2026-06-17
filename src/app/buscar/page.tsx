import type { Metadata } from "next";
import Link from "next/link";
import { searchArticles } from "@/lib/articles";
import SearchBox from "@/components/SearchBox";

export const runtime = "edge";

export const metadata: Metadata = {
  title: "Buscar",
  description: "Busca noticias, reseñas y tecnología de autos eléctricos.",
  robots: { index: false, follow: true },
};

type Search = { s?: string };

export default async function BuscarPage({
  searchParams,
}: {
  searchParams: Promise<Search>;
}) {
  const { s } = await searchParams;
  const q = (s || "").trim();
  const resultados = q ? await searchArticles(q) : [];

  return (
    <div className="mx-auto max-w-5xl px-5 py-12 md:px-8">
      <h1 className="text-4xl font-black uppercase tracking-tight text-ink md:text-5xl">
        Buscar<span className="text-brand">.</span>
      </h1>

      <div className="mt-8">
        <SearchBox initial={q} />
      </div>

      {q && (
        <p className="mt-6 text-base font-bold uppercase tracking-widest text-neutral-500">
          {resultados.length} resultado{resultados.length === 1 ? "" : "s"} para “{q}”
        </p>
      )}

      {q && resultados.length === 0 && (
        <p className="mt-10 text-lg text-neutral-600">
          No encontramos noticias para “{q}”. Prueba con otra palabra.
        </p>
      )}

      <div className="mt-8 divide-y divide-neutral-200">
        {resultados.map((r) => (
          <Link
            key={r.slug}
            href={`/${r.slug}/`}
            className="group flex gap-5 py-6"
          >
            <div className="relative aspect-[16/10] w-40 shrink-0 overflow-hidden rounded-lg bg-neutral-100 sm:w-56">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={r.portada || "/logo.png"}
                alt={r.titulo}
                loading="lazy"
                decoding="async"
                sizes="(max-width: 640px) 40vw, 224px"
                className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
              />
            </div>
            <div className="min-w-0">
              <h2 className="text-lg font-extrabold leading-snug text-neutral-900 transition-colors group-hover:text-lime-600 md:text-xl">
                {r.titulo}
              </h2>
              {r.extracto && (
                <p className="mt-2 line-clamp-2 text-base text-neutral-600">
                  {r.extracto}
                </p>
              )}
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
