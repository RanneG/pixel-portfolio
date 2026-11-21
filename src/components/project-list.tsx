"use client";

import { useEffect, useRef } from "react";
import Link from "next/link";
import { useRouter, useSelectedLayoutSegment } from "next/navigation";
import { Trophy } from "lucide-react";

import { StatusDot } from "@/components/status";
import type { Project } from "@/content/projects";
import { cn } from "@/lib/utils";

type ProjectListProps = {
  projects: Pick<
    Project,
    "slug" | "title" | "kind" | "status" | "tagline" | "award"
  >[];
};

const DESKTOP = "(min-width: 1024px)";

/**
 * Master list for the Projects screen. On large screens it sits beside the
 * selected project and the up and down arrow keys move the selection; on
 * small screens it is the index page and each row opens the project.
 */
export function ProjectList({ projects }: ProjectListProps) {
  const segment = useSelectedLayoutSegment();
  const router = useRouter();
  const activeRow = useRef<HTMLAnchorElement>(null);

  const isIndex = segment === null;
  const activeSlug = segment ?? projects[0].slug;
  const activeIndex = projects.findIndex((project) => project.slug === activeSlug);

  useEffect(() => {
    function onKeyDown(event: KeyboardEvent) {
      if (event.key !== "ArrowDown" && event.key !== "ArrowUp") return;
      if (
        event.defaultPrevented ||
        event.metaKey ||
        event.ctrlKey ||
        event.altKey ||
        event.shiftKey ||
        !window.matchMedia(DESKTOP).matches
      ) {
        return;
      }
      const step = event.key === "ArrowDown" ? 1 : -1;
      const next = Math.min(
        projects.length - 1,
        Math.max(0, (activeIndex < 0 ? 0 : activeIndex) + step),
      );
      event.preventDefault();
      if (next !== activeIndex) {
        router.replace(`/projects/${projects[next].slug}`, { scroll: false });
      }
    }

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [activeIndex, projects, router]);

  useEffect(() => {
    if (window.matchMedia(DESKTOP).matches) {
      activeRow.current?.scrollIntoView({ block: "nearest" });
    }
  }, [activeSlug]);

  return (
    <nav
      aria-label="Projects"
      className={cn(
        "panel lg:h-full lg:overflow-y-auto",
        !isIndex && "hidden lg:block",
      )}
    >
      <ol className="divide-y divide-border">
        {projects.map((project, index) => {
          const isActive = project.slug === activeSlug;
          return (
            <li key={project.slug}>
              <Link
                ref={isActive ? activeRow : undefined}
                href={`/projects/${project.slug}`}
                aria-current={isActive && !isIndex ? "page" : undefined}
                data-active={isActive}
                className={cn(
                  "group flex items-center gap-3 px-4 py-3.5 outline-none transition-colors duration-100 active:bg-white/10 lg:py-2",
                  "hover:bg-white/10 focus-visible:bg-white/10",
                  "lg:data-[active=true]:bg-white lg:data-[active=true]:text-black",
                )}
              >
                <span className="w-6 shrink-0 text-xs font-semibold tabular-nums text-white/45 lg:group-data-[active=true]:text-black/50">
                  {String(index + 1).padStart(2, "0")}
                </span>
                <span className="min-w-0 flex-1">
                  <span className="menu-type block text-base leading-tight">
                    {project.title}
                  </span>
                  <span className="mt-0.5 line-clamp-2 block text-[0.8125rem] leading-snug text-white/65 lg:hidden">
                    {project.tagline}
                  </span>
                  <span className="mt-0.5 hidden text-xs text-white/55 lg:block lg:group-data-[active=true]:text-black/60">
                    {project.kind}
                  </span>
                </span>
                {project.award ? (
                  <Trophy
                    role="img"
                    aria-label={project.award}
                    className="size-4 shrink-0 text-primary lg:group-data-[active=true]:text-black"
                  />
                ) : null}
                <StatusDot status={project.status} className="shrink-0" />
              </Link>
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
