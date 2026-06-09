/** Achievements disabled — no-op tracker for callers that still import this hook. */
export function useAchievementTracker() {
  const noop = () => {};

  return {
    trackSectionVisit: noop,
    trackFormSubmission: noop,
    trackSettingsOpened: noop,
    trackKonamiCode: noop,
    trackProjectsViewed: noop,
    trackSkillsScrolled: noop
  };
}
