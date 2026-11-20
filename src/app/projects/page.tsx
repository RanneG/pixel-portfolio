import type { Metadata } from "next";

import { ProjectDetail } from "@/components/project-detail";
import { projects } from "@/content/projects";

export const metadata: Metadata = {
  title: "Projects",
  description:
    "Local-first apps, MCP and RAG tooling, client work and hackathon builds by Ranne Gerodias.",
};

/**
 * On large screens the first project is open beside the list. On small
 * screens the list is the page, so the detail is hidden until one is chosen.
 */
export default function ProjectsPage() {
  return (
    <div className="hidden lg:block lg:min-h-0">
      <ProjectDetail project={projects[0]} />
    </div>
  );
}
