import React, { useLayoutEffect, useMemo } from "react";
import { usePortfolioData } from "../../../contexts/PortfolioDataContext";
import { useLanguage } from "../../../contexts/LanguageContext";
import type { Project } from "../../../types";
import { ProjectsPersonaChat } from "../ProjectsPersonaChat";

function projectLink(p: Project): string | undefined {
  return p.liveUrl || p.githubUrl;
}

function projectYear(p: Project): string {
  const m = /\b(20\d{2})\b/.exec(`${p.description} ${p.motivation ?? ""}`);
  return m ? m[1] : "—";
}

export const BrowseProjects: React.FC = () => {
  const { data } = usePortfolioData();
  const { t } = useLanguage();
  const projects = useMemo(() => data.projects ?? [], [data.projects]);

  useLayoutEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div>
      <h2 className="section-title">{t("browse.headings.projects")}</h2>
      <section className="projects" aria-label={t("browse.headings.projects")}>
        {projects.map((p) => {
          const href = projectLink(p);
          const tags = (p.tech ?? []).slice(0, 2);
          const isChatbotRagCore = p.questId === "CB-001";
          return (
            <article key={p.questId ?? p.title} className="project-card">
              <div className="project-img" aria-hidden>
                {p.imageUrl ? (
                  <img
                    src={p.imageUrl}
                    alt=""
                    width={800}
                    height={450}
                    loading="lazy"
                    style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }}
                  />
                ) : (
                  <div
                    style={{
                      width: "100%",
                      height: "100%",
                      background: `linear-gradient(135deg, #05668d 0%, #028090 45%, #00a896 100%)`,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontFamily: '"Archivo Black", sans-serif',
                      fontSize: "2rem",
                      color: "rgba(255,255,255,0.25)"
                    }}
                  >
                    {(p.title || "?").slice(0, 2)}
                  </div>
                )}
              </div>
              <div className="project-tags">
                {tags.map((tag) => (
                  <span key={tag} className="tag">
                    {tag}
                  </span>
                ))}
                <span className="tag">{projectYear(p)}</span>
              </div>
              <h3>{p.title}</h3>
              {p.award ? (
                <p className="vibe-project-award" role="status" aria-label={`Award: ${p.award}`}>
                  <span aria-hidden>🏆 </span>
                  {p.award}
                </p>
              ) : null}
              <p>{p.description}</p>
              {isChatbotRagCore ? <ProjectsPersonaChat /> : null}
              {href ? (
                <a className="project-link" href={href} target="_blank" rel="noopener noreferrer">
                  EXPLORE →
                </a>
              ) : (
                <span className="project-link" style={{ opacity: 0.6 }}>
                  EXPLORE →
                </span>
              )}
            </article>
          );
        })}
      </section>
    </div>
  );
};
