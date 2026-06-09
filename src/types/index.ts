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
  /** Purpose / motivation for `experience --project "…"` (falls back to `description`). */
  motivation?: string;
  /** Optional one-liner (e.g. hackathon win). */
  highlight?: string;
  /** Short prize / recognition line shown as a badge in browse + quest log. */
  award?: string;
  tech: string[];
  githubUrl?: string;
  liveUrl?: string;
  /** Shown on browse home when true. */
  featured?: boolean;
  /** Optional card image (e.g. /images/projects/stitch.svg). */
  imageUrl?: string;
  questId?: string; // Format: MS-001, AR-001, LC-001
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

export interface WorkExperienceEntry {
  company: string;
  role: string;
  start: string;
  end: string;
  /** Company / careers site for `open --company "…"`. */
  url?: string;
  /** Short paragraphs for `experience --detailed` (preferred over `bullets`). */
  paragraphs?: string[];
  bullets?: string[];
}

export interface EducationEntry {
  institution: string;
  /** e.g. city, county */
  location?: string;
  start: string;
  end: string;
  qualification: string;
}

export interface PortfolioData {
  name: string;
  title: string;
  subtitle: string;
  bio: string[];
  statusBadges: string[];
  motto?: string;
  workExperience?: WorkExperienceEntry[];
  education?: EducationEntry[];
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
  skills: SkillCategoryProps[];
  /** From skills.json `specialAbilities`; browse mode / SkillInventory. */
  specialAbilities: string[];
  projects: Project[];
  contact: ContactInfo;
  socialLinks: SocialLink[];
  availableForHire: boolean;
}

// Config file types
export interface SiteConfig {
  site: {
    title: string;
    description: string;
    logo: string;
    formspreeId: string;
  };
  features: {
    konamiCode: boolean;
    settingsPanel: boolean;
    installPrompt: boolean;
    analytics: boolean;
  };
}

export interface PersonalData {
  name: string;
  title: string;
  subtitle: string;
  bio: string[];
  statusBadges: string[];
  contact: ContactInfo;
  socialLinks: SocialLink[];
  availableForHire: boolean;
  motto?: string;
  workExperience?: WorkExperienceEntry[];
  education?: EducationEntry[];
}

export interface StatsData {
  projects: number;
  level: string;
  creativity: string;
  attributes: {
    STR: number;
    DEX: number;
    INT: number;
    CHA: number;
  };
}

export interface SkillsData {
  categories: SkillCategoryProps[];
  specialAbilities: string[];
}

export interface ProjectsData {
  projects: Project[];
}

export interface EnvironmentOverrides {
  overrides: {
    personal?: Partial<PersonalData>;
    stats?: Partial<StatsData>;
    skills?: Partial<SkillsData>;
    projects?: Partial<ProjectsData>;
    config?: Partial<SiteConfig>;
  };
}

