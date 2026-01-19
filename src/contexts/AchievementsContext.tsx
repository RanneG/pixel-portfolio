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

export const AchievementsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [achievements, setAchievements] = useState<Achievement[]>(ACHIEVEMENTS);

  // Load achievements from localStorage
  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const storedAchievements = JSON.parse(stored);
        setAchievements((prev) =>
          prev.map((ach) => {
            const stored = storedAchievements.find((s: Achievement) => s.id === ach.id);
            return stored ? { ...ach, ...stored } : ach;
          })
        );
      }
    } catch {
      // Invalid storage, use defaults
    }
  }, []);

  // Save achievements to localStorage
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(achievements));
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
    localStorage.removeItem(STORAGE_KEY);
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

