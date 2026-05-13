import React from "react";
import { usePortfolioData } from "../../../contexts/PortfolioDataContext";
import { useLanguage } from "../../../contexts/LanguageContext";
import SavePoint from "../../SavePoint";

export const BrowseContact: React.FC = () => {
  const { data, config } = usePortfolioData();
  const { t } = useLanguage();

  return (
    <div className="container">
      <h2 className="section-title" style={{ borderTop: "4px solid var(--black)" }}>
        {t("browse.headings.contact")}
      </h2>
      <SavePoint
        contactInfo={data.contact}
        socialLinks={data.socialLinks}
        availableForHire={data.availableForHire}
        formspreeId={config.site.formspreeId || undefined}
        variant="brutalist"
      />
    </div>
  );
};
