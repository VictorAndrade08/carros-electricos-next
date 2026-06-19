import { describe, it, expect, vi, afterEach } from "vitest";
import { createToken, verifyToken, safeEqual } from "../session";

const SECRET = "rm-prez-7f3a-2026-session";

afterEach(() => vi.useRealTimers());

describe("safeEqual", () => {
  it("es true solo con cadenas idénticas", () => {
    expect(safeEqual("admin", "admin")).toBe(true);
    expect(safeEqual("admin", "Admin")).toBe(false);
    expect(safeEqual("admin", "admin2")).toBe(false);
    expect(safeEqual("", "")).toBe(true);
  });
});

describe("token de sesión (HMAC-SHA256)", () => {
  it("un token recién creado se verifica con el mismo secreto", async () => {
    const token = await createToken(SECRET);
    expect(await verifyToken(token, SECRET)).toBe(true);
  });

  it("falla con un secreto distinto", async () => {
    const token = await createToken(SECRET);
    expect(await verifyToken(token, "otro-secreto")).toBe(false);
  });

  it("rechaza un token manipulado (firma o payload alterados)", async () => {
    const token = await createToken(SECRET);
    const [payload, sig] = token.split(".");
    expect(await verifyToken(`${payload}x.${sig}`, SECRET)).toBe(false);
    expect(await verifyToken(`${payload}.${sig}x`, SECRET)).toBe(false);
  });

  it("rechaza basura y valores vacíos sin lanzar", async () => {
    expect(await verifyToken(undefined, SECRET)).toBe(false);
    expect(await verifyToken("", SECRET)).toBe(false);
    expect(await verifyToken("sin-punto", SECRET)).toBe(false);
    expect(await verifyToken("a.b.c", SECRET)).toBe(false);
  });

  it("caduca pasadas las 8 horas", async () => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date("2026-06-19T00:00:00Z"));
    const token = await createToken(SECRET);
    expect(await verifyToken(token, SECRET)).toBe(true);

    // +8h 1min -> expirado
    vi.setSystemTime(new Date("2026-06-19T08:01:00Z"));
    expect(await verifyToken(token, SECRET)).toBe(false);
  });
});
