import React, { useEffect, useState } from "react";
import { useAchievements } from "../contexts/AchievementsContext";
import { AchievementNotification } from "./AchievementNotification";
import { soundManager } from "../utils/soundManager";

export const AchievementManager: React.FC = () => {
  const { achievements } = useAchievements();
  const [notification, setNotification] = useState<string | null>(null);

  useEffect(() => {
    const newlyUnlocked = achievements.find(
      (a) => a.unlocked && a.unlockedAt && Date.now() - a.unlockedAt < 1000
    );

    if (newlyUnlocked) {
      setNotification(newlyUnlocked.id);
      soundManager.achievement();
    }
  }, [achievements]);

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
