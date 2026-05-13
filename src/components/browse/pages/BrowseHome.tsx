import React, { useMemo } from "react";
import { Link } from "react-router-dom";
import { usePortfolioData } from "../../../contexts/PortfolioDataContext";
import { useLanguage } from "../../../contexts/LanguageContext";

function socialUrl(
  links: { name: string; url: string }[],
  needle: string,
  fallback: string
): string {
  const hit = links.find((l) => l.name.toUpperCase() === needle);
  return hit?.url ?? fallback;
}

export const BrowseHome: React.FC = () => {
  const { data } = usePortfolioData();
  const { t } = useLanguage();
  const gh = useMemo(
    () => socialUrl(data.socialLinks, "GITHUB", "https://github.com/RanneG"),
    [data.socialLinks]
  );
  const li = useMemo(
    () =>
      socialUrl(
        data.socialLinks,
        "LINKEDIN",
        "https://www.linkedin.com/in/ranne-gerodias-809460108/"
      ),
    [data.socialLinks]
  );

  const marquee = t("browse.vibe.marquee");
  const marqueeDup = `${marquee}${marquee}`;

  return (
    <>
      <section className="hero">
        <div className="hero-text">
          <p className="hero-tagline">{t("browse.vibe.heroTagline")}</p>
          <h1>{t("browse.vibe.heroHeadline")}</h1>
          <p className="vibe-lead" style={{ fontSize: "1.05rem", marginBottom: "24px" }}>
            {t("browse.vibe.heroLead")}
          </p>
          <div style={{ display: "flex", flexWrap: "wrap", gap: "12px", alignItems: "center" }}>
            <Link to="/projects" className="brutal-btn">
              {t("browse.vibe.ctaProjects")}
            </Link>
            <Link to="/about" className="brutal-btn brutal-btn-secondary">
              {t("browse.vibe.ctaAbout")}
            </Link>
          </div>
          <p style={{ marginTop: "28px", fontSize: "0.85rem", fontWeight: 700 }}>
            <a href={gh} target="_blank" rel="noopener noreferrer" style={{ color: "inherit", marginRight: "20px" }}>
              GITHUB
            </a>
            <a href={li} target="_blank" rel="noopener noreferrer" style={{ color: "inherit" }}>
              LINKEDIN
            </a>
          </p>
        </div>
        <div className="hero-image">
          <div className="blob" aria-hidden />
          <div className="vibe-hero-img-wrap">
            <img src="/images/browse-hero.png" alt={t("browse.vibe.heroAlt")} width={800} height={1000} />
          </div>
        </div>
      </section>

      <div className="marquee" aria-hidden>
        <div className="marquee-content">{marqueeDup}</div>
      </div>

      <section className="services" aria-label="Focus areas">
        <div className="service-box">
          <h3>{t("browse.vibe.servicesTitle1")}</h3>
          <p>{t("browse.vibe.servicesBody1")}</p>
        </div>
        <div className="service-box">
          <h3>{t("browse.vibe.servicesTitle2")}</h3>
          <p>{t("browse.vibe.servicesBody2")}</p>
        </div>
        <div className="service-box">
          <h3>{t("browse.vibe.servicesTitle3")}</h3>
          <p>{t("browse.vibe.servicesBody3")}</p>
        </div>
        <div className="service-box">
          <h3>{t("browse.vibe.servicesTitle4")}</h3>
          <p>{t("browse.vibe.servicesBody4")}</p>
        </div>
      </section>
    </>
  );
};
