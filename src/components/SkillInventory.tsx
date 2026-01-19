import React from "react";
import { StatBar } from "./StatBar";
import type { SkillCategoryProps } from "../types";

interface SkillInventoryProps {
  skills?: SkillCategoryProps[];
  specialAbilities?: string[];
}

const SkillCategory: React.FC<SkillCategoryProps> = ({
  title,
  color,
  mastery,
  skills
}) => {
  const borderClass =
    color === "secondary"
      ? "pixel-border-secondary box-glow-secondary"
      : color === "accent"
        ? "pixel-border box-glow"
        : "pixel-border box-glow";

  const progressColor =
    color === "secondary" ? "secondary" : color === "accent" ? "accent" : "primary";

  return (
    <div className={`${borderClass} bg-card p-4 md:p-6 space-y-3`}>
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
        <p className="font-pixel text-[10px] md:text-xs text-foreground">{title}</p>
        <p className="text-[9px] md:text-[10px] font-pixel text-muted">
          MASTERY {mastery}% XP
        </p>
      </div>
      <div className="pixel-progress-track h-3 w-full" role="progressbar" aria-valuenow={mastery} aria-valuemin={0} aria-valuemax={100}>
        <div
          className={
            progressColor === "secondary"
              ? "pixel-progress-fill-secondary"
              : progressColor === "accent"
                ? "pixel-progress-fill-accent"
                : "pixel-progress-fill"
          }
          style={{ width: `${mastery}%` }}
        />
      </div>
      <div className="space-y-2 text-[10px] md:text-[11px]">
        {skills.map((skill) => (
          <StatBar
            key={skill.name}
            label={skill.name}
            value={skill.level}
            color={color}
          />
        ))}
      </div>
    </div>
  );
};

const SkillInventory: React.FC<SkillInventoryProps> = ({
  skills = [
    {
      title: "FRONTEND",
      color: "primary",
      mastery: 88,
      skills: [
        { name: "REACT / NEXT", level: 90 },
        { name: "TYPESCRIPT", level: 87 },
        { name: "TAILWIND CSS", level: 92 }
      ]
    },
    {
      title: "BACKEND",
      color: "secondary",
      mastery: 72,
      skills: [
        { name: "NODE / EXPRESS", level: 70 },
        { name: "REST / GRAPHQL", level: 68 },
        { name: "DATABASES", level: 65 }
      ]
    },
    {
      title: "DESIGN",
      color: "accent",
      mastery: 83,
      skills: [
        { name: "UI / UX", level: 85 },
        { name: "PROTOTYPING", level: 80 },
        { name: "MOTION", level: 78 }
      ]
    },
    {
      title: "OTHER",
      color: "primary",
      mastery: 76,
      skills: [
        { name: "GIT / DEVOPS", level: 72 },
        { name: "WRITING / DOCS", level: 82 },
        { name: "GAME JAMS", level: 74 }
      ]
    }
  ],
  specialAbilities = [
    "> Summons satisfying micro-interactions on user action.",
    "> Casts \"Refactor\" to reduce bug spawn rates.",
    "> Detects UX bottlenecks and applies speed buffs.",
    "> Generates pixel-perfect layouts at 60 FPS."
  ]
}) => {
  return (
    <section
      id="skills"
      className="bg-[radial-gradient(circle_at_top,_hsl(180_100%_10%)_0,_hsl(240_10%_4%)_55%)] py-12 md:py-16 lg:py-24 border-t border-muted"
      aria-labelledby="skills-heading"
    >
      <div className="mx-auto max-w-5xl px-4 md:px-6">
        <h2 id="skills-heading" className="mb-6 font-pixel text-xs md:text-sm text-secondary neon-glow-secondary">
          &gt; SKILL INVENTORY
        </h2>
        <p className="sr-only">Browse through different skill categories and proficiency levels</p>

        <div className="grid gap-4 md:gap-5 md:grid-cols-2">
          {skills.map((category) => (
            <SkillCategory key={category.title} {...category} />
          ))}
        </div>

        <div className="mt-6 pixel-border bg-card p-4 md:p-6 box-glow text-[10px] md:text-[11px] lg:text-xs">
          <p className="font-pixel text-[10px] md:text-xs text-muted mb-2">SPECIAL ABILITIES</p>
          <ul className="grid gap-1 md:grid-cols-2">
            {specialAbilities.map((ability, index) => (
              <li key={index}>{ability}</li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
};

export default SkillInventory;

