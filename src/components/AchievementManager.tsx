import React, { useEffect, useState } from "react";
import { useAchievements } from "../contexts/AchievementsContext";
import { AchievementNotification } from "./AchievementNotification";
import { useAchievementTracker } from "../hooks/useAchievementTracker";
import { useSettings } from "../contexts/SettingsContext";
import { soundManager } from "../utils/soundManager";

export const AchievementManager: React.FC = () => {
  const { achievements, unlockAchievement } = useAchievements();
  const { trackScanlinesEnabled } = useAchievementTracker();
  const { settings } = useSettings();
  const [notification, setNotification] = useState<string | null>(null);

  // Check for newly unlocked achievements
  useEffect(() => {
    const newlyUnlocked = achievements.find(
      (a) => a.unlocked && a.unlockedAt && Date.now() - a.unlockedAt < 1000
    );

    if (newlyUnlocked) {
      setNotification(newlyUnlocked.id);
      soundManager.achievement();
    }
  }, [achievements]);

  // Track scanlines achievement
  useEffect(() => {
    if (settings.scanlinesEnabled) {
      trackScanlinesEnabled();
    }
  }, [settings.scanlinesEnabled, trackScanlinesEnabled]);

  const achievement = notification ? achievements.find((a) => a.id === notification) : null;

  return (
    <>
      {achievement && (
        <AchievementNotification
          achievement={achievement}
          onClose={() => setNotification(null)}
        />
      )}
    </>
  );
};

