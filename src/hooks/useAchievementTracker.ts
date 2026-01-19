import { useEffect, useRef } from "react";
import { useAchievements } from "../contexts/AchievementsContext";

export function useAchievementTracker() {
  const { unlockAchievement, checkAchievement } = useAchievements();
  const visitedSections = useRef<Set<string>>(new Set());
  const hasUnlockedFirstVisit = useRef(false);

  // Track first visit
  useEffect(() => {
    if (!hasUnlockedFirstVisit.current && !checkAchievement("first-visit")) {
      unlockAchievement("first-visit");
      hasUnlockedFirstVisit.current = true;
    }
  }, [checkAchievement, unlockAchievement]);

  // Track section visits
  const trackSectionVisit = (sectionId: string) => {
    visitedSections.current.add(sectionId);

    // Check if all sections visited
    const allSections = ["hero", "character", "skills", "quests", "save-point"];
    if (allSections.every((s) => visitedSections.current.has(s))) {
      if (!checkAchievement("all-sections")) {
        unlockAchievement("all-sections");
      }
    }
  };

  // Track form submission
  const trackFormSubmission = () => {
    if (!checkAchievement("form-submitted")) {
      unlockAchievement("form-submitted");
    }
  };

  // Track settings opened
  const trackSettingsOpened = () => {
    if (!checkAchievement("settings-opened")) {
      unlockAchievement("settings-opened");
    }
  };

  // Track Konami code
  const trackKonamiCode = () => {
    if (!checkAchievement("konami-code")) {
      unlockAchievement("konami-code");
    }
  };

  // Track projects viewed
  const trackProjectsViewed = () => {
    if (!checkAchievement("projects-viewed")) {
      unlockAchievement("projects-viewed");
    }
  };

  // Track skills scrolled
  const trackSkillsScrolled = () => {
    if (!checkAchievement("skills-scrolled")) {
      unlockAchievement("skills-scrolled");
    }
  };

  // Track scanlines enabled
  const trackScanlinesEnabled = () => {
    if (!checkAchievement("dark-mode")) {
      unlockAchievement("dark-mode");
    }
  };

  return {
    trackSectionVisit,
    trackFormSubmission,
    trackSettingsOpened,
    trackKonamiCode,
    trackProjectsViewed,
    trackSkillsScrolled,
    trackScanlinesEnabled
  };
}

