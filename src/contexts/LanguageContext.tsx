import React, { createContext, useContext, useState, useCallback, useMemo } from "react";
import translationCatalog from "../data/translations.json";

export type Language = "en" | "es" | "ja";

interface Translations {
  [key: string]: unknown;
}

type TranslationCatalog = Record<Language, Translations>;

const CATALOG = translationCatalog as TranslationCatalog;

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
  translations: Translations;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

const STORAGE_KEY = "portfolio-language";

function readInitialLanguage(): Language {
  if (typeof window === "undefined") return "en";
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored === "en" || stored === "es" || stored === "ja") return stored;
    const browserLang = navigator.language.split("-")[0];
    if (browserLang === "es" || browserLang === "ja") return browserLang as Language;
  } catch {
    /* private mode or no localStorage */
  }
  return "en";
}

function pickTranslations(lang: Language): Translations {
  const nested = CATALOG[lang];
  if (nested && typeof nested === "object") return nested;
  return CATALOG.en;
}

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [language, setLanguageState] = useState<Language>(() => readInitialLanguage());
  const [translations, setTranslations] = useState<Translations>(() => pickTranslations(language));

  const setLanguage = useCallback((lang: Language) => {
    setLanguageState(lang);
    setTranslations(pickTranslations(lang));
    try {
      localStorage.setItem(STORAGE_KEY, lang);
    } catch {
      /* ignore */
    }
  }, []);

  const t = useCallback((key: string): string => {
    const keys = key.split(".");
    let value: unknown = translations;
    for (const k of keys) {
      if (value === null || value === undefined || typeof value !== "object") return key;
      value = (value as Record<string, unknown>)[k];
      if (value === undefined) return key;
    }
    return typeof value === "string" ? value : key;
  }, [translations]);

  const value = useMemo(
    () => ({ language, setLanguage, t, translations }),
    [language, setLanguage, t, translations]
  );

  return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>;
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error("useLanguage must be used within LanguageProvider");
  }
  return context;
};
