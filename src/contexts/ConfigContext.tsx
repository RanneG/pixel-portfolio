import React, { createContext, useContext, ReactNode } from "react";
import { usePortfolioData } from "./PortfolioDataContext";
import type { SiteConfig } from "../types";

interface ConfigContextType {
  config: SiteConfig;
}

const ConfigContext = createContext<ConfigContextType | undefined>(undefined);

export const ConfigProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const { config } = usePortfolioData();

  return (
    <ConfigContext.Provider value={{ config }}>
      {children}
    </ConfigContext.Provider>
  );
};

export const useConfig = () => {
  const context = useContext(ConfigContext);
  if (!context) {
    throw new Error("useConfig must be used within ConfigProvider");
  }
  return context;
};

