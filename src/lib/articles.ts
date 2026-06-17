import "server-only";
import { queryParams } from "./d1";
import { slugify } from "./text";

export type Article = {
  slug: string;
  titulo: string;
  fecha: string | null;
  portada: string | null;
  extracto: string | null;
  html: string | null;
  categorias: string[];
  tags: string[];
};

type Row = {
  slug: string;
  titulo: string;
  fecha: string | null;
  portada: string | null;
  extracto: string | null;
  html: string | null;
  categorias: string | null;
  tags: string | null;
};

function parseList(s: string | null): string[] {
  try {
    const v = JSON.parse(s || "[]");
    return Array.isArray(v) ? v.filter((x) => typeof x === "string") : [];
  } catch {
    return [];
  }
}

function toArticle(r: Row): Article {
  return {
    slug: r.slug,
    titulo: r.titulo,
    fecha: r.fecha,
    portada: r.portada,
    extracto: r.extracto,
    html: r.html,
    categorias: parseList(r.categorias),
    tags: parseList(r.tags),
  };
}

const COLS =
  "slug, titulo, fecha, portada, extracto, html, categorias, tags";

/** Todas las noticias, de más nueva a más antigua. */
export async function getArticles(limit = 60): Promise<Article[]> {
  const rows = await queryParams<Row>(
    `SELECT ${COLS} FROM articulos ORDER BY fecha DESC LIMIT ?1;`,
    [limit],
  );
  return rows.map(toArticle);
}

/** Una noticia por slug. */
export async function getArticle(slug: string): Promise<Article | null> {
  const rows = await queryParams<Row>(
    `SELECT ${COLS} FROM articulos WHERE slug = ?1 LIMIT 1;`,
    [slug],
  );
  return rows.length ? toArticle(rows[0]) : null;
}

/** Noticias de una categoría (por el slug de la URL). */
export async function getArticlesByCategory(catSlug: string): Promise<Article[]> {
  const all = await getArticles(100);
  return all.filter((a) => a.categorias.some((c) => slugify(c) === catSlug));
}

export type SearchHit = {
  slug: string;
  titulo: string;
  portada: string | null;
  extracto: string | null;
};

/** Busca en los artículos nuevos (`articulos`) y en el índice legacy (`busqueda`).
 *  Coincidencia por título, extracto o cuerpo. Devuelve resultados sin duplicar. */
export async function searchArticles(q: string, limit = 40): Promise<SearchHit[]> {
  const termino = q.trim();
  if (termino.length < 2) return [];
  const like = `%${termino}%`;

  const nuevos = await queryParams<Row>(
    `SELECT ${COLS} FROM articulos
       WHERE titulo LIKE ?1 OR extracto LIKE ?1 OR html LIKE ?1
       ORDER BY fecha DESC LIMIT ?2;`,
    [like, limit],
  ).catch(() => [] as Row[]);

  const viejos = await queryParams<{
    slug: string;
    titulo: string;
    thumb: string | null;
    excerpt: string | null;
  }>(
    `SELECT slug, titulo, thumb, excerpt FROM busqueda
       WHERE titulo LIKE ?1 OR excerpt LIKE ?1 OR texto LIKE ?1
       LIMIT ?2;`,
    [like, limit],
  ).catch(() => []);

  const vistos = new Set<string>();
  const out: SearchHit[] = [];
  for (const r of nuevos) {
    const a = toArticle(r);
    if (vistos.has(a.slug)) continue;
    vistos.add(a.slug);
    out.push({ slug: a.slug, titulo: a.titulo, portada: a.portada, extracto: a.extracto });
  }
  for (const r of viejos) {
    if (vistos.has(r.slug)) continue;
    vistos.add(r.slug);
    out.push({ slug: r.slug, titulo: r.titulo, portada: r.thumb, extracto: r.excerpt });
  }
  return out.slice(0, limit);
}
