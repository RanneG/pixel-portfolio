import React from "react";
import type { SkillCategoryProps } from "../../types";
import { useLanguage } from "../../contexts/LanguageContext";

function stripLead(line: string): string {
  return line.replace(/^\s*>\s*/, "").trim();
}

type Props = {
  categories: SkillCategoryProps[];
  specialAbilities: string[];
};

export const BrowseSkillsContent: React.FC<Props> = ({ categories, specialAbilities }) => {
  const { t } = useLanguage();

  return (
    <>
      <div className="vibe-skills-grid">
        {categories.map((cat, i) => (
          <article
            key={cat.title}
            className={`vibe-panel ${i % 2 === 1 ? "vibe-panel-muted" : ""}`}
          >
            <h3 className="vibe-skills-category-title">{cat.title}</h3>
            <p className="vibe-skills-count">
              {cat.skills.length} {t("browse.skills.itemsSuffix")}
            </p>
            <ul className="vibe-skill-list">
              {cat.skills.map((s) => (
                <li key={s.name}>{s.name}</li>
              ))}
            </ul>
          </article>
        ))}
      </div>

      {specialAbilities.length > 0 ? (
        <div className="vibe-panel vibe-panel-muted" style={{ marginTop: 24 }}>
          <h3 className="vibe-skills-category-title">{t("browse.skills.highlights")}</h3>
          <ul className="vibe-skill-list vibe-skill-list--tight">
            {specialAbilities.map(stripLead).filter(Boolean).map((line, idx) => (
              <li key={idx}>{line}</li>
            ))}
          </ul>
        </div>
      ) : null}
    </>
  );
};
