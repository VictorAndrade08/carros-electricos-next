import Link from "next/link";
import { formatFecha } from "@/lib/format";
import type { Article } from "@/lib/articles";

/** Tarjeta de noticia: imagen grande, título destacado y fecha legible. */
export default function NewsCard({ a }: { a: Article }) {
  return (
    <Link
      href={`/${a.slug}/`}
      className="reveal group block transition-transform duration-300 hover:-translate-y-1"
    >
      <div className="relative aspect-[16/10] overflow-hidden rounded-xl bg-neutral-100">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={a.portada || "/logo.png"}
          alt={a.titulo}
          width={1536}
          height={1024}
          loading="lazy"
          decoding="async"
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
        />
        {a.categorias[0] && (
          <span className="absolute left-0 top-3 bg-brand px-3 py-1 text-xs font-black uppercase tracking-wider text-black">
            {a.categorias[0]}
          </span>
        )}
      </div>
      <h3 className="mt-4 text-xl font-extrabold leading-snug tracking-tight text-neutral-900 transition-colors group-hover:text-lime-600">
        {a.titulo}
      </h3>
      <p className="mt-2 text-sm font-bold uppercase tracking-widest text-neutral-500">
        {formatFecha(a.fecha)}
      </p>
    </Link>
  );
}
