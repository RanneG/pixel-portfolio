import React, { createContext, useContext, ReactNode } from "react";
import type { PortfolioData } from "../types";

const defaultData: PortfolioData = {
  name: "RANNE GERODIAS",
  title: "Tech Professional crafting retro-futuristic interfaces and playful experiences.",
  subtitle: "DEVELOPER // DESIGNER // CREATOR",
  bio: [
    "> Loves combining design, code, and nostalgia.",
    "> Specializes in TypeScript, React, and delightful details.",
    "> Currently grinding XP in UI engineering and motion design."
  ],
  statusBadges: ["CAFFEINATED", "MOTIVATED", "CREATIVE"],
  stats: {
    projects: 3,
    level: "DEV 28",
    creativity: "MAX"
  },
  attributes: {
    STR: 70,
    DEX: 84,
    INT: 92,
    CHA: 78
  },
  experience: {
    current: 13420,
    max: 20000
  },
  skills: [
    {
      title: "FRONTEND",
      color: "primary",
      mastery: 88,
      skills: [
        { name: "REACT / NEXT", level: 90 },
        { name: "TYPESCRIPT", level: 87 },
        { name: "TAILWIND CSS", level: 92 }
      ]
    },
    {
      title: "BACKEND",
      color: "secondary",
      mastery: 72,
      skills: [
        { name: "NODE / EXPRESS", level: 70 },
        { name: "REST / GRAPHQL", level: 68 },
        { name: "DATABASES", level: 65 }
      ]
    },
    {
      title: "DESIGN",
      color: "accent",
      mastery: 83,
      skills: [
        { name: "UI / UX", level: 85 },
        { name: "PROTOTYPING", level: 80 },
        { name: "MOTION", level: 78 }
      ]
    },
    {
      title: "OTHER",
      color: "primary",
      mastery: 76,
      skills: [
        { name: "GIT / DEVOPS", level: 72 },
        { name: "WRITING / DOCS", level: 82 },
        { name: "GAME JAMS", level: 74 }
      ]
    }
  ],
  projects: [
    {
      title: "MINESENTRY",
      difficulty: "EPIC",
      status: "COMPLETED",
      description: "Bitcoin censorship detection platform - whistle-blowing system for detecting when mining pools exclude transactions from blocks.",
      xp: 2400,
      stars: 5,
      tech: ["REACT", "TYPESCRIPT", "TAILWIND CSS", "PYTHON", "FASTAPI", "BITCOIN RPC"],
      githubUrl: "https://github.com/RanneG/MineSentry",
      liveUrl: "https://minesentry.vercel.app/",
      questId: "MS-001"
    },
    {
      title: "ARBIT",
      difficulty: "LEGENDARY",
      status: "COMPLETED",
      description: "Cryptocurrency arbitrage opportunity dashboard with real-time market data visualization.",
      xp: 2800,
      stars: 5,
      tech: ["REACT", "API INTEGRATION", "DATA VISUALIZATION", "FINANCIAL ALGORITHMS"],
      githubUrl: "https://github.com/RanneG/Arbit",
      liveUrl: "https://arbit-psi.vercel.app",
      questId: "AR-001"
    },
    {
      title: "PIXEL PORTFOLIO",
      difficulty: "LEGENDARY",
      status: "IN PROGRESS",
      description: "8-bit themed interactive portfolio website with game mechanics and retro aesthetics.",
      xp: 3200,
      stars: 5,
      tech: ["REACT", "TYPESCRIPT", "TAILWIND CSS", "FORMSPREE", "VERCEL"],
      questId: "PP-001"
    }
  ],
  contact: {
    email: "player.one@example.dev",
    location: "NEAR A TERMINAL, SOMEWHERE ONLINE",
    timezone: "UTC+08 (MOSTLY AWAKE AT NIGHT)"
  },
  socialLinks: [
    { name: "GITHUB", url: "https://github.com/RanneG" },
    { name: "LINKEDIN", url: "https://www.linkedin.com/in/ranne-gerodias-809460108/" },
    { name: "DRIBBBLE", url: "https://dribbble.com/ranne-gerodias" }
  ],
  availableForHire: true
};

interface PortfolioDataContextType {
  data: PortfolioData;
}

const PortfolioDataContext = createContext<PortfolioDataContextType | undefined>(undefined);

export const PortfolioDataProvider: React.FC<{
  children: ReactNode;
  data?: Partial<PortfolioData>;
}> = ({ children, data }) => {
  const mergedData: PortfolioData = { ...defaultData, ...data };

  return (
    <PortfolioDataContext.Provider value={{ data: mergedData }}>
      {children}
    </PortfolioDataContext.Provider>
  );
};

export const usePortfolioData = () => {
  const context = useContext(PortfolioDataContext);
  if (!context) {
    throw new Error("usePortfolioData must be used within PortfolioDataProvider");
  }
  return context;
};

