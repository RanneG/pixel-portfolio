import React, { useMemo } from "react";
import { usePortfolioData } from "../../../contexts/PortfolioDataContext";
import { useLanguage } from "../../../contexts/LanguageContext";
import type { Project } from "../../../types";

type Props = {
  onOpenPortfolio: () => void;
  onOpenContact: () => void;
};

function socialUrl(
  links: { name: string; url: string }[],
  needle: string,
  fallback: string
): string {
  const hit = links.find((l) => l.name.toUpperCase() === needle);
  return hit?.url ?? fallback;
}

function projectHref(p: Project): string | undefined {
  return p.liveUrl || p.githubUrl;
}

export const HomeWindowContent: React.FC<Props> = ({ onOpenPortfolio, onOpenContact }) => {
  const { data } = usePortfolioData();
  const { t } = useLanguage();

  const featured = useMemo(
    () => (data.projects ?? []).filter((p) => p.featured).slice(0, 3),
    [data.projects]
  );

  const gh = socialUrl(data.socialLinks, "GITHUB", "https://github.com/RanneG");
  const li = socialUrl(
    data.socialLinks,
    "LINKEDIN",
    "https://www.linkedin.com/in/ranne-gerodias-809460108/"
  );

  const shortBio = data.title.length > 220 ? `${data.title.slice(0, 217)}…` : data.title;

  return (
    <>
      <div className="win98-home-nav">
        <button type="button" className="win98-btn" onClick={onOpenPortfolio}>
          {t("desktop.windows.portfolio")}
        </button>
        <button type="button" className="win98-btn" onClick={onOpenContact}>
          {t("desktop.windows.contact")}
        </button>
        <a className="win98-btn" href={gh} target="_blank" rel="noopener noreferrer" style={{ textDecoration: "none", display: "inline-block" }}>
          GitHub
        </a>
      </div>

      <div className="win98-home-banner">
        {t("desktop.home.banner")} — {data.contact.email}
      </div>

      <div className="win98-home-profile">
        <img
          className="win98-home-photo"
          src="/images/browse-hero.png"
          alt=""
          width={96}
          height={96}
        />
        <div>
          <p className="win98-home-role">{data.subtitle}</p>
          <h2 className="win98-home-name">{data.name}</h2>
          <p className="win98-home-bio">{shortBio}</p>
          <div className="win98-home-links">
            {data.availableForHire ? (
              <a href={`mailto:${data.contact.email}`}>{t("desktop.home.available")}</a>
            ) : null}
            <a href={gh} target="_blank" rel="noopener noreferrer">
              GitHub
            </a>
            <a href={li} target="_blank" rel="noopener noreferrer">
              LinkedIn
            </a>
          </div>
        </div>
      </div>

      <h3 className="win98-section-title">{t("desktop.home.myWork")}</h3>
      <div className="win98-project-grid">
        {featured.map((p) => {
          const href = projectHref(p);
          return (
            <article key={p.questId ?? p.title} className="win98-project-card">
              {p.imageUrl ? (
                <img src={p.imageUrl} alt="" width={200} height={100} loading="lazy" />
              ) : (
                <div
                  style={{
                    height: 100,
                    background: "linear-gradient(135deg, #05668d, #00a896)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    color: "#fff",
                    fontWeight: "bold"
                  }}
                >
                  {(p.title || "?").slice(0, 2)}
                </div>
              )}
              <div className="win98-project-card-body">
                <h4>{p.title}</h4>
                <p>{p.highlight || p.description}</p>
                {href ? (
                  <a href={href} target="_blank" rel="noopener noreferrer">
                    {t("desktop.home.seeProject")} →
                  </a>
                ) : null}
              </div>
            </article>
          );
        })}
      </div>
    </>
  );
};
