import React, { useMemo } from "react";
import { Link } from "react-router-dom";
import { usePortfolioData } from "../../contexts/PortfolioDataContext";
import { useLanguage } from "../../contexts/LanguageContext";
import type { Project } from "../../types";

function projectHref(p: Project): string | undefined {
  return p.liveUrl || p.githubUrl;
}

function projectThumb(p: Project): React.ReactNode {
  if (p.imageUrl) {
    return (
      <img
        src={p.imageUrl}
        alt=""
        width={800}
        height={450}
        loading="lazy"
        style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }}
      />
    );
  }
  return (
    <div
      style={{
        width: "100%",
        height: "100%",
        background: "linear-gradient(135deg, #05668d 0%, #028090 45%, #00a896 100%)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontFamily: '"Archivo Black", sans-serif',
        fontSize: "2rem",
        color: "rgba(255,255,255,0.35)"
      }}
      aria-hidden
    >
      {(p.title || "?").slice(0, 2)}
    </div>
  );
}

export const FeaturedProjects: React.FC = () => {
  const { data } = usePortfolioData();
  const { t } = useLanguage();

  const featured = useMemo(
    () => (data.projects ?? []).filter((p) => p.featured),
    [data.projects]
  );

  if (featured.length === 0) return null;

  return (
    <section className="featured-projects" aria-labelledby="featured-projects-heading">
      <div className="featured-projects-header">
        <h2 id="featured-projects-heading">{t("browse.vibe.featuredTitle")}</h2>
        <Link to="/projects" className="featured-projects-all">
          {t("browse.vibe.featuredViewAll")} →
        </Link>
      </div>
      <div className="featured-projects-grid">
        {featured.map((p) => {
          const href = projectHref(p);
          const tags = (p.tech ?? []).slice(0, 2);
          return (
            <article key={p.questId ?? p.title} className="featured-project-card">
              <div className="featured-project-img">{projectThumb(p)}</div>
              <div className="featured-project-body">
                <div className="project-tags">
                  {tags.map((tag) => (
                    <span key={tag} className="tag">
                      {tag}
                    </span>
                  ))}
                  <span className="tag">{p.status}</span>
                </div>
                <h3>{p.title}</h3>
                {p.highlight ? <p className="featured-project-highlight">{p.highlight}</p> : null}
                <p className="featured-project-desc">{p.description}</p>
                {href ? (
                  <a className="project-link" href={href} target="_blank" rel="noopener noreferrer">
                    EXPLORE →
                  </a>
                ) : null}
              </div>
            </article>
          );
        })}
      </div>
    </section>
  );
};
