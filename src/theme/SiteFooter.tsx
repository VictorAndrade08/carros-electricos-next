import Link from "next/link";
import { MENU, SITE_NAME } from "./menu";

/** Pie de página del sitio. Markup React limpio con clases del tema. */
export default function SiteFooter() {
  return (
    <footer className="footer-wrap rb-section left-dot">
      <div className="footer-inner footer-has-bg">
        <div className="rb-container edge-padding">
          <div className="footer-columns rb-columns is-gap-25">
            <div className="footer-col">
              <div className="h1 footer-mark">//</div>
              <p className="footer-quote">
                Reseñas, tecnología y tendencias de la industria automotriz para
                mantenerte al día en el mundo de los motores.
              </p>
            </div>
            <div className="footer-col">
              <h4 className="widget-title">Secciones</h4>
              <ul className="footer-menu">
                {MENU.map((m) => (
                  <li key={m.href}>
                    <Link href={m.href}>{m.label}</Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
        <div className="copyright-wrap rb-container edge-padding">
          <p>
            © {new Date().getFullYear()} {SITE_NAME}. Todos los derechos
            reservados.
          </p>
        </div>
      </div>
    </footer>
  );
}
