import { NextResponse } from "next/server";
import { searchArticles } from "@/lib/articles";

export const runtime = "edge";

/** Sugerencias en vivo para el buscador (autocompletado).
 *  GET /api/buscar/?s=tesla  ->  { results: [{ slug, titulo, portada }] } */
export async function GET(req: Request) {
  const q = new URL(req.url).searchParams.get("s")?.trim() || "";
  if (q.length < 2) return NextResponse.json({ results: [] });

  const hits = await searchArticles(q, 6);
  return NextResponse.json(
    {
      results: hits.map((h) => ({
        slug: h.slug,
        titulo: h.titulo,
        portada: h.portada,
      })),
    },
    { headers: { "Cache-Control": "public, max-age=0, s-maxage=60" } },
  );
}
