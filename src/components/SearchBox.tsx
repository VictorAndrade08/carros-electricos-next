"use client";

import { useEffect, useId, useRef, useState } from "react";
import { useRouter } from "next/navigation";

type Suggestion = { slug: string; titulo: string; portada: string | null };

/** Buscador con sugerencias en vivo (autocompletado) de los blogs/noticias. */
export default function SearchBox({ initial = "" }: { initial?: string }) {
  const router = useRouter();
  const [q, setQ] = useState(initial);
  const [items, setItems] = useState<Suggestion[]>([]);
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState(-1);
  const [loading, setLoading] = useState(false);
  const boxRef = useRef<HTMLDivElement>(null);
  const listId = useId();

  // Pide sugerencias con un pequeño retardo (debounce) al escribir.
  useEffect(() => {
    const term = q.trim();
    if (term.length < 2) {
      setItems([]);
      setOpen(false);
      return;
    }
    setLoading(true);
    const ctrl = new AbortController();
    const t = setTimeout(async () => {
      try {
        const res = await fetch(`/api/buscar/?s=${encodeURIComponent(term)}`, {
          signal: ctrl.signal,
        });
        const data = (await res.json()) as { results: Suggestion[] };
        setItems(data.results);
        setOpen(true);
        setActive(-1);
      } catch {
        /* petición cancelada: ignorar */
      } finally {
        setLoading(false);
      }
    }, 180);
    return () => {
      clearTimeout(t);
      ctrl.abort();
    };
  }, [q]);

  // Cerrar al hacer clic fuera.
  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      if (boxRef.current && !boxRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", onClick);
    return () => document.removeEventListener("mousedown", onClick);
  }, []);

  function irABuscar(term: string) {
    const t = term.trim();
    if (t.length < 2) return;
    setOpen(false);
    router.push(`/buscar/?s=${encodeURIComponent(t)}`);
  }

  function onKeyDown(e: React.KeyboardEvent) {
    if (!open || items.length === 0) {
      if (e.key === "Enter") irABuscar(q);
      return;
    }
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setActive((i) => (i + 1) % items.length);
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setActive((i) => (i - 1 + items.length) % items.length);
    } else if (e.key === "Enter") {
      e.preventDefault();
      if (active >= 0) router.push(`/${items[active].slug}/`);
      else irABuscar(q);
    } else if (e.key === "Escape") {
      setOpen(false);
    }
  }

  return (
    <div ref={boxRef} className="relative">
      <div
        role="combobox"
        aria-expanded={open}
        aria-haspopup="listbox"
        aria-controls={listId}
        className="flex overflow-hidden rounded-full bg-neutral-100 ring-1 ring-neutral-200 focus-within:ring-2 focus-within:ring-brand"
      >
        <input
          type="search"
          value={q}
          onChange={(e) => setQ(e.target.value)}
          onKeyDown={onKeyDown}
          onFocus={() => items.length > 0 && setOpen(true)}
          aria-label="Buscar noticias"
          aria-controls={listId}
          aria-autocomplete="list"
          placeholder="¿Qué buscas? Ej. Tesla, autonomía, BYD…"
          className="min-w-0 flex-1 bg-transparent px-6 py-4 text-lg text-neutral-900 placeholder:text-neutral-400 outline-none"
        />
        <button
          type="button"
          onClick={() => irABuscar(q)}
          className="bg-brand px-7 text-base font-black uppercase tracking-wide text-black transition hover:bg-brand-strong"
        >
          Buscar
        </button>
      </div>

      {open && (
        <ul
          id={listId}
          role="listbox"
          className="absolute z-30 mt-2 w-full overflow-hidden rounded-2xl border border-neutral-200 bg-white shadow-xl shadow-black/10"
        >
          {loading && items.length === 0 && (
            <li className="px-5 py-4 text-base text-neutral-500">Buscando…</li>
          )}
          {!loading && items.length === 0 && (
            <li className="px-5 py-4 text-base text-neutral-500">
              Sin sugerencias para “{q.trim()}”.
            </li>
          )}
          {items.map((it, i) => (
            <li key={it.slug} role="option" aria-selected={i === active}>
              <button
                type="button"
                onMouseEnter={() => setActive(i)}
                onClick={() => router.push(`/${it.slug}/`)}
                className={`flex w-full items-center gap-4 px-4 py-3 text-left transition ${
                  i === active ? "bg-brand/15" : "hover:bg-neutral-50"
                }`}
              >
                <span className="relative h-12 w-16 shrink-0 overflow-hidden rounded-md bg-neutral-100">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={it.portada || "/logo.png"}
                    alt=""
                    loading="lazy"
                    decoding="async"
                    className="h-full w-full object-cover"
                  />
                </span>
                <span className="line-clamp-2 text-base font-bold leading-snug text-neutral-900">
                  {it.titulo}
                </span>
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
