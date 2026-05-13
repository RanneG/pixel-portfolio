import React from "react";
import { usePortfolioData } from "../../../contexts/PortfolioDataContext";
import { useLanguage } from "../../../contexts/LanguageContext";
import { wrapText } from "../../../utils/wrapText";
import type { WorkExperienceEntry } from "../../../types";

function EntryCard({ e }: { e: WorkExperienceEntry }) {
  const span = `${e.start}–${e.end}`;
  return (
    <article className="vibe-panel vibe-panel-muted">
      <p className="vibe-meta">{span}</p>
      <h3 style={{ marginBottom: 8 }}>{e.role}</h3>
      <p style={{ fontWeight: 700, marginBottom: 12 }}>{e.company}</p>
      {e.url ? (
        <p style={{ marginBottom: 12 }}>
          <a href={e.url} target="_blank" rel="noopener noreferrer" style={{ color: "inherit" }}>
            {e.url}
          </a>
        </p>
      ) : null}
      {e.paragraphs?.length ? (
        <div className="vibe-lead space-y-3">
          {e.paragraphs.map((para, i) => (
            <div key={i} className="space-y-1">
              {wrapText(para, 88).map((line, j) => (
                <p key={j}>{line}</p>
              ))}
            </div>
          ))}
        </div>
      ) : e.bullets?.length ? (
        <ul className="vibe-lead" style={{ paddingLeft: "1.25rem" }}>
          {e.bullets.map((b, i) => (
            <li key={i} style={{ marginBottom: 6 }}>
              {b}
            </li>
          ))}
        </ul>
      ) : null}
    </article>
  );
}

export const BrowseExperience: React.FC = () => {
  const { data } = usePortfolioData();
  const { t } = useLanguage();
  const entries = data.workExperience ?? [];

  return (
    <div className="container">
      <h2 className="section-title">{t("browse.headings.experience")}</h2>
      {entries.length === 0 ? (
        <p className="vibe-lead" style={{ padding: "24px 0" }}>
          {t("browse.experience.empty")}
        </p>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
          {entries.map((e, i) => (
            <EntryCard key={`${e.company}-${e.start}-${i}`} e={e} />
          ))}
        </div>
      )}
    </div>
  );
};
