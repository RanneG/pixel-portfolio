export interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string;
  unlocked: boolean;
  unlockedAt?: number; // timestamp
  category: "exploration" | "interaction" | "completion" | "secret";
}

export interface AchievementProgress {
  achievementId: string;
  progress: number;
  maxProgress: number;
}

export const ACHIEVEMENTS: Achievement[] = [
  {
    id: "first-visit",
    title: "WELCOME, PLAYER ONE",
    description: "Visited the portfolio for the first time",
    icon: "🎮",
    unlocked: false,
    category: "exploration"
  },
  {
    id: "all-sections",
    title: "EXPLORER",
    description: "Visited all sections",
    icon: "🗺️",
    unlocked: false,
    category: "exploration"
  },
  {
    id: "form-submitted",
    title: "MESSAGE SENT",
    description: "Successfully submitted the contact form",
    icon: "📧",
    unlocked: false,
    category: "interaction"
  },
  {
    id: "konami-code",
    title: "CHEAT CODE ACTIVATED",
    description: "Entered the Konami code",
    icon: "⭐",
    unlocked: false,
    category: "secret"
  },
  {
    id: "settings-opened",
    title: "TINKERER",
    description: "Opened the settings panel",
    icon: "⚙️",
    unlocked: false,
    category: "interaction"
  },
  {
    id: "projects-viewed",
    title: "QUEST LOG EXPLORED",
    description: "Viewed all projects",
    icon: "📋",
    unlocked: false,
    category: "exploration"
  },
  {
    id: "skills-scrolled",
    title: "SKILL MASTER",
    description: "Scrolled through all skills",
    icon: "🎯",
    unlocked: false,
    category: "exploration"
  },
  {
    id: "dark-mode",
    title: "RETRO ENTHUSIAST",
    description: "Enabled scanlines effect",
    icon: "📺",
    unlocked: false,
    category: "interaction"
  }
];

