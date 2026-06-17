import Link from "next/link";
import NewsletterForm from "@/components/NewsletterForm";
import { SITE } from "@/lib/site";

const SECCIONES = [
  { label: "Noticias", href: "/categoria/noticias/" },
  { label: "Reseñas", href: "/categoria/resenas/" },
  { label: "Tecnología", href: "/categoria/tecnologia/" },
  { label: "Todas las noticias", href: "/" },
];

const SOCIALS = [
  {
    label: "Instagram",
    href: SITE.social.instagram,
    icon: (
      <>
        <rect x="2" y="2" width="20" height="20" rx="5" />
        <circle cx="12" cy="12" r="4" />
        <circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none" />
      </>
    ),
  },
  {
    label: "Facebook",
    href: SITE.social.facebook,
    icon: <path d="M15 8h-2a2 2 0 0 0-2 2v12M8 13h6" />,
  },
  {
    label: "TikTok",
    href: SITE.social.tiktok,
    icon: <path d="M9 12a4 4 0 1 0 4 4V4a5 5 0 0 0 5 5" />,
  },
];

export default function Footer() {
  return (
    <footer className="bg-black text-neutral-300">
      {/* Banda de marca + redes */}
      <div className="border-b border-white/10">
        <div className="mx-auto flex max-w-7xl flex-col items-start gap-8 px-5 py-14 md:flex-row md:items-center md:justify-between md:px-12">
          <h2 className="max-w-lg text-4xl font-black uppercase leading-[0.9] text-white md:text-5xl">
            El futuro es <span className="text-brand">eléctrico</span>
          </h2>
          <div className="flex items-center gap-3">
            {SOCIALS.map((s) => (
              <a
                key={s.label}
                href={s.href}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={s.label}
                className="grid h-12 w-12 place-items-center rounded-full border border-white/15 text-white transition hover:border-brand hover:bg-brand hover:text-black"
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  {s.icon}
                </svg>
              </a>
            ))}
          </div>
        </div>
      </div>

      {/* Columnas */}
      <div className="mx-auto grid max-w-7xl gap-10 px-5 py-14 md:grid-cols-[1.4fr_1fr_1.2fr] md:px-12">
        <div>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/logo-white.png" alt="Carros Eléctricos" className="h-11 w-auto" />
          <p className="mt-5 max-w-sm text-lg leading-relaxed text-neutral-300">
            El medio de los autos eléctricos en Ecuador: noticias, reseñas y la
            tecnología que mueve el futuro.
          </p>
        </div>

        <div>
          <h4 className="mb-5 text-base font-black uppercase tracking-[0.18em] text-white">
            Secciones
          </h4>
          <ul className="space-y-4 text-lg">
            {SECCIONES.map((n) => (
              <li key={n.href}>
                <Link
                  href={n.href}
                  className="inline-flex items-center gap-2 text-neutral-300 transition hover:text-brand"
                >
                  <span className="h-px w-4 bg-brand" />
                  {n.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h4 className="mb-5 text-base font-black uppercase tracking-[0.18em] text-white">
            Recibe las novedades
          </h4>
          <p className="mb-4 text-lg text-neutral-300">
            Déjanos tu WhatsApp y entérate de los lanzamientos antes que nadie.
          </p>
          <NewsletterForm />
        </div>
      </div>

      <div className="border-t border-white/10 py-6">
        <div className="mx-auto max-w-7xl px-5 text-center text-[13px] uppercase tracking-[0.18em] text-neutral-400 md:px-12">
          © {new Date().getFullYear()} Carros Eléctricos
        </div>
      </div>
    </footer>
  );
}
