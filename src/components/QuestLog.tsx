import React from "react";
import type { Project } from "../types";

interface QuestLogProps {
  projects?: Project[];
}

const difficultyStyles: Record<
  Project["difficulty"],
  { color: string; label: string }
> = {
  LEGENDARY: { color: "text-pixelYellow", label: "LEGENDARY" }, // Orange
  EPIC: { color: "text-secondary", label: "EPIC" }, // Purple/Magenta
  RARE: { color: "text-primary", label: "RARE" }, // Cyan
  UNCOMMON: { color: "text-accent", label: "UNCOMMON" } // Green
};

const ProjectCard: React.FC<Project> = ({
  title,
  difficulty,
  status,
  description,
  xp,
  stars,
  tech,
  githubUrl,
  liveUrl,
  questId
}) => {
  const diff = difficultyStyles[difficulty];
  // Status badge colors: COMPLETED=blue (primary), IN PROGRESS=green (accent)
  const statusColorClass =
    status === "COMPLETED"
      ? "bg-primary/15 text-primary"
      : "bg-accent/15 text-accent";
  
  return (
    <article className="pixel-border bg-card p-4 md:p-6 box-glow flex flex-col justify-between gap-3">
      <header className="flex flex-col sm:flex-row items-start justify-between gap-3">
        <div className="flex-1">
          <h3 className="font-pixel text-[10px] md:text-xs text-foreground">{title}</h3>
          <p className="mt-1 text-[10px] md:text-[11px] text-foreground/80">{description}</p>
        </div>
        <div className="text-left sm:text-right text-[9px] md:text-[10px] font-pixel space-y-1">
          <span className={`${diff.color} block`}>{diff.label}</span>
          <span
            className={`inline-block px-2 py-1 ${statusColorClass} pixel-border`}
          >
            {status}
          </span>
        </div>
      </header>
      <div className="flex flex-col sm:flex-row flex-wrap items-start sm:items-center justify-between gap-2 text-[9px] md:text-[10px]">
        <div className="flex items-center gap-2">
          <span>XP +{xp}</span>
          <span className="text-pixelYellow" aria-label={`${stars} out of 5 stars`}>
            {"★".repeat(stars)}
            <span className="text-muted">
              {"★".repeat(5 - stars)}
            </span>
          </span>
        </div>
        <div className="flex flex-wrap gap-1">
          {tech.map((t) => (
            <span
              key={t}
              className="border border-muted bg-bg px-2 py-0.5 font-pixel text-[8px] md:text-[9px]"
            >
              {t}
            </span>
          ))}
        </div>
      </div>
      <footer className="mt-1 flex flex-col sm:flex-row flex-wrap items-start sm:items-center justify-between gap-2 text-[9px] md:text-[10px]">
        <div className="flex gap-2 flex-wrap">
          {githubUrl && (
            <a
              href={githubUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="retro-btn retro-btn-primary px-3 py-1.5 md:py-1 font-pixel min-h-[44px] flex items-center justify-center focus-visible:outline focus-visible:outline-2 focus-visible:outline-primary focus-visible:outline-offset-2"
              aria-label={`View ${title} source code on GitHub`}
            >
              GITHUB
            </a>
          )}
          {liveUrl && (
            <a
              href={liveUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="retro-btn retro-btn-secondary px-3 py-1.5 md:py-1 font-pixel min-h-[44px] flex items-center justify-center focus-visible:outline focus-visible:outline-2 focus-visible:outline-secondary focus-visible:outline-offset-2"
              aria-label={`View live demo of ${title}`}
            >
              LIVE DEMO
            </a>
          )}
          {!githubUrl && !liveUrl && (
            <span className="text-muted font-pixel text-[8px] md:text-[9px] flex items-center">
              LINKS COMING SOON
            </span>
          )}
        </div>
        <span className="text-muted font-pixel">QUEST ID {questId || `#${xp}`}</span>
      </footer>
    </article>
  );
};

const QuestLog: React.FC<QuestLogProps> = ({
  projects = [
    {
      title: "PIXEL QUEST DASHBOARD",
      difficulty: "LEGENDARY",
      status: "COMPLETED",
      description: "Analytics dashboard styled as a retro RPG battle screen.",
      xp: 2400,
      stars: 5,
      tech: ["REACT", "TYPESCRIPT", "TAILWIND"]
    },
    {
      title: "CRT BLOG TERMINAL",
      difficulty: "EPIC",
      status: "COMPLETED",
      description: "Developer blog rendered inside a CRT-style terminal UI.",
      xp: 1800,
      stars: 4,
      tech: ["NEXT.JS", "MDX", "MOTION"]
    },
    {
      title: "ARCADE PORTFOLIO",
      difficulty: "RARE",
      status: "IN PROGRESS",
      description: "Playable portfolio with level-based navigation and secrets.",
      xp: 1200,
      stars: 4,
      tech: ["REACT", "STATE MACHINES", "PIXEL ART"]
    }
  ]
}) => {
  return (
    <section
      id="quests"
      aria-labelledby="quests-heading"
      className="bg-bg py-12 md:py-16 lg:py-24 border-t border-muted"
      aria-labelledby="quests-heading"
    >
      <div className="mx-auto max-w-5xl px-4 md:px-6">
        <h2 id="quests-heading" className="mb-6 font-pixel text-xs md:text-sm text-secondary neon-glow-secondary">
          &gt; QUEST LOG
        </h2>
        <div className="grid gap-4 md:gap-5 md:grid-cols-2">
          {projects.map((project) => (
            <ProjectCard key={project.title} {...project} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default QuestLog;

