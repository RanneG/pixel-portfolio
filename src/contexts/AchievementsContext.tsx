import React, { createContext, useContext, useState, useEffect, useCallback } from "react";
import { ACHIEVEMENTS, type Achievement } from "../types/achievements";

interface AchievementsContextType {
  achievements: Achievement[];
  unlockedCount: number;
  unlockAchievement: (id: string) => void;
  checkAchievement: (id: string) => boolean;
  resetAchievements: () => void;
}

const AchievementsContext = createContext<AchievementsContextType | undefined>(undefined);

const STORAGE_KEY = "portfolio-achievements";

function readAchievementsFromStorage(): Achievement[] {
  if (typeof window === "undefined") {
    return ACHIEVEMENTS;
  }
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return ACHIEVEMENTS;
    const parsed = JSON.parse(raw) as Achievement[];
    if (!Array.isArray(parsed)) return ACHIEVEMENTS;
    return ACHIEVEMENTS.map((ach) => {
      const stored = parsed.find((s: Achievement) => s.id === ach.id);
      return stored ? { ...ach, ...stored } : ach;
    });
  } catch {
    return ACHIEVEMENTS;
  }
}

export const AchievementsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Hydrate from localStorage synchronously so the first save effect never overwrites with defaults.
  const [achievements, setAchievements] = useState<Achievement[]>(readAchievementsFromStorage);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(achievements));
    } catch {
      // Quota or private mode
    }
  }, [achievements]);

  const unlockAchievement = useCallback((id: string) => {
    setAchievements((prev) =>
      prev.map((ach) =>
        ach.id === id && !ach.unlocked
          ? { ...ach, unlocked: true, unlockedAt: Date.now() }
          : ach
      )
    );
  }, []);

  const checkAchievement = useCallback(
    (id: string) => {
      return achievements.find((a) => a.id === id)?.unlocked || false;
    },
    [achievements]
  );

  const resetAchievements = useCallback(() => {
    setAchievements(ACHIEVEMENTS.map((a) => ({ ...a, unlocked: false, unlockedAt: undefined })));
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch {
      /* ignore */
    }
  }, []);

  const unlockedCount = achievements.filter((a) => a.unlocked).length;

  return (
    <AchievementsContext.Provider
      value={{
        achievements,
        unlockedCount,
        unlockAchievement,
        checkAchievement,
        resetAchievements
      }}
    >
      {children}
    </AchievementsContext.Provider>
  );
};

export const useAchievements = () => {
  const context = useContext(AchievementsContext);
  if (!context) {
    throw new Error("useAchievements must be used within AchievementsProvider");
  }
  return context;
};
