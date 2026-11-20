import type { Metadata } from "next";
import Link from "next/link";

import { Screen } from "@/components/screen";
import { Badge } from "@/components/ui/badge";
import { projects } from "@/content/projects";
import { roles } from "@/content/roles";
import { skillGroups, type SkillGroup } from "@/content/skills";

export const metadata: Metadata = {
  title: "Skills",
  description:
    "Skills of Ranne Gerodias across product engineering, AI and MCP tooling, cloud and DevOps, data, and IT support.",
};

type Evidence = { label: string; href: string };

function evidenceFor(group: SkillGroup): Evidence[] {
  const fromProjects = (group.usedIn.projects ?? []).flatMap((slug) => {
    const project = projects.find((item) => item.slug === slug);
    return project
      ? [{ label: project.title, href: `/projects/${project.slug}` }]
      : [];
  });
  const fromRoles = (group.usedIn.roles ?? []).flatMap((id) => {
    const role = roles.find((item) => item.id === id);
    return role ? [{ label: role.company, href: `/roles#${role.id}` }] : [];
  });
  return [...fromProjects, ...fromRoles];
}

export default function SkillsPage() {
  return (
    <Screen title="Skills" summary="Grouped by where I use them">
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {skillGroups.map((group) => {
          const evidence = evidenceFor(group);
          return (
            <section
              key={group.title}
              className="panel flex flex-col border-t-2 border-t-primary"
            >
              <h2 className="menu-type px-5 pt-4 text-lg text-white">
                {group.title}
              </h2>
              <ul className="flex flex-1 flex-wrap content-start gap-1.5 px-5 pt-3 pb-5">
                {group.skills.map((skill) => (
                  <li key={skill}>
                    <Badge
                      variant="secondary"
                      className="h-7 px-2.5 text-sm font-medium text-white"
                    >
                      {skill}
                    </Badge>
                  </li>
                ))}
              </ul>
              {evidence.length > 0 ? (
                <p className="border-t border-border px-5 py-3 text-[0.8125rem] leading-relaxed text-white/60">
                  <span className="label-type mr-2 text-white/45">Used in</span>
                  {evidence.map((item, index) => (
                    <span key={item.href}>
                      {index > 0 ? <span aria-hidden="true"> · </span> : null}
                      <Link
                        href={item.href}
                        className="text-white/85 underline decoration-white/25 underline-offset-4 outline-none hover:text-white hover:decoration-primary focus-visible:text-primary"
                      >
                        {item.label}
                      </Link>
                    </span>
                  ))}
                </p>
              ) : null}
            </section>
          );
        })}
      </div>
    </Screen>
  );
}
