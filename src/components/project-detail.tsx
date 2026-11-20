import Link from "next/link";
import { ArrowLeft, ArrowUpRight, Lock, Trophy } from "lucide-react";

import { StatusLabel } from "@/components/status";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { projects, type Project } from "@/content/projects";

type ProjectDetailProps = {
  project: Project;
};

export function ProjectDetail({ project }: ProjectDetailProps) {
  const position = projects.findIndex((item) => item.slug === project.slug) + 1;
  const hasLinks = Boolean(project.links.live || project.links.source);

  return (
    <article
      className="screen-in panel flex flex-col border-t-2 border-t-primary lg:h-full lg:overflow-y-auto"
    >
      <div className="flex-1 p-5 sm:p-7 lg:p-8">
        <Link
          href="/projects"
          className="label-type mb-5 inline-flex items-center gap-1.5 text-white/70 outline-none hover:text-white focus-visible:text-primary lg:hidden"
        >
          <ArrowLeft className="size-3.5" aria-hidden="true" />
          All projects
        </Link>

        <div className="flex flex-wrap items-center gap-x-4 gap-y-1">
          <StatusLabel status={project.status} />
          <span className="label-type text-white/55">
            {project.kind} · {project.year}
          </span>
          <span className="label-type ml-auto hidden text-white/40 tabular-nums lg:block">
            {String(position).padStart(2, "0")} / {String(projects.length).padStart(2, "0")}
          </span>
        </div>

        <h2 className="menu-type mt-3 text-3xl leading-none text-white sm:text-4xl lg:text-5xl">
          {project.title}
        </h2>
        <p className="mt-3 max-w-2xl text-lg leading-snug font-medium text-primary sm:text-xl">
          {project.tagline}
        </p>

        {project.award ? (
          <p className="mt-4 inline-flex items-center gap-2 bg-primary px-2.5 py-1 text-sm font-bold text-primary-foreground">
            <Trophy className="size-4" aria-hidden="true" />
            {project.award}
          </p>
        ) : null}

        <p className="mt-5 max-w-2xl text-base leading-relaxed text-white/85">
          {project.description}
        </p>

        {project.highlights ? (
          <ul className="mt-5 max-w-2xl space-y-2">
            {project.highlights.map((highlight) => (
              <li
                key={highlight}
                className="flex gap-3 text-[0.9375rem] leading-snug text-white/85"
              >
                <span className="mt-2 h-px w-3 shrink-0 bg-primary" aria-hidden="true" />
                {highlight}
              </li>
            ))}
          </ul>
        ) : null}

        <div className="mt-7">
          <h3 className="label-type text-white/55">Built with</h3>
          <ul className="mt-2 flex flex-wrap gap-1.5">
            {project.stack.map((item) => (
              <li key={item}>
                <Badge variant="outline" className="h-6 px-2.5 text-[0.8125rem] text-white/90">
                  {item}
                </Badge>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {hasLinks || project.note ? (
        <div className="flex flex-wrap items-center gap-2 border-t border-border px-5 py-4 sm:px-7 lg:px-8">
          {project.links.live ? (
            <Button
              size="lg"
              nativeButton={false}
              render={
                <a href={project.links.live} target="_blank" rel="noopener noreferrer" />
              }
            >
              Open live site
              <ArrowUpRight data-icon="inline-end" />
            </Button>
          ) : null}
          {project.links.source ? (
            <Button
              size="lg"
              variant={project.links.live ? "outline" : "default"}
              nativeButton={false}
              render={
                <a href={project.links.source} target="_blank" rel="noopener noreferrer" />
              }
            >
              View source
              <ArrowUpRight data-icon="inline-end" />
            </Button>
          ) : null}
          {project.note ? (
            <p className="flex items-center gap-2 text-sm text-muted-foreground">
              <Lock className="size-3.5" aria-hidden="true" />
              {project.note}
            </p>
          ) : null}
        </div>
      ) : null}
    </article>
  );
}
