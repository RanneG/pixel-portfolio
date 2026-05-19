import React, { useMemo, useState } from "react";
import { useSettings } from "../contexts/SettingsContext";
import { useSiteViewSwitch } from "../hooks/useSiteViewSwitch";
import { useLanguage } from "../contexts/LanguageContext";
import { usePortfolioData } from "../contexts/PortfolioDataContext";
import { ActionFanDock } from "./ActionFanDock";

function socialUrl(
  links: { name: string; url: string }[],
  needle: string,
  fallback: string
): string {
  const hit = links.find((l) => l.name.toUpperCase() === needle);
  return hit?.url ?? fallback;
}

const SettingsPanel: React.FC = () => {
  const { settings } = useSettings();
  const { siteView, switchTo } = useSiteViewSwitch();
  const { language, setLanguage, t } = useLanguage();
  const { data } = usePortfolioData();
  const [isOpen, setIsOpen] = useState(false);

  const githubUrl = useMemo(
    () => socialUrl(data.socialLinks, "GITHUB", "https://github.com/RanneG"),
    [data.socialLinks]
  );
  const linkedinUrl = useMemo(
    () =>
      socialUrl(
        data.socialLinks,
        "LINKEDIN",
        "https://www.linkedin.com/in/ranne-gerodias-809460108/"
      ),
    [data.socialLinks]
  );

  return (
    <>
      <ActionFanDock
        githubUrl={githubUrl}
        linkedinUrl={linkedinUrl}
        settingsOpen={isOpen}
        onSettingsClick={() => setIsOpen((o) => !o)}
      />

      {isOpen && (
        <div
          className="vibe-settings-sheet fixed bottom-16 right-4 z-50 w-72 max-w-[calc(100vw-2rem)] max-h-[80vh] overflow-y-auto p-4 md:p-5"
          role="dialog"
          aria-modal="true"
          aria-labelledby="settings-title"
        >
          <div className="flex items-start justify-between gap-2 mb-4">
            <h2 id="settings-title">{t("settings.title")}</h2>
            <button
              type="button"
              onClick={() => setIsOpen(false)}
              className="vibe-settings-close"
              aria-label="Close settings"
            >
              ✕
            </button>
          </div>

          <div className="space-y-5 text-xs">
            <div className="space-y-2 pb-4 vibe-settings-divider">
              <p className="vibe-settings-section-title">{t("settings.browseTitle")}</p>
              <p className="vibe-settings-muted">{t("settings.browseHint")}</p>
              <div className="flex flex-wrap gap-2">
                <button
                  type="button"
                  onClick={() => switchTo("terminal")}
                  className="vibe-settings-btn"
                  aria-pressed={siteView === "terminal"}
                >
                  {t("settings.viewTerminal")}
                </button>
                <button
                  type="button"
                  onClick={() => switchTo("browse")}
                  className="vibe-settings-btn"
                  aria-pressed={siteView === "browse"}
                >
                  {t("settings.viewBrowse")}
                </button>
              </div>
            </div>

            <div className="space-y-2">
              <label className="vibe-settings-section-title block">{t("settings.language")}</label>
              <div className="flex flex-wrap gap-2">
                {(["en", "es", "ja"] as const).map((lang) => (
                  <button
                    key={lang}
                    type="button"
                    onClick={() => setLanguage(lang)}
                    className="vibe-settings-btn"
                    aria-pressed={language === lang}
                  >
                    {lang.toUpperCase()}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default SettingsPanel;
