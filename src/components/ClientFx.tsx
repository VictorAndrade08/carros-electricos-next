"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";
import { sfx } from "@/lib/sound";

/** Efectos globales del cliente: sonidos de UI + revelado al hacer scroll.
 *  Liviano: un único listener de clics y un único IntersectionObserver. */
export default function ClientFx() {
  const pathname = usePathname();

  // Sonido sutil al hacer clic en enlaces/botones (tras el primer gesto del usuario).
  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      const el = (e.target as HTMLElement | null)?.closest("a, button");
      if (el && !el.hasAttribute("data-no-sfx")) sfx.click();
    };
    document.addEventListener("click", onClick, true);
    return () => document.removeEventListener("click", onClick, true);
  }, []);

  // Revelado al entrar en pantalla. Se re-escanea en cada navegación.
  useEffect(() => {
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const els = Array.from(
      document.querySelectorAll<HTMLElement>(".reveal:not(.in)"),
    );
    if (reduce || !("IntersectionObserver" in window)) {
      els.forEach((el) => el.classList.add("in"));
      return;
    }
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((en) => {
          if (en.isIntersecting) {
            en.target.classList.add("in");
            io.unobserve(en.target);
          }
        });
      },
      { rootMargin: "0px 0px -8% 0px", threshold: 0.06 },
    );
    const id = requestAnimationFrame(() => els.forEach((el) => io.observe(el)));
    return () => {
      cancelAnimationFrame(id);
      io.disconnect();
    };
  }, [pathname]);

  return null;
}
