import { getArticles } from "@/lib/articles";
import { SITE, absoluteUrl } from "@/lib/site";

export const runtime = "edge";

function esc(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

/** Feed RSS 2.0 con las últimas noticias. Lo consumen Google News,
 *  agregadores y los rastreadores de IA (frescura + indexación). */
export async function GET() {
  const arts = await getArticles(30).catch(() => []);

  const items = arts
    .map((a) => {
      const url = absoluteUrl(`/${a.slug}/`);
      const pub = a.fecha ? new Date(a.fecha).toUTCString() : "";
      return `<item>
  <title>${esc(a.titulo)}</title>
  <link>${url}</link>
  <guid isPermaLink="true">${url}</guid>${pub ? `\n  <pubDate>${pub}</pubDate>` : ""}
  <description>${esc(a.extracto || "")}</description>${
    a.categorias[0] ? `\n  <category>${esc(a.categorias[0])}</category>` : ""
  }${a.portada ? `\n  <enclosure url="${esc(a.portada)}" type="image/webp" />` : ""}
</item>`;
    })
    .join("\n");

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
<channel>
  <title>${esc(SITE.name)}</title>
  <link>${SITE.url}</link>
  <atom:link href="${absoluteUrl("/feed.xml")}" rel="self" type="application/rss+xml" />
  <description>${esc(SITE.description)}</description>
  <language>es-EC</language>
${items}
</channel>
</rss>`;

  return new Response(xml, {
    headers: {
      "Content-Type": "application/rss+xml; charset=utf-8",
      "Cache-Control": "public, max-age=0, s-maxage=600, stale-while-revalidate=3600",
    },
  });
}
