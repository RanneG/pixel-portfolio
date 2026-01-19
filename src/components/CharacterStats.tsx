import React from "react";
import { StatBar } from "./StatBar";

interface CharacterStatsProps {
  name?: string;
  title?: string;
  bio?: string[];
  statusBadges?: string[];
  attributes?: {
    STR: number;
    DEX: number;
    INT: number;
    CHA: number;
  };
  experience?: {
    current: number;
    max: number;
  };
}

const CharacterStats: React.FC<CharacterStatsProps> = ({
  name = "PLAYER ONE / DEV",
  title = "Frontend-focused developer crafting retro-futuristic interfaces and playful experiences.",
  bio = [
    "> Loves combining design, code, and nostalgia.",
    "> Specializes in TypeScript, React, and delightful details.",
    "> Currently grinding XP in UI engineering and motion design."
  ],
  statusBadges = ["CAFFEINATED", "MOTIVATED", "CREATIVE"],
  attributes = {
    STR: 70,
    DEX: 84,
    INT: 92,
    CHA: 78
  },
  experience = {
    current: 13420,
    max: 20000
  }
}) => {
  const xpPercentage = Math.round((experience.current / experience.max) * 100);

  return (
    <section
      id="character"
      className="bg-bg py-12 md:py-16 lg:py-24 border-t border-muted"
      aria-labelledby="character-heading"
    >
      <div className="mx-auto max-w-5xl px-4 md:px-6">
        <h2 id="character-heading" className="mb-6 font-pixel text-xs md:text-sm text-secondary neon-glow-secondary">
          &gt; CHARACTER STATS
        </h2>
        <p className="sr-only">View character information, bio, attributes, and experience level</p>

        <div className="grid gap-6 md:gap-8 md:grid-cols-[minmax(0,_2fr)_minmax(0,_3fr)]">
          <div className="pixel-border bg-card p-4 md:p-6 box-glow">
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
              <div className="flex h-16 w-16 md:h-20 md:w-20 items-center justify-center bg-bg pixel-border-secondary box-glow-secondary flex-shrink-0">
                <span className="font-pixel text-2xl md:text-3xl text-primary" aria-label="Character avatar">:)</span>
              </div>
              <div className="space-y-1 text-xs md:text-sm">
                <p className="font-pixel text-xs md:text-sm text-primary">
                  {name}
                </p>
                <p className="text-foreground/80 text-[11px] md:text-xs">
                  &gt; {title}
                </p>
              </div>
            </div>

            <div className="mt-4 flex flex-wrap gap-2 text-[9px] md:text-[10px] font-pixel">
              {statusBadges.map((badge, index) => {
                const colors = [
                  "bg-accent/20 text-accent",
                  "bg-primary/15 text-primary",
                  "bg-secondary/20 text-secondary"
                ];
                return (
                  <span
                    key={badge}
                    className={`pixel-border ${colors[index % colors.length]} px-2 py-1`}
                  >
                    {badge}
                  </span>
                );
              })}
            </div>

            <div className="mt-4 space-y-1 text-[11px] md:text-xs text-foreground/80">
              {bio.map((line, index) => (
                <p key={index}>{line}</p>
              ))}
            </div>
          </div>

          <div className="space-y-4">
            <div className="pixel-border bg-card p-4 md:p-6 box-glow">
              <p className="mb-3 font-pixel text-[10px] md:text-xs text-muted">
                CORE ATTRIBUTES
              </p>
              <div className="space-y-3">
                <StatBar label="STR" value={attributes.STR} color="accent" />
                <StatBar label="DEX" value={attributes.DEX} color="secondary" />
                <StatBar label="INT" value={attributes.INT} color="primary" />
                <StatBar label="CHA" value={attributes.CHA} color="secondary" />
              </div>
            </div>

            <div className="pixel-border bg-card p-4 md:p-6 box-glow-secondary">
              <p className="mb-3 font-pixel text-[10px] md:text-xs text-muted">
                EXPERIENCE
              </p>
              <div className="pixel-progress-track h-4 md:h-5 w-full" role="progressbar" aria-valuenow={xpPercentage} aria-valuemin={0} aria-valuemax={100}>
                <div
                  className="pixel-progress-fill-accent"
                  style={{ width: `${xpPercentage}%` }}
                />
              </div>
              <div className="mt-2 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 text-[10px] md:text-[11px]">
                <span>XP: {experience.current.toLocaleString()} / {experience.max.toLocaleString()}</span>
                <span className="text-accent font-pixel">LEVEL UP SOON</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CharacterStats;

