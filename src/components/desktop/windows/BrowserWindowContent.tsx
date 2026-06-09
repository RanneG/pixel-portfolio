import React from "react";
import { useLanguage } from "../../../contexts/LanguageContext";

const DINO_GAME_URL = "https://wayou.github.io/t-rex-runner/";

export const BrowserWindowContent: React.FC = () => {
  const { t } = useLanguage();

  const popOut = () => {
    window.open(DINO_GAME_URL, "_blank", "noopener,noreferrer");
  };

  return (
    <div className="win98-browser">
      <div className="win98-browser-error">
        <p className="win98-browser-error-title">{t("desktop.browser.errorTitle")}</p>
        <p>{t("desktop.browser.errorBody")}</p>
        <p className="win98-browser-error-hint">{t("desktop.browser.errorHint")}</p>
      </div>
      <div className="win98-browser-frame">
        <iframe
          title={t("desktop.browser.gameTitle")}
          src={DINO_GAME_URL}
          className="win98-browser-iframe"
          loading="lazy"
          referrerPolicy="no-referrer"
        />
      </div>
      <div className="win98-browser-actions">
        <button type="button" className="win98-btn" onClick={popOut}>
          {t("desktop.browser.popOut")}
        </button>
        <span className="win98-browser-tip">{t("desktop.browser.controls")}</span>
      </div>
    </div>
  );
};
