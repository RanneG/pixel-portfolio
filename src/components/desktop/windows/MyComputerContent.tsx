import React from "react";
import { usePortfolioData } from "../../../contexts/PortfolioDataContext";
import { useLanguage } from "../../../contexts/LanguageContext";

export const MyComputerContent: React.FC = () => {
  const { data } = usePortfolioData();
  const { t } = useLanguage();

  return (
    <div style={{ lineHeight: 1.55 }}>
      <p style={{ marginTop: 0 }}>
        <strong>{t("desktop.myComputer.system")}</strong>
      </p>
      <ul style={{ margin: 0, paddingLeft: 20 }}>
        <li>
          {t("desktop.myComputer.user")}: {data.name}
        </li>
        <li>
          {t("desktop.myComputer.os")}: RG-Portfolio 98 SE
        </li>
        <li>
          {t("desktop.myComputer.cpu")}: TypeScript @ 5.x
        </li>
        <li>
          {t("desktop.myComputer.ram")}: 640K (should be enough)
        </li>
        <li>
          {t("desktop.myComputer.drive")}: C:\Users\{data.name.split(" ")[0]}\Projects
        </li>
      </ul>
      <p style={{ marginTop: 16, fontSize: 10, color: "#666" }}>{t("desktop.myComputer.note")}</p>
    </div>
  );
};
