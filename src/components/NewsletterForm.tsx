"use client";

import { useState } from "react";

/** Suscripción por WhatsApp. Por ahora SIMULA el envío (éxito falso) — no manda
 *  nada a ningún lado todavía.
 *  TODO(backend): conectar a tu proveedor / API de WhatsApp (p. ej. una API route
 *  POST /api/whatsapp que guarde el número o dispare la API de WhatsApp Business). */
export default function NewsletterForm() {
  const [phone, setPhone] = useState("");
  const [status, setStatus] = useState<"idle" | "ok" | "error">("idle");

  function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    // Validación básica: al menos 7 dígitos (acepta +, espacios y guiones).
    const digitos = phone.replace(/\D/g, "");
    if (digitos.length < 7) {
      setStatus("error");
      return;
    }
    // Envío simulado (sin backend real todavía).
    setStatus("ok");
    setPhone("");
  }

  if (status === "ok") {
    return (
      <p className="rounded-2xl bg-brand/15 px-5 py-4 text-base font-semibold text-brand">
        ¡Listo! Te escribiremos por WhatsApp con cada novedad. ⚡
      </p>
    );
  }

  return (
    <form onSubmit={onSubmit} noValidate>
      <div className="flex overflow-hidden rounded-full bg-white/10 ring-1 ring-white/20 focus-within:ring-brand">
        <input
          type="tel"
          inputMode="tel"
          required
          value={phone}
          onChange={(e) => {
            setPhone(e.target.value);
            if (status === "error") setStatus("idle");
          }}
          placeholder="Tu WhatsApp (ej. 0991234567)"
          aria-label="Tu número de WhatsApp"
          className="min-w-0 flex-1 bg-transparent px-5 py-3.5 text-base text-white placeholder:text-neutral-400 outline-none"
        />
        <button
          type="submit"
          className="bg-brand px-6 text-base font-black uppercase tracking-wide text-black transition hover:bg-brand-strong"
        >
          Unirme
        </button>
      </div>
      {status === "error" && (
        <p className="mt-2 text-sm font-semibold text-red-400">
          Escribe un número de WhatsApp válido.
        </p>
      )}
    </form>
  );
}
