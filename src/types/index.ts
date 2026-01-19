// Shared types for the portfolio

export type StatBarColor = "primary" | "secondary" | "accent";

export interface StatBarProps {
  label: string;
  value: number;
  color?: StatBarColor;
}

export interface Skill {
  name: string;
  level: number;
}

export interface SkillCategoryProps {
  title: string;
  color: StatBarColor;
  mastery: number;
  skills: Skill[];
}

export type ProjectDifficulty = "LEGENDARY" | "EPIC" | "RARE" | "UNCOMMON";
export type ProjectStatus = "COMPLETED" | "IN PROGRESS";

export interface Project {
  title: string;
  difficulty: ProjectDifficulty;
  status: ProjectStatus;
  description: string;
  xp: number;
  stars: number;
  tech: string[];
  githubUrl?: string;
  liveUrl?: string;
  questId?: string; // Format: MS-001, AR-001, PP-001
}

export interface ContactInfo {
  email: string;
  location: string;
  timezone: string;
}

export interface SocialLink {
  name: string;
  url: string;
}

export interface PortfolioData {
  name: string;
  title: string;
  subtitle: string;
  bio: string[];
  statusBadges: string[];
  stats: {
    projects: number;
    level: string;
    creativity: string;
  };
  attributes: {
    STR: number;
    DEX: number;
    INT: number;
    CHA: number;
  };
  experience: {
    current: number;
    max: number;
  };
  skills: SkillCategoryProps[];
  projects: Project[];
  contact: ContactInfo;
  socialLinks: SocialLink[];
  availableForHire: boolean;
}

