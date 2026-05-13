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
          MASTERY {mastery}%
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
      title: "CLOUD & DEVOPS",
      color: "secondary",
      mastery: 86,
      skills: [
        { name: "AWS (MULTI-REGION, ACM-STYLE PATTERNS)", level: 86 },
        { name: "TERRAFORM / IaC", level: 88 },
        { name: "DOCKER / KUBERNETES / JENKINS", level: 82 },
        { name: "CI/CD PIPELINES (PYTHON / JAVA)", level: 84 }
      ]
    },
    {
      title: "AI & MCP",
      color: "primary",
      mastery: 88,
      skills: [
        { name: "OLLAMA / LOCAL LLMS", level: 86 },
        { name: "LLAMAINDEX / RAG", level: 88 },
        { name: "MCP SERVERS / CURSOR TOOLING", level: 85 },
        { name: "OPENCLAW / AGENT ORCHESTRATION", level: 72 }
      ]
    },
    {
      title: "NETWORK & ENDPOINTS",
      color: "secondary",
      mastery: 80,
      skills: [
        { name: "WI-FI / LAN / DHCP / DNS", level: 82 },
        { name: "VoIP / CONFERENCING SETUP", level: 76 },
        { name: "WINDOWS / MACOS / LINUX DESKTOPS", level: 84 },
        { name: "INTUNE / SERVICENOW / AD / M365", level: 80 }
      ]
    },
    {
      title: "DATA & SCRIPTING",
      color: "primary",
      mastery: 82,
      skills: [
        { name: "PYTHON", level: 88 },
        { name: "SQL", level: 85 },
        { name: "BASH", level: 80 },
        { name: "SAS", level: 68 }
      ]
    },
    {
      title: "PRODUCT / STACK",
      color: "accent",
      mastery: 87,
      skills: [
        { name: "TYPESCRIPT / REACT", level: 88 },
        { name: "TAURI / VITE (STITCH)", level: 86 },
        { name: "FLASK / PYTHON APIs", level: 84 },
        { name: "TAILWIND / LOCAL-FIRST UX", level: 82 }
      ]
    },
    {
      title: "PROCESS & CLIENT",
      color: "accent",
      mastery: 84,
      skills: [
        { name: "AGILE / SCRUM / SOPs / RUNBOOKS", level: 86 },
        { name: "STAKEHOLDER REPORTING / VIZ", level: 82 },
        { name: "TEAM SCHEDULING & OPS (DOME)", level: 80 },
        { name: "TECH WRITING / ITSM / ONBOARDING KITS", level: 86 }
      ]
    }
  ],
  specialAbilities = [
    "> Ships local-first surfaces where privacy and ownership are part of the product story.",
    "> Automates the boring path: infra, kits, and pipelines so teams stop firefighting the same week.",
    "> Grounds AI in tools you control: RAG on your files, MCP in the editor, agents on your own metal.",
    "> Keeps L2–L4 and endpoint reality in mind when something breaks in prod or on a user laptop."
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

