import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";

export type SiteView = "terminal" | "browse";

export interface Settings {
  siteView: SiteView;
}

interface SettingsContextType {
  settings: Settings;
  updateSetting: <K extends keyof Settings>(key: K, value: Settings[K]) => void;
}

const defaultSettings: Settings = {
  siteView: "terminal"
};

const SettingsContext = createContext<SettingsContextType | undefined>(undefined);

export const SettingsProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [settings, setSettings] = useState<Settings>(() => {
    const saved = localStorage.getItem("portfolio-settings");
    if (saved) {
      try {
        const parsed = JSON.parse(saved) as Record<string, unknown>;
        const siteView: SiteView =
          parsed.siteView === "browse" || parsed.siteView === "terminal"
            ? parsed.siteView
            : "terminal";
        return { siteView };
      } catch {
        return defaultSettings;
      }
    }
    return defaultSettings;
  });

  useEffect(() => {
    localStorage.setItem("portfolio-settings", JSON.stringify(settings));
  }, [settings]);

  const updateSetting = <K extends keyof Settings>(key: K, value: Settings[K]) => {
    setSettings((prev) => ({ ...prev, [key]: value }));
  };

  return (
    <SettingsContext.Provider value={{ settings, updateSetting }}>
      {children}
    </SettingsContext.Provider>
  );
};

export const useSettings = () => {
  const context = useContext(SettingsContext);
  if (!context) {
    throw new Error("useSettings must be used within SettingsProvider");
  }
  return context;
};
