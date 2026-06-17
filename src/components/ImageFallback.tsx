"use client";

import { useEffect } from "react";

/**
 * Respaldo global: cualquier <img> que falle se reemplaza por el logo, para que
 * nunca se vea una imagen rota.
 */
export default function ImageFallback() {
  useEffect(() => {
    const onError = (e: Event) => {
      const img = e.target as HTMLImageElement;
      if (img.tagName === "IMG" && !img.src.endsWith("/logo.png")) {
        img.src = "/logo.png";
        img.style.objectFit = "contain";
        img.style.background = "#f5f5f5";
        img.style.padding = "8%";
      }
    };
    document.addEventListener("error", onError, true);
    return () => document.removeEventListener("error", onError, true);
  }, []);

  return null;
}
