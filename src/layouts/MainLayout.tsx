import { NavLink, Outlet } from "react-router-dom";
import "./MainLayout.css";

const NAV_LINKS = [
  { to: "/", label: "Home", end: true },
  { to: "/products", label: "Products & Services" },
  { to: "/about", label: "About" },
  { to: "/events", label: "Events" },
  { to: "/contact", label: "Contact" },
];

export default function MainLayout() {
  return (
    <div className="site">
      <header className="site-header">
        <div className="site-header__inner">
          <NavLink to="/" className="logo">
            Producing Inc
          </NavLink>

          <nav className="site-nav" aria-label="Primary">
            {NAV_LINKS.map((link) => (
              <NavLink
                key={link.to}
                to={link.to}
                end={link.end}
                className={({ isActive }) =>
                  isActive ? "site-nav__link is-current" : "site-nav__link"
                }
              >
                {link.label}
              </NavLink>
            ))}
          </nav>
        </div>
      </header>

      <main>
        <Outlet />
      </main>

      <footer className="site-footer">
        <div className="site-footer__inner">
          <span>Copyright © {new Date().getFullYear()} Producing Inc.</span>
          <span>10720 Caribbean Blvd, Cutler Bay, FL 33189 · 305.401.6360</span>
        </div>
      </footer>
    </div>
  );
}
