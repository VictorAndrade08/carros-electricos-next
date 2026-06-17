import Link from "next/link";
import { formatFecha } from "./format";
import { SITE_NAME } from "./menu";

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

export type RelatedItem = { slug: string; titulo: string; portada: string | null; fecha: string | null };

function catSlug(c: string): string {
  return c.toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "").replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "");
}

/**
 * Página de noticia: cabecera, contenido y barra lateral con "últimas noticias".
 * Markup React limpio con las clases del tema; el contenido viene de la BD.
 */
export default function ArticleView({
  article,
  related,
}: {
  article: Article;
  related: RelatedItem[];
}) {
  return (
    <div className="rb-container edge-padding">
      <div className="single-standard-1 is-sidebar-right sticky-sidebar">
        {/* Columna principal */}
        <article className="post type-post single-article">
          <header className="single-header">
            <nav className="breadcrumb-wrap s-breadcrumb" aria-label="breadcrumb">
              <Link href="/">{SITE_NAME}</Link>
              {article.categorias[0] && (
                <>
                  {" › "}
                  <Link href={`/categoria/${catSlug(article.categorias[0])}/`}>
                    {article.categorias[0]}
                  </Link>
                </>
              )}
            </nav>

            <div className="p-categories">
              {article.categorias.map((c) => (
                <Link
                  key={c}
                  className="p-category"
                  href={`/categoria/${catSlug(c)}/`}
                >
                  {c}
                </Link>
              ))}
            </div>

            <h1 className="entry-title" itemProp="headline">
              {article.titulo}
            </h1>

            <div className="entry-meta is-meta">
              <span className="meta-author">{SITE_NAME}</span>
              <span className="meta-date">
                <time dateTime={article.fecha ?? undefined}>
                  {formatFecha(article.fecha)}
                </time>
              </span>
            </div>
          </header>

          {article.portada && (
            <figure className="single-featured-image first-img-wrap">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                className="wp-post-image"
                src={article.portada}
                alt={article.titulo}
                fetchPriority="high"
              />
            </figure>
          )}

          <div
            className="entry-content rbct clearfix"
            itemProp="articleBody"
            dangerouslySetInnerHTML={{ __html: article.html ?? "" }}
          />

          {article.tags.length > 0 && (
            <div className="entry-tags">
              {article.tags.map((t) => (
                <Link key={t} className="tag-link" href={`/buscar/?s=${encodeURIComponent(t)}`}>
                  #{t}
                </Link>
              ))}
            </div>
          )}
        </article>

        {/* Barra lateral: últimas noticias */}
        <aside className="sidebar s-sidebar is-sidebar">
          <div className="widget">
            <h4 className="widget-title">Últimas noticias</h4>
            <ul className="latest-list">
              {related.map((r) => (
                <li key={r.slug} className="p-wrap p-small">
                  <Link className="p-flink" href={`/${r.slug}/`}>
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      className="featured-img"
                      src={r.portada || "/icon.webp"}
                      alt={r.titulo}
                      loading="lazy"
                    />
                  </Link>
                  <div className="p-content">
                    <h5 className="entry-title">
                      <Link className="p-url" href={`/${r.slug}/`}>
                        {r.titulo}
                      </Link>
                    </h5>
                    <span className="meta-date">{formatFecha(r.fecha)}</span>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </aside>
      </div>
    </div>
  );
}
