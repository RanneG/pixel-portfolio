import React, { useState } from "react";
import { NavLink, Outlet } from "react-router-dom";
import { useLanguage } from "../../contexts/LanguageContext";
import { usePortfolioData } from "../../contexts/PortfolioDataContext";
import { SiteViewToggle } from "../SiteViewToggle";

export const BrowseLayout: React.FC = () => {
  const { t } = useLanguage();
  const { data } = usePortfolioData();
  const [mobileOpen, setMobileOpen] = useState(false);

  const links = [
    { to: "/", end: true, labelKey: "browse.nav.home" },
    { to: "/about", end: false, labelKey: "browse.nav.about" },
    { to: "/experience", end: false, labelKey: "browse.nav.experience" },
    { to: "/education", end: false, labelKey: "browse.nav.education" },
    { to: "/skills", end: false, labelKey: "browse.nav.skills" },
    { to: "/projects", end: false, labelKey: "browse.nav.projects" },
    { to: "/contact", end: false, labelKey: "browse.nav.contact" }
  ] as const;

  const brand =
    data.name
      ?.split(/\s+/)
      .filter(Boolean)
      .slice(0, 2)
      .map((w) => w[0])
      .join("") || t("browse.brand");

  return (
    <div className="vibe-coder-browse min-h-screen">
      <nav className="vibe-site-nav" aria-label="Primary">
        <div
          className="container"
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            width: "100%",
            flexWrap: "wrap",
            gap: "12px"
          }}
        >
          <NavLink to="/" className="logo" end onClick={() => setMobileOpen(false)}>
            {brand}
          </NavLink>
          <button
            type="button"
            className="vibe-nav-toggle md:hidden"
            aria-expanded={mobileOpen}
            aria-label="Toggle menu"
            onClick={() => setMobileOpen((o) => !o)}
          >
            {mobileOpen ? "✕" : "☰"}
          </button>
          <div className="nav-links vibe-nav-desktop" aria-label="Browse sections">
            {links.map(({ to, end, labelKey }) => (
              <NavLink key={to} to={to} end={end}>
                {t(labelKey)}
              </NavLink>
            ))}
            <SiteViewToggle variant="nav" />
          </div>
        </div>
      </nav>
      {mobileOpen ? (
        <div className="vibe-mobile-nav md:hidden">
          {links.map(({ to, end, labelKey }) => (
            <NavLink key={to} to={to} end={end} onClick={() => setMobileOpen(false)}>
              {t(labelKey)}
            </NavLink>
          ))}
          <SiteViewToggle variant="nav" />
        </div>
      ) : null}
      <main id="main-content" className="vibe-outlet">
        <Outlet />
      </main>
    </div>
  );
};
