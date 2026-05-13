import React from "react";
import { usePortfolioData } from "../../../contexts/PortfolioDataContext";
import { useLanguage } from "../../../contexts/LanguageContext";
import { wrapText } from "../../../utils/wrapText";

function stripBioLine(line: string): string {
  return line.replace(/^\s*>\s*/, "").trim();
}

export const BrowseAbout: React.FC = () => {
  const { data } = usePortfolioData();
  const { t } = useLanguage();
  const motto = data.motto?.trim() || data.subtitle;

  return (
    <div className="container">
      <h2 className="section-title">{t("browse.headings.about")}</h2>
      <div className="vibe-panel vibe-panel-muted">
        <p className="vibe-meta">{t("browse.about.motto")}</p>
        <p className="vibe-lead" style={{ fontStyle: "italic" }}>
          &ldquo;{motto}&rdquo;
        </p>
      </div>
      <div className="vibe-panel">
        <p className="vibe-meta">{t("browse.about.role")}</p>
        <div className="vibe-lead space-y-2">
          {wrapText(data.title.trim(), 88).map((line, i) => (
            <p key={i}>{line}</p>
          ))}
        </div>
      </div>
      <div className="vibe-panel vibe-panel-muted">
        <p className="vibe-meta">{t("browse.about.more")}</p>
        {data.bio
          .map(stripBioLine)
          .filter(Boolean)
          .map((para, i) => (
            <div key={i} className="vibe-lead space-y-1" style={{ marginTop: i ? 12 : 0 }}>
              {wrapText(para, 88).map((line, j) => (
                <p key={j}>{line}</p>
              ))}
            </div>
          ))}
      </div>
    </div>
  );
};
