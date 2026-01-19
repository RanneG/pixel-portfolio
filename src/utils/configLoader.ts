/**
 * Configuration loader utility
 * Loads JSON config files and merges with environment overrides
 */

import type {
  PersonalData,
  StatsData,
  SkillsData,
  ProjectsData,
  SiteConfig,
  EnvironmentOverrides,
  PortfolioData
} from "../types";

const isDevelopment = import.meta.env.DEV;

/**
 * Load JSON file with error handling
 */
async function loadJsonFile<T>(path: string, fallback: T): Promise<T> {
  try {
    const response = await fetch(path);
    if (!response.ok) {
      console.warn(`Failed to load ${path}, using fallback`);
      return fallback;
    }
    return await response.json();
  } catch (error) {
    console.warn(`Error loading ${path}:`, error);
    return fallback;
  }
}

/**
 * Load all configuration files
 */
export async function loadConfig(): Promise<{
  personal: PersonalData;
  stats: StatsData;
  skills: SkillsData;
  projects: ProjectsData;
  config: SiteConfig;
}> {
  // Load base config files from public/data
  const [personal, stats, skills, projects, config, envOverrides] = await Promise.all([
    loadJsonFile<PersonalData>("/data/personal.json", getDefaultPersonal()),
    loadJsonFile<StatsData>("/data/stats.json", getDefaultStats()),
    loadJsonFile<SkillsData>("/data/skills.json", getDefaultSkills()),
    loadJsonFile<ProjectsData>("/data/projects.json", getDefaultProjects()),
    loadJsonFile<SiteConfig>("/data/config.json", getDefaultConfig()),
    loadJsonFile<EnvironmentOverrides>(
      isDevelopment ? "/data/development.json" : "/data/production.json",
      { overrides: {} }
    )
  ]);

  // Apply environment overrides
  const mergedPersonal = { ...personal, ...envOverrides.overrides.personal };
  const mergedStats = { ...stats, ...envOverrides.overrides.stats };
  const mergedSkills = { ...skills, ...envOverrides.overrides.skills };
  const mergedProjects = { ...projects, ...envOverrides.overrides.projects };
  const mergedConfig = { ...config, ...envOverrides.overrides.config };

  return {
    personal: mergedPersonal,
    stats: mergedStats,
    skills: mergedSkills,
    projects: mergedProjects,
    config: mergedConfig
  };
}

/**
 * Merge config data into PortfolioData format
 */
export function mergePortfolioData(
  personal: PersonalData,
  stats: StatsData,
  skills: SkillsData,
  projects: ProjectsData
): PortfolioData {
  return {
    name: personal.name,
    title: personal.title,
    subtitle: personal.subtitle,
    bio: personal.bio,
    statusBadges: personal.statusBadges,
    stats: {
      projects: stats.projects,
      level: stats.level,
      creativity: stats.creativity
    },
    attributes: stats.attributes,
    experience: stats.experience,
    skills: skills.categories,
    projects: projects.projects,
    contact: personal.contact,
    socialLinks: personal.socialLinks,
    availableForHire: personal.availableForHire
  };
}

// Default fallbacks
function getDefaultPersonal(): PersonalData {
  return {
    name: "PLAYER ONE",
    title: "Frontend-focused developer crafting retro-futuristic interfaces.",
    subtitle: "DEVELOPER // DESIGNER // CREATOR",
    bio: ["> Loves combining design, code, and nostalgia."],
    statusBadges: ["CAFFEINATED", "MOTIVATED", "CREATIVE"],
    contact: {
      email: "player.one@example.dev",
      location: "NEAR A TERMINAL, SOMEWHERE ONLINE",
      timezone: "UTC+08"
    },
    socialLinks: [],
    availableForHire: true
  };
}

function getDefaultStats(): StatsData {
  return {
    projects: 0,
    level: "DEV 01",
    creativity: "MAX",
    attributes: { STR: 50, DEX: 50, INT: 50, CHA: 50 },
    experience: { current: 0, max: 10000 }
  };
}

function getDefaultSkills(): SkillsData {
  return {
    categories: [],
    specialAbilities: []
  };
}

function getDefaultProjects(): ProjectsData {
  return {
    projects: []
  };
}

function getDefaultConfig(): SiteConfig {
  return {
    site: {
      title: "8-Bit Portfolio",
      description: "Retro-themed portfolio website",
      logo: "<DEV/>",
      formspreeId: ""
    },
    theme: {
      default: "nes",
      available: ["nes", "gameboy", "arcade"]
    },
    features: {
      konamiCode: true,
      settingsPanel: true,
      installPrompt: true,
      analytics: false
    }
  };
}

