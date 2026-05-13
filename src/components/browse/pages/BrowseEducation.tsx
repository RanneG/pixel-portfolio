import React from "react";
import { usePortfolioData } from "../../../contexts/PortfolioDataContext";
import { useLanguage } from "../../../contexts/LanguageContext";

export const BrowseEducation: React.FC = () => {
  const { data } = usePortfolioData();
  const { t } = useLanguage();
  const entries = data.education ?? [];

  return (
    <div className="container">
      <h2 className="section-title">{t("browse.headings.education")}</h2>
      {entries.length === 0 ? (
        <p className="vibe-lead" style={{ padding: "24px 0" }}>
          {t("browse.education.empty")}
        </p>
      ) : (
        <ul style={{ listStyle: "none", padding: 0, margin: 0, display: "flex", flexDirection: "column", gap: 20 }}>
          {entries.map((e, i) => {
            const span = `${e.start}–${e.end}`;
            const where = [e.institution, e.location].filter(Boolean).join(", ");
            return (
              <li key={i} className="vibe-panel vibe-panel-muted">
                <p className="vibe-meta">{span}</p>
                <h3 style={{ marginTop: 8 }}>{e.qualification}</h3>
                <p className="vibe-lead" style={{ marginTop: 8 }}>
                  {where}
                </p>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
};
