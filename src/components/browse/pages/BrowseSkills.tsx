import React from "react";
import { usePortfolioData } from "../../../contexts/PortfolioDataContext";
import { useLanguage } from "../../../contexts/LanguageContext";
import { BrowseSkillsContent } from "../BrowseSkillsContent";

export const BrowseSkills: React.FC = () => {
  const { data } = usePortfolioData();
  const { t } = useLanguage();

  return (
    <div className="container">
      <h2 className="section-title">{t("browse.headings.skills")}</h2>
      <BrowseSkillsContent
        categories={data.skills}
        specialAbilities={data.specialAbilities ?? []}
      />
    </div>
  );
};
