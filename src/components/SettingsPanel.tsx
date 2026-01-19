import React, { useState } from "react";
import { useSettings } from "../contexts/SettingsContext";
import type { Theme } from "../contexts/SettingsContext";

const SettingsPanel: React.FC = () => {
  const { settings, toggleSetting, updateSetting } = useSettings();
  const [isOpen, setIsOpen] = useState(false);

  const themes: { value: Theme; label: string }[] = [
    { value: "nes", label: "NES" },
    { value: "gameboy", label: "GAME BOY" },
    { value: "arcade", label: "ARCADE" }
  ];

  return (
    <>
      {/* Settings Toggle Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
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
            <div className="flex items-center justify-between">
              <label htmlFor="sound" className="font-pixel text-[10px] md:text-xs">
                SOUND EFFECTS
              </label>
              <button
                id="sound"
                onClick={() => toggleSetting("soundEnabled")}
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

            {/* Theme Selector */}
            <div className="space-y-2">
              <label className="font-pixel text-[10px] md:text-xs block">
                THEME
              </label>
              <div className="flex flex-wrap gap-2">
                {themes.map((theme) => (
                  <button
                    key={theme.value}
                    onClick={() => updateSetting("theme", theme.value)}
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
          </div>
        </div>
      )}

    </>
  );
};

export default SettingsPanel;

