"use client";

import { useEffect, useRef, useState } from "react";

/* eslint-disable @typescript-eslint/no-explicit-any */

// Key de Google Maps (gratis con cuenta de Google Cloud). Si está vacía, se usa
// OpenStreetMap (Leaflet) como respaldo gratuito y sin clave.
const GKEY = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || "";

// Centro por defecto: Ambato (si el usuario no comparte su ubicación).
const DEFAULT = { lat: -1.2491, lng: -78.6168 };

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

// Popup detallado con datos del punto + botón "Ir en Google Maps" (cómo llegar).
function popupHtml(p: Punto): string {
  const dir = `https://www.google.com/maps/dir/?api=1&destination=${p.lat},${p.lng}`;
  const meta = [
    p.operator,
    p.access ? `Acceso: ${p.access}` : "",
    p.fee ? `Pago: ${p.fee}` : "",
  ]
    .filter(Boolean)
    .map(
      (x) =>
        `<div style="color:#6b7280;font-size:12px;line-height:1.5;display:flex;align-items:center;gap:5px"><span style="color:#84cc16">●</span>${x}</div>`,
    )
    .join("");
  return `<div style="min-width:200px;font-family:inherit">
    <div style="font-weight:800;font-size:14px;color:#0a0a0a;line-height:1.25;text-transform:uppercase;letter-spacing:.01em">${p.title}</div>
    <div style="margin-top:6px">${meta || '<div style="color:#9ca3af;font-size:12px">Punto de carga para autos eléctricos</div>'}</div>
    <a href="${dir}" target="_blank" rel="noopener noreferrer" style="display:flex;align-items:center;justify-content:center;gap:7px;margin-top:11px;background:#a3e635;color:#000;font-weight:800;font-size:12px;text-transform:uppercase;letter-spacing:.04em;padding:10px 12px;border-radius:999px;text-decoration:none">
      <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M3 11l19-9-9 19-2-8-8-2z"/></svg>
      Ir en Google Maps
    </a>
  </div>`;
}

function loadScript(src: string): Promise<void> {
  return new Promise((resolve, reject) => {
    const existing = document.querySelector<HTMLScriptElement>(
      `script[src="${src}"]`,
    );
    if (existing) {
      if (existing.dataset.loaded) return resolve();
      existing.addEventListener("load", () => resolve());
      existing.addEventListener("error", () => reject(new Error(src)));
      return;
    }
    const s = document.createElement("script");
    s.src = src;
    s.async = true;
    s.onload = () => {
      s.dataset.loaded = "1";
      resolve();
    };
    s.onerror = () => reject(new Error(src));
    document.body.appendChild(s);
  });
}

function loadCss(href: string) {
  if (!document.querySelector(`link[href="${href}"]`)) {
    const l = document.createElement("link");
    l.rel = "stylesheet";
    l.href = href;
    document.head.appendChild(l);
  }
}

// Pide la ubicación del usuario; si la rechaza o falla, usa Ambato.
function getCenter(): Promise<{ lat: number; lng: number }> {
  return new Promise((resolve) => {
    if (!navigator.geolocation) return resolve(DEFAULT);
    navigator.geolocation.getCurrentPosition(
      (pos) => resolve({ lat: pos.coords.latitude, lng: pos.coords.longitude }),
      () => resolve(DEFAULT),
      { timeout: 6000, maximumAge: 600000 },
    );
  });
}

export default function MapaCargadores() {
  const ref = useRef<HTMLDivElement>(null);
  const [count, setCount] = useState<number | null>(null);
  const [status, setStatus] = useState<"loading" | "ready" | "error">("loading");

  useEffect(() => {
    let cancelled = false;
    let cleanup = () => {};

    (async () => {
      try {
        const [center, pointsRes] = await Promise.all([
          getCenter(),
          fetch("/cargadores-ec.json").then((r) => r.json()),
        ]);
        if (cancelled || !ref.current) return;
        const points: Punto[] = pointsRes.points || [];
        setCount(points.length);

        if (GKEY) {
          // ---- Google Maps ----
          await loadScript(
            `https://maps.googleapis.com/maps/api/js?key=${GKEY}&loading=async`,
          );
          if (cancelled || !ref.current) return;
          const g = (window as any).google;
          const map = new g.maps.Map(ref.current, {
            center,
            zoom: 12,
            mapTypeControl: false,
            streetViewControl: false,
          });
          new g.maps.Marker({
            position: center,
            map,
            title: "Tu ubicación",
          });
          const info = new g.maps.InfoWindow();
          points.forEach((p) => {
            const m = new g.maps.Marker({
              position: { lat: p.lat, lng: p.lng },
              map,
              title: p.title,
            });
            m.addListener("click", () => {
              info.setContent(popupHtml(p));
              info.open(map, m);
            });
          });
        } else {
          // ---- OpenStreetMap (Leaflet), gratis y sin key ----
          loadCss(LEAFLET_CSS);
          await loadScript(LEAFLET_JS);
          if (cancelled || !ref.current) return;
          const L = (window as any).L;
          const map = L.map(ref.current, { scrollWheelZoom: false }).setView(
            [center.lat, center.lng],
            12,
          );
          cleanup = () => map.remove();
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
          L.marker([center.lat, center.lng])
            .addTo(map)
            .bindPopup("Tu ubicación");
          points.forEach((p) => {
            L.marker([p.lat, p.lng], { icon })
              .addTo(map)
              .bindPopup(popupHtml(p));
          });
        }
        if (!cancelled) setStatus("ready");
      } catch {
        if (!cancelled) setStatus("error");
      }
    })();

    return () => {
      cancelled = true;
      cleanup();
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
            ? `⚡ ${count} puntos de carga en Ecuador · ${GKEY ? "Google Maps" : "OpenStreetMap"}`
            : "Cargando mapa…"}
      </p>
    </div>
  );
}
