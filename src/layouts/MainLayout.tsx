import { useState } from "react";
import { NavLink, Outlet } from "react-router-dom";
import logo from "../assets/logo.webp";
import "./MainLayout.css";

const NAV_LINKS = [
  { to: "/", label: "Home", end: true },
  { to: "/products", label: "Products & Services" },
  { to: "/about", label: "About" },
  { to: "/events", label: "Events" },
  { to: "/contact", label: "Contact" },
];

export default function MainLayout() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <div className="site">
      <header className="site-header">
        <div className="site-header__inner">
          <NavLink to="/" className="logo" onClick={() => setMenuOpen(false)}>
            <img src={logo} alt="Producing Inc" />
          </NavLink>

          <nav className={`site-nav${menuOpen ? " site-nav--open" : ""}`} aria-label="Primary">
            {NAV_LINKS.map((link) => (
              <NavLink
                key={link.to}
                to={link.to}
                end={link.end}
                onClick={() => setMenuOpen(false)}
                className={({ isActive }) =>
                  isActive ? "site-nav__link is-current" : "site-nav__link"
                }
              >
                {link.label}
              </NavLink>
            ))}
          </nav>

          <button
            className={`site-menu-toggle${menuOpen ? " site-menu-toggle--open" : ""}`}
            onClick={() => setMenuOpen((open) => !open)}
            aria-label="Toggle menu"
            aria-expanded={menuOpen}
          >
            <span />
            <span />
            <span />
          </button>
        </div>
      </header>

      <main>
        <Outlet />
      </main>

      <footer className="site-footer">
        <div className="site-footer__inner">
          <div className="site-footer__brand">
            <img className="site-footer__logo" src={logo} alt="Producing Inc" />
            <p>
              A trusted produce partner focused on quality, reliability, service, and long-term
              relationships.
            </p>
            <div className="site-footer__social">
              <a href="#" aria-label="LinkedIn">
                in
              </a>
              <a href="#" aria-label="Instagram">
                ig
              </a>
              <a href="#" aria-label="Facebook">
                f
              </a>
            </div>
          </div>

          <div className="site-footer__col">
            <h4>Company</h4>
            {NAV_LINKS.map((link) => (
              <NavLink key={link.to} to={link.to} end={link.end}>
                {link.label}
              </NavLink>
            ))}
          </div>

          <div className="site-footer__col">
            <h4>Contact</h4>
            <p>
              10720 Caribbean Blvd
              <br />
              Cutler Bay, FL 33189
            </p>
            <p>305.401.6360</p>
          </div>
        </div>

        <div className="site-footer__bottom">
          <span>Copyright © {new Date().getFullYear()} Producing Inc.</span>
        </div>
      </footer>
    </div>
  );
}
