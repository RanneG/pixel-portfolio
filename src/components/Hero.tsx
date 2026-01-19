import React from "react";

interface HeroProps {
  name?: string;
  subtitle?: string;
  stats?: {
    projects: number;
    level: string;
    creativity: string;
  };
}

const Hero: React.FC<HeroProps> = ({
  name = "PLAYER ONE",
  subtitle = "DEVELOPER // DESIGNER // CREATOR",
  stats = {
    projects: 24,
    level: "DEV 07",
    creativity: "MAX"
  }
}) => {
  return (
    <section
      id="hero"
      className="relative isolate flex min-h-screen items-center justify-center bg-[radial-gradient(circle_at_top,_hsl(180_100%_20%)_0,_transparent_55%),radial-gradient(circle_at_bottom,_hsl(320_100%_18%)_0,_transparent_55%)]"
      aria-label="Hero section"
    >
      <div className="absolute inset-0 opacity-30 pointer-events-none" aria-hidden="true">
        <div className="h-full w-full bg-[linear-gradient(90deg,_rgba(255,255,255,0.05)_1px,_transparent_1px),linear-gradient(180deg,_rgba(255,255,255,0.05)_1px,_transparent_1px)] bg-[size:32px_32px]" />
      </div>

      {/* HP/MP bars - Mobile friendly redesign */}
      <div className="absolute left-3 top-20 w-24 md:w-32">
        <div className="hp-bar h-3 md:h-4">
          <div className="hp-bar-inner" style={{ width: "78%" }} aria-label="Health Points: 78%" />
        </div>
        <p className="mt-1 text-[9px] md:text-[10px] font-pixel text-pixelOrange">HP 078/100</p>
      </div>

      <div className="absolute right-3 bottom-6 w-24 md:w-32">
        <div className="mp-bar h-3 md:h-4">
          <div className="mp-bar-inner" style={{ width: "62%" }} aria-label="Magic Points: 62%" />
        </div>
        <p className="mt-1 text-[9px] md:text-[10px] font-pixel text-pixelBlue">MP 062/100</p>
      </div>

      {/* Mobile stats alternative */}
      <div className="absolute top-24 right-3 flex flex-col gap-2 md:hidden">
        <div className="pixel-border bg-card/90 p-2 text-center">
          <p className="text-[8px] font-pixel text-muted">PROJECTS</p>
          <p className="text-xs font-pixel text-primary">{stats.projects}+</p>
        </div>
        <div className="pixel-border bg-card/90 p-2 text-center">
          <p className="text-[8px] font-pixel text-muted">LEVEL</p>
          <p className="text-xs font-pixel text-secondary">{stats.level}</p>
        </div>
      </div>

      <div className="pointer-events-none absolute inset-0" aria-hidden="true">
        <div className="float absolute left-10 top-24 h-3 w-3 bg-pixelYellow pixel-border" />
        <div className="float absolute right-16 top-40 h-2 w-2 bg-pixelBlue pixel-border-secondary" />
        <div className="float absolute left-1/2 bottom-16 h-2 w-2 bg-pixelOrange pixel-border" />
        <div className="float absolute right-6 bottom-32 h-3 w-3 bg-accent pixel-border-secondary" />
      </div>

      <div className="relative z-10 mx-auto flex max-w-4xl flex-col gap-6 md:gap-8 px-4 pt-20 pb-16 text-center md:px-6 md:pt-28 md:pb-24">
        <div className="inline-flex items-center justify-center gap-2 self-center rounded-none bg-card/80 px-3 py-1 font-pixel text-[9px] md:text-[10px] uppercase tracking-widest pixel-border">
          <span className="h-2 w-2 animate-pulse rounded-none bg-accent" aria-hidden="true" />
          <span className="text-accent">PRESS START</span>
        </div>

        <div className="space-y-3 md:space-y-4">
          <p className="text-[10px] md:text-xs lg:text-sm font-pixel tracking-[0.25em] text-secondary neon-glow-secondary">
            HELLO, I&apos;M
          </p>
          <h1 className="font-pixel text-lg md:text-xl lg:text-3xl xl:text-4xl leading-tight text-primary neon-glow">
            {name}
          </h1>
          <p className="mx-auto max-w-xl text-xs md:text-sm lg:text-base text-foreground/80">
            <span className="typewriter font-retro text-primary">
              {subtitle}
            </span>
          </p>
        </div>

        <div className="grid gap-3 md:gap-4 text-left text-[10px] md:text-[11px] lg:text-xs md:grid-cols-3">
          <div className="pixel-border box-glow bg-card/90 p-3">
            <p className="font-pixel text-[9px] md:text-[10px] text-muted">PROJECTS</p>
            <p className="mt-2 font-pixel text-base md:text-lg text-primary">{stats.projects}+</p>
            <p className="mt-1 text-[9px] md:text-[10px] text-foreground/70">
              Web apps, experimental UIs, and creative tools.
            </p>
          </div>
          <div className="pixel-border box-glow bg-card/90 p-3">
            <p className="font-pixel text-[9px] md:text-[10px] text-muted">LEVEL</p>
            <p className="mt-2 font-pixel text-base md:text-lg text-secondary">{stats.level}</p>
            <p className="mt-1 text-[9px] md:text-[10px] text-foreground/70">
              Focused on crafting delightful experiences.
            </p>
          </div>
          <div className="pixel-border box-glow bg-card/90 p-3">
            <p className="font-pixel text-[9px] md:text-[10px] text-muted">CREATIVITY</p>
            <p className="mt-2 font-pixel text-base md:text-lg text-accent">{stats.creativity}</p>
            <p className="mt-1 text-[9px] md:text-[10px] text-foreground/70">
              Always experimenting with new ideas & aesthetics.
            </p>
          </div>
        </div>

        <div className="flex flex-wrap justify-center gap-3 md:gap-4">
          <a
            href="#quests"
            className="retro-btn retro-btn-primary px-4 py-2.5 md:py-2 font-pixel text-[10px] uppercase tracking-widest min-h-[44px] flex items-center justify-center"
            aria-label="View projects"
          >
            VIEW QUESTS
          </a>
          <a
            href="#save-point"
            className="retro-btn retro-btn-secondary px-4 py-2.5 md:py-2 font-pixel text-[10px] uppercase tracking-widest min-h-[44px] flex items-center justify-center"
            aria-label="Contact me"
          >
            SAVE PROGRESS
          </a>
        </div>
      </div>
    </section>
  );
};

export default Hero;

