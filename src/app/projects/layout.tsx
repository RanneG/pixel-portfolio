import { Suspense } from "react";

import { ProjectList } from "@/components/project-list";
import { Screen } from "@/components/screen";
import { projects } from "@/content/projects";

const listItems = projects.map(
  ({ slug, title, kind, status, tagline, award }) => ({
    slug,
    title,
    kind,
    status,
    tagline,
    award,
  }),
);

export default function ProjectsLayout({ children }: LayoutProps<"/projects">) {
  return (
    <Screen title="Projects" summary={`${projects.length} projects, newest work first`} fill>
      <div className="grid gap-3 lg:h-full lg:grid-cols-[22rem_minmax(0,1fr)] lg:grid-rows-[minmax(0,1fr)]">
        <Suspense fallback={<div className="panel hidden lg:block" />}>
          <ProjectList projects={listItems} />
        </Suspense>
        {children}
      </div>
    </Screen>
  );
}
