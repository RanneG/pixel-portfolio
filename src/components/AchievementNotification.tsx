import React, { useEffect, useState } from "react";
import type { Achievement } from "../types/achievements";

interface AchievementNotificationProps {
  achievement: Achievement;
  onClose: () => void;
}

export const AchievementNotification: React.FC<AchievementNotificationProps> = ({
  achievement,
  onClose
}) => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
    const timer = setTimeout(() => {
      setIsVisible(false);
      setTimeout(onClose, 300);
    }, 4000);

    return () => clearTimeout(timer);
  }, [onClose]);

  return (
    <div
      className={`fixed top-20 right-4 z-50 pixel-border bg-card p-4 box-glow transition-all duration-300 ${
        isVisible ? "translate-x-0 opacity-100" : "translate-x-full opacity-0"
      }`}
      role="alert"
      aria-live="polite"
    >
      <div className="flex items-start gap-3">
        <span className="text-2xl" aria-hidden="true">
          {achievement.icon}
        </span>
        <div className="flex-1">
          <p className="font-pixel text-xs text-accent mb-1">ACHIEVEMENT UNLOCKED!</p>
          <p className="font-pixel text-sm text-primary mb-1">{achievement.title}</p>
          <p className="text-[10px] text-foreground/80">{achievement.description}</p>
        </div>
        <button
          onClick={() => {
            setIsVisible(false);
            setTimeout(onClose, 300);
          }}
          className="text-muted hover:text-foreground text-xs"
          aria-label="Close notification"
        >
          ✕
        </button>
      </div>
    </div>
  );
};

