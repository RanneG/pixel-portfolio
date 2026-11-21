"use client";

import { useSelectedLayoutSegment } from "next/navigation";

import { Screen } from "@/components/screen";

type ProjectsScreenProps = {
  count: number;
  children: React.ReactNode;
};

/**
 * On a phone, an open project replaces the list, so the "Projects" heading
 * would sit on top of the project's own title. It stays on the index, and on
 * large screens where the list and the project are shown together.
 */
export function ProjectsScreen({ count, children }: ProjectsScreenProps) {
  const segment = useSelectedLayoutSegment();
  const projectOpen = segment !== null;

  return (
    <Screen
      title="Projects"
      summary={`${count} projects, newest work first`}
      fill
      className={projectOpen ? "max-lg:pt-3" : undefined}
      headerClassName={projectOpen ? "max-lg:hidden" : undefined}
    >
      {children}
    </Screen>
  );
}
