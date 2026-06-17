import Link from "next/link";
import { MENU, LOGO_SRC, SITE_NAME } from "./menu";

/**
 * Cabecera del sitio (logo + menú + buscar). Usa las clases del tema Foxiz para
 * que el CSS las estilice; el markup es React limpio y editable.
 */
export default function SiteHeader() {
  return (
    <header className="header-wrap rb-section header-set-1 header-1 header-wrapper style-shadow has-quick-menu">
      <div className="navbar-outer">
        <div className="sticky-holder">
          <div className="navbar-wrap">
            <div className="rb-container edge-padding">
              <div className="navbar-inner">
                <div className="navbar-left">
                  <div className="logo-wrap is-image-logo">
                    <Link className="logo" href="/" aria-label={SITE_NAME}>
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        className="logo-default"
                        src={LOGO_SRC}
                        alt={SITE_NAME}
                        width={190}
                        height={42}
                      />
                    </Link>
                  </div>
                  <nav className="main-menu-wrap">
                    <ul className="main-menu rb-menu">
                      {MENU.map((m) => (
                        <li
                          key={m.href}
                          className="menu-item menu-item-type-custom"
                        >
                          <Link href={m.href}>{m.label}</Link>
                        </li>
                      ))}
                    </ul>
                  </nav>
                </div>
                <div className="navbar-right">
                  <div className="menu-icons-wrap">
                    <Link
                      className="icon-holder search-trigger"
                      href="/buscar/"
                      aria-label="Buscar"
                    >
                      <i aria-hidden className="rbi rbi-search" />
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
