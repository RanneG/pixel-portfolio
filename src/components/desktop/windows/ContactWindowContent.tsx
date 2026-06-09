import React from "react";
import { usePortfolioData } from "../../../contexts/PortfolioDataContext";
import { useLanguage } from "../../../contexts/LanguageContext";

export const ContactWindowContent: React.FC = () => {
  const { data } = usePortfolioData();
  const { t } = useLanguage();

  return (
    <div style={{ lineHeight: 1.6 }}>
      <p style={{ marginTop: 0 }}>
        <strong>{t("desktop.contact.email")}:</strong>{" "}
        <a href={`mailto:${data.contact.email}`}>{data.contact.email}</a>
      </p>
      <p>
        <strong>{t("desktop.contact.location")}:</strong> {data.contact.location}
      </p>
      <p>
        <strong>{t("desktop.contact.timezone")}:</strong> {data.contact.timezone}
      </p>
      <p style={{ marginTop: 16 }}>{data.bio[0]}</p>
      <p>{data.bio[1]}</p>
      <div style={{ marginTop: 16, display: "flex", gap: 8, flexWrap: "wrap" }}>
        {data.socialLinks.map((link) => (
          <a
            key={link.name}
            className="win98-btn"
            href={link.url}
            target="_blank"
            rel="noopener noreferrer"
            style={{ textDecoration: "none" }}
          >
            {link.name}
          </a>
        ))}
      </div>
    </div>
  );
};
