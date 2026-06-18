"use client";

import { useEffect, useRef, useState } from "react";

const LEAFLET_CSS = "https://unpkg.com/leaflet@1.9.4/dist/leaflet.css";
const LEAFLET_JS = "https://unpkg.com/leaflet@1.9.4/dist/leaflet.js";

type Punto = {
  lat: number;
  lng: number;
  title: string;
  operator?: string;
  access?: string;
  fee?: string;
};

/** Mapa de cargadores (Leaflet + OpenStreetMap, gratis y sin API key).
 *  Los datos vienen de /api/cargadores/ (Overpass API). */
export default function MapaCargadores() {
  const ref = useRef<HTMLDivElement>(null);
  const [count, setCount] = useState<number | null>(null);
  const [status, setStatus] = useState<"loading" | "ready" | "error">("loading");

  useEffect(() => {
    let cancelled = false;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    let map: any;

    function loadCss() {
      if (!document.querySelector(`link[href="${LEAFLET_CSS}"]`)) {
        const l = document.createElement("link");
        l.rel = "stylesheet";
        l.href = LEAFLET_CSS;
        document.head.appendChild(l);
      }
    }
    function loadJs(): Promise<void> {
      return new Promise((resolve, reject) => {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        if ((window as any).L) return resolve();
        const s = document.createElement("script");
        s.src = LEAFLET_JS;
        s.async = true;
        s.onload = () => resolve();
        s.onerror = () => reject(new Error("leaflet"));
        document.body.appendChild(s);
      });
    }

    (async () => {
      try {
        loadCss();
        await loadJs();
        if (cancelled || !ref.current) return;
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const L = (window as any).L;
        map = L.map(ref.current, { scrollWheelZoom: false }).setView(
          [-1.4, -78.3],
          6,
        );
        L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
          maxZoom: 19,
          attribution: "&copy; OpenStreetMap",
        }).addTo(map);

        const icon = L.divIcon({
          className: "",
          iconSize: [30, 30],
          iconAnchor: [15, 15],
          popupAnchor: [0, -14],
          html: '<div style="width:30px;height:30px;border-radius:50%;background:#a3e635;border:2px solid #000;display:grid;place-items:center;font-size:15px;box-shadow:0 2px 6px rgba(0,0,0,.4)">⚡</div>',
        });

        const res = await fetch("/api/cargadores/");
        const data = (await res.json()) as { points: Punto[] };
        if (cancelled) return;
        setCount(data.points.length);
        data.points.forEach((p) => {
          const extra = [
            p.operator,
            p.access ? `Acceso: ${p.access}` : "",
            p.fee ? `Pago: ${p.fee}` : "",
          ]
            .filter(Boolean)
            .join("<br>");
          L.marker([p.lat, p.lng], { icon })
            .addTo(map)
            .bindPopup(
              `<strong>${p.title}</strong>${extra ? `<br>${extra}` : ""}`,
            );
        });
        setStatus("ready");
      } catch {
        if (!cancelled) setStatus("error");
      }
    })();

    return () => {
      cancelled = true;
      if (map) map.remove();
    };
  }, []);

  return (
    <div>
      <div
        ref={ref}
        className="relative z-0 h-[70vh] min-h-[420px] w-full overflow-hidden rounded-2xl bg-neutral-100 ring-1 ring-neutral-200"
      />
      <p className="mt-3 text-sm font-semibold text-neutral-500">
        {status === "error"
          ? "No se pudo cargar el mapa. Intenta recargar la página."
          : count !== null
            ? `⚡ ${count} puntos de carga en Ecuador · Datos de OpenStreetMap`
            : "Cargando mapa…"}
      </p>
    </div>
  );
}
