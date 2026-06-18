"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { sfx, isMuted, toggleMuted } from "@/lib/sound";

const NAV = [
  { label: "Inicio", href: "/" },
  { label: "Noticias", href: "/categoria/noticias/" },
  { label: "Reseñas", href: "/categoria/resenas/" },
  { label: "Tecnología", href: "/categoria/tecnologia/" },
  { label: "Cargadores", href: "/cargadores/" },
];

/** Cabecera estilo Lynk & Co: barra negra, logo blanco, navegación minimalista.
 *  No es sticky. En móvil despliega un menú a pantalla completa. */
export default function Header() {
  const [open, setOpen] = useState(false);
  const [muted, setMutedState] = useState(false);

  // Sincroniza el estado de silencio guardado (tras montar, sin desajuste SSR).
  useEffect(() => setMutedState(isMuted()), []);

  // Optimización móvil: bloquea el scroll del fondo y permite cerrar con Escape.
  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = prev;
      window.removeEventListener("keydown", onKey);
    };
  }, [open]);

  return (
    <header className="relative z-50 bg-black">
      <div className="mx-auto flex h-20 max-w-7xl items-center px-5 md:px-12">
        <div className="flex flex-1 items-center">
          <Link
            href="/"
            onClick={() => setOpen(false)}
            className="flex items-center"
            aria-label="Carros Eléctricos"
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/logo-white.png"
              alt="Carros Eléctricos"
              className="h-8 w-auto md:h-9"
            />
          </Link>
        </div>

        {/* Navegación de escritorio */}
        <nav className="hidden items-center justify-center gap-10 md:flex">
          {NAV.map((n) => (
            <Link
              key={n.href}
              href={n.href}
              onMouseEnter={() => sfx.hover()}
              className="nav-underline text-[15px] font-bold uppercase tracking-wider text-neutral-300 transition-colors hover:text-white"
            >
              {n.label}
            </Link>
          ))}
        </nav>

        <div className="flex flex-1 items-center justify-end gap-1">
          <Link
            href="/buscar/"
            aria-label="Buscar"
            onClick={() => setOpen(false)}
            className="grid h-11 w-11 place-items-center rounded-full text-neutral-200 transition hover:bg-brand hover:text-black"
          >
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round">
              <circle cx="11" cy="11" r="7" />
              <path d="m21 21-4.3-4.3" />
            </svg>
          </Link>

          {/* Silenciar / activar sonidos de interfaz */}
          <button
            type="button"
            data-no-sfx
            onClick={() => {
              const m = toggleMuted();
              setMutedState(m);
              if (!m) sfx.click();
            }}
            aria-label={muted ? "Activar sonidos" : "Silenciar sonidos"}
            aria-pressed={muted}
            className="grid h-11 w-11 place-items-center rounded-full text-neutral-200 transition hover:bg-brand hover:text-black"
          >
            {muted ? (
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M11 5 6 9H2v6h4l5 4V5z" />
                <path d="m23 9-6 6M17 9l6 6" />
              </svg>
            ) : (
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M11 5 6 9H2v6h4l5 4V5z" />
                <path d="M15.5 8.5a5 5 0 0 1 0 7M19 5a9 9 0 0 1 0 14" />
              </svg>
            )}
          </button>

          {/* Botón hamburguesa (solo móvil) */}
          <button
            type="button"
            onClick={() => setOpen((v) => {
              if (!v) sfx.open();
              return !v;
            })}
            aria-label={open ? "Cerrar menú" : "Abrir menú"}
            aria-expanded={open}
            className="grid h-11 w-11 place-items-center rounded-full text-neutral-200 transition hover:bg-brand hover:text-black md:hidden"
          >
            {open ? (
              <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round">
                <path d="M6 6l12 12M18 6 6 18" />
              </svg>
            ) : (
              <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round">
                <path d="M4 7h16M4 12h16M4 17h16" />
              </svg>
            )}
          </button>
        </div>
      </div>

      {/* Menú móvil desplegable */}
      {open && (
        <nav className="border-t border-white/10 bg-black md:hidden">
          <div className="mx-auto max-w-7xl px-5 py-4">
            {NAV.map((n) => (
              <Link
                key={n.href}
                href={n.href}
                onClick={() => setOpen(false)}
                className="block border-b border-white/5 py-4 text-xl font-bold uppercase tracking-wide text-neutral-200 transition-colors hover:text-brand"
              >
                {n.label}
              </Link>
            ))}
            <Link
              href="/buscar/"
              onClick={() => setOpen(false)}
              className="mt-4 flex items-center gap-3 text-xl font-bold uppercase tracking-wide text-brand"
            >
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round">
                <circle cx="11" cy="11" r="7" />
                <path d="m21 21-4.3-4.3" />
              </svg>
              Buscar
            </Link>
          </div>
        </nav>
      )}
    </header>
  );
}
