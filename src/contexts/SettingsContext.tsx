import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";

export type Theme = "nes" | "gameboy" | "arcade";

interface Settings {
  scanlinesEnabled: boolean;
  soundEnabled: boolean;
  highContrast: boolean;
  theme: Theme;
}

interface SettingsContextType {
  settings: Settings;
  updateSetting: <K extends keyof Settings>(key: K, value: Settings[K]) => void;
  toggleSetting: (key: keyof Pick<Settings, "scanlinesEnabled" | "soundEnabled" | "highContrast">) => void;
}

const defaultSettings: Settings = {
  scanlinesEnabled: true,
  soundEnabled: false,
  highContrast: false,
  theme: "nes"
};

const SettingsContext = createContext<SettingsContextType | undefined>(undefined);

export const SettingsProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [settings, setSettings] = useState<Settings>(() => {
    // Load from localStorage
    const saved = localStorage.getItem("portfolio-settings");
    if (saved) {
      try {
        return { ...defaultSettings, ...JSON.parse(saved) };
      } catch {
        return defaultSettings;
      }
    }
    return defaultSettings;
  });

  useEffect(() => {
    // Save to localStorage
    localStorage.setItem("portfolio-settings", JSON.stringify(settings));
    
    // Apply theme class
    document.documentElement.setAttribute("data-theme", settings.theme);
    
    // Apply high contrast
    if (settings.highContrast) {
      document.documentElement.classList.add("high-contrast");
    } else {
      document.documentElement.classList.remove("high-contrast");
    }
  }, [settings]);

  const updateSetting = <K extends keyof Settings>(key: K, value: Settings[K]) => {
    setSettings((prev) => ({ ...prev, [key]: value }));
  };

  const toggleSetting = (key: keyof Pick<Settings, "scanlinesEnabled" | "soundEnabled" | "highContrast">) => {
    setSettings((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  return (
    <SettingsContext.Provider value={{ settings, updateSetting, toggleSetting }}>
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

