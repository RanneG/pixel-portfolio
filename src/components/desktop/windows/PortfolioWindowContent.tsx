import React from "react";
import { usePortfolioData } from "../../../contexts/PortfolioDataContext";
import { useLanguage } from "../../../contexts/LanguageContext";
import type { Project } from "../../../types";

function projectHref(p: Project): string | undefined {
  return p.liveUrl || p.githubUrl;
}

export const PortfolioWindowContent: React.FC = () => {
  const { data } = usePortfolioData();
  const { t } = useLanguage();
  const projects = data.projects ?? [];

  return (
    <ul className="win98-portfolio-list">
      {projects.map((p) => {
        const href = projectHref(p);
        return (
          <li key={p.questId ?? p.title} className="win98-portfolio-item">
            {p.imageUrl ? (
              <img className="win98-portfolio-thumb" src={p.imageUrl} alt="" width={48} height={48} />
            ) : (
              <div
                className="win98-portfolio-thumb"
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  background: "#028090",
                  color: "#fff",
                  fontSize: 10,
                  fontWeight: "bold"
                }}
              >
                {(p.title || "?").slice(0, 2)}
              </div>
            )}
            <div style={{ flex: 1, minWidth: 0 }}>
              <strong>{p.title}</strong>
              <span style={{ marginLeft: 8, color: "#666", fontSize: 10 }}>{p.status}</span>
              <p style={{ margin: "4px 0 0", fontSize: 10, lineHeight: 1.4 }}>{p.description}</p>
              {href ? (
                <a href={href} target="_blank" rel="noopener noreferrer" style={{ fontSize: 10 }}>
                  {t("desktop.home.seeProject")} →
                </a>
              ) : null}
            </div>
          </li>
        );
      })}
    </ul>
  );
};
