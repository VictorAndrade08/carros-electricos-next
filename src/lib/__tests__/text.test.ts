import { describe, it, expect } from "vitest";
import { slugify, normalizeKey, escapeHtml } from "../text";

describe("slugify", () => {
  it("quita acentos y pasa a minúsculas con guiones", () => {
    expect(slugify("Cámara Réflex 2024!")).toBe("camara-reflex-2024");
  });
  it("colapsa separadores y recorta guiones de los bordes", () => {
    expect(slugify("  Hola   Mundo  ")).toBe("hola-mundo");
    expect(slugify("¡Tesla, BYD & Lynk!")).toBe("tesla-byd-lynk");
  });
  it("normaliza la ñ a n (comportamiento NFD)", () => {
    expect(slugify("Niño Eléctrico")).toBe("nino-electrico");
  });
});

describe("normalizeKey", () => {
  it("deja una clave de búsqueda sin acentos ni signos", () => {
    expect(normalizeKey("Autonomía: 500 km!!")).toBe("autonomia 500 km");
  });
  it("colapsa espacios múltiples", () => {
    expect(normalizeKey("BYD    Tesla")).toBe("byd tesla");
  });
});

describe("escapeHtml", () => {
  it("escapa los caracteres peligrosos para HTML", () => {
    expect(escapeHtml('<a href="x">&')).toBe("&lt;a href=&quot;x&quot;&gt;&amp;");
  });
  it("escapa & antes que el resto (sin doble escape)", () => {
    expect(escapeHtml("a & <b>")).toBe("a &amp; &lt;b&gt;");
  });
});
