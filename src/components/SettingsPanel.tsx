import React, { useState } from "react";
import { useSettings } from "../contexts/SettingsContext";
import { useAchievements } from "../contexts/AchievementsContext";
import { useLanguage } from "../contexts/LanguageContext";
import type { Theme } from "../contexts/SettingsContext";
import { soundManager } from "../utils/soundManager";

const SettingsPanel: React.FC = () => {
  const { settings, toggleSetting, updateSetting } = useSettings();
  const { achievements, unlockedCount } = useAchievements();
  const { language, setLanguage, t } = useLanguage();
  const [isOpen, setIsOpen] = useState(false);
  const [showAchievements, setShowAchievements] = useState(false);

  const themes: { value: Theme; label: string }[] = [
    { value: "nes", label: "NES" },
    { value: "gameboy", label: "GAME BOY" },
    { value: "arcade", label: "ARCADE" }
  ];

  return (
    <>
      {/* Settings Toggle Button */}
      <button
        onClick={() => {
          setIsOpen(!isOpen);
          soundManager.click();
        }}
        className="fixed bottom-4 right-4 z-50 pixel-border bg-card p-3 text-primary hover:bg-card/80 transition-transform hover:scale-110"
        aria-label="Toggle settings panel"
        aria-expanded={isOpen}
      >
        <span className="font-pixel text-xs">⚙</span>
      </button>

      {/* Settings Panel */}
      {isOpen && (
        <div
          className="fixed bottom-16 right-4 z-50 pixel-border bg-card p-4 md:p-6 box-glow w-64 md:w-80 max-h-[80vh] overflow-y-auto"
          role="dialog"
          aria-modal="true"
          aria-labelledby="settings-title"
        >
          <div className="flex items-center justify-between mb-4">
            <h2 id="settings-title" className="font-pixel text-xs md:text-sm text-primary">
              SETTINGS
            </h2>
            <button
              onClick={() => setIsOpen(false)}
              className="text-primary hover:text-secondary font-pixel text-xs"
              aria-label="Close settings"
            >
              ✕
            </button>
          </div>

          <div className="space-y-4 text-xs">
            {/* Scanlines Toggle */}
            <div className="flex items-center justify-between">
              <label htmlFor="scanlines" className="font-pixel text-[10px] md:text-xs">
                CRT SCANLINES
              </label>
              <button
                id="scanlines"
                onClick={() => toggleSetting("scanlinesEnabled")}
                className={`pixel-border px-3 py-1 font-pixel text-[9px] min-h-[32px] ${
                  settings.scanlinesEnabled
                    ? "bg-primary text-bg"
                    : "bg-bg text-muted"
                }`}
                aria-pressed={settings.scanlinesEnabled}
              >
                {settings.scanlinesEnabled ? "ON" : "OFF"}
              </button>
            </div>

            {/* Sound Toggle */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label htmlFor="sound" className="font-pixel text-[10px] md:text-xs">
                  {t("settings.sound")}
                </label>
                <button
                  id="sound"
                  onClick={() => {
                    toggleSetting("soundEnabled");
                    if (!settings.soundEnabled) soundManager.click();
                  }}
                  className={`pixel-border px-3 py-1 font-pixel text-[9px] min-h-[32px] ${
                    settings.soundEnabled
                      ? "bg-primary text-bg"
                      : "bg-bg text-muted"
                  }`}
                  aria-pressed={settings.soundEnabled}
                >
                  {settings.soundEnabled ? "ON" : "OFF"}
                </button>
              </div>
              {settings.soundEnabled && (
                <div className="space-y-1">
                  <label htmlFor="volume" className="font-pixel text-[9px] text-muted">
                    {t("settings.volume")}: {Math.round(settings.soundVolume * 100)}%
                  </label>
                  <input
                    id="volume"
                    type="range"
                    min="0"
                    max="100"
                    value={settings.soundVolume * 100}
                    onChange={(e) => {
                      const vol = parseInt(e.target.value) / 100;
                      updateSetting("soundVolume", vol);
                      soundManager.setVolume(vol);
                      soundManager.click();
                    }}
                    className="w-full"
                  />
                </div>
              )}
            </div>

            {/* High Contrast Toggle */}
            <div className="flex items-center justify-between">
              <label htmlFor="contrast" className="font-pixel text-[10px] md:text-xs">
                HIGH CONTRAST
              </label>
              <button
                id="contrast"
                onClick={() => toggleSetting("highContrast")}
                className={`pixel-border px-3 py-1 font-pixel text-[9px] min-h-[32px] ${
                  settings.highContrast
                    ? "bg-primary text-bg"
                    : "bg-bg text-muted"
                }`}
                aria-pressed={settings.highContrast}
              >
                {settings.highContrast ? "ON" : "OFF"}
              </button>
            </div>

            {/* Language Selector */}
            <div className="space-y-2">
              <label className="font-pixel text-[10px] md:text-xs block">
                {t("settings.language")}
              </label>
              <div className="flex flex-wrap gap-2">
                {(["en", "es", "ja"] as const).map((lang) => (
                  <button
                    key={lang}
                    onClick={() => {
                      setLanguage(lang);
                      soundManager.click();
                    }}
                    className={`pixel-border px-2 py-1 font-pixel text-[9px] min-h-[32px] ${
                      language === lang
                        ? "bg-primary text-bg"
                        : "bg-bg text-muted"
                    }`}
                    aria-pressed={language === lang}
                  >
                    {lang.toUpperCase()}
                  </button>
                ))}
              </div>
            </div>

            {/* Theme Selector */}
            <div className="space-y-2">
              <label className="font-pixel text-[10px] md:text-xs block">
                THEME
              </label>
              <div className="flex flex-wrap gap-2">
                {themes.map((theme) => (
                  <button
                    key={theme.value}
                    onClick={() => {
                      updateSetting("theme", theme.value);
                      soundManager.click();
                    }}
                    className={`pixel-border px-2 py-1 font-pixel text-[9px] min-h-[32px] ${
                      settings.theme === theme.value
                        ? "bg-primary text-bg"
                        : "bg-bg text-muted"
                    }`}
                    aria-pressed={settings.theme === theme.value}
                  >
                    {theme.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Achievements Section */}
            <div className="space-y-2 border-t border-muted pt-4">
              <div className="flex items-center justify-between mb-2">
                <label className="font-pixel text-[10px] md:text-xs">
                  {t("achievements.title")}
                </label>
                <button
                  onClick={() => {
                    setShowAchievements(!showAchievements);
                    soundManager.click();
                  }}
                  className="pixel-border px-2 py-1 font-pixel text-[9px] bg-bg text-muted"
                >
                  {showAchievements ? "HIDE" : "SHOW"} ({unlockedCount}/{achievements.length})
                </button>
              </div>
              {showAchievements && (
                <div className="space-y-2 max-h-48 overflow-y-auto">
                  {achievements.map((ach) => (
                    <div
                      key={ach.id}
                      className={`pixel-border p-2 text-[9px] ${
                        ach.unlocked ? "bg-card/50" : "bg-bg/30 opacity-50"
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        <span>{ach.icon}</span>
                        <div className="flex-1">
                          <p className="font-pixel text-[10px]">
                            {ach.unlocked ? t("achievements.unlocked") : t("achievements.locked")}:{" "}
                            {ach.title}
                          </p>
                          <p className="text-[8px] text-muted">{ach.description}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}

    </>
  );
};

export default SettingsPanel;

