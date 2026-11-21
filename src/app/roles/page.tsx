import type { Metadata } from "next";
import { ArrowUpRight } from "lucide-react";

import { Screen } from "@/components/screen";
import { education, roles } from "@/content/roles";

export const metadata: Metadata = {
  title: "Roles",
  description:
    "Work history of Ranne Gerodias: IT support, DevOps at Deloitte, production programming and data analysis.",
};

export default function RolesPage() {
  return (
    <Screen title="Roles" summary="Work history and education">
      <div className="space-y-3">
        <section className="panel border-t-2 border-t-primary" aria-label="Work history">
          <ol className="divide-y divide-border">
            {roles.map((role) => (
              <li
                key={role.id}
                id={role.id}
                className="grid scroll-mt-4 gap-x-8 gap-y-2 px-4 py-4 target:bg-primary/10 sm:px-7 md:grid-cols-[10rem_minmax(0,1fr)]"
              >
                <p className="label-type flex flex-wrap items-center gap-x-2 gap-y-1 self-start pt-1 text-white/60 md:flex-col md:items-start">
                  <span className="whitespace-nowrap">
                    {role.start} – {role.end ?? "Now"}
                  </span>
                  {role.end ? null : (
                    <span className="bg-primary px-1.5 text-primary-foreground">
                      Current
                    </span>
                  )}
                </p>
                <div>
                  <h2 className="menu-type text-xl leading-tight text-white">
                    {role.title}
                  </h2>
                  <p className="mt-0.5 text-[0.9375rem] text-white/75">
                    {role.url ? (
                      <a
                        href={role.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-0.5 font-medium text-white underline decoration-white/30 underline-offset-4 outline-none hover:decoration-primary focus-visible:text-primary"
                      >
                        {role.company}
                        <ArrowUpRight className="size-3.5" aria-hidden="true" />
                      </a>
                    ) : (
                      <span className="font-medium text-white">{role.company}</span>
                    )}
                    <span className="text-white/55"> · {role.location}</span>
                  </p>
                  <ul className="mt-3 max-w-3xl space-y-1.5">
                    {role.points.map((point) => (
                      <li
                        key={point}
                        className="flex gap-3 text-[0.9375rem] leading-snug text-white/80"
                      >
                        <span
                          className="mt-2.5 h-px w-3 shrink-0 bg-white/40"
                          aria-hidden="true"
                        />
                        {point}
                      </li>
                    ))}
                  </ul>
                </div>
              </li>
            ))}
          </ol>
        </section>

        <section className="panel" aria-labelledby="education-heading">
          <h2
            id="education-heading"
            className="label-type border-b border-border px-5 py-3 text-primary sm:px-7"
          >
            Education
          </h2>
          <ul className="divide-y divide-border">
            {education.map((item) => (
              <li
                key={item.qualification}
                className="grid gap-x-8 gap-y-1 px-5 py-4 sm:px-7 md:grid-cols-[10rem_minmax(0,1fr)]"
              >
                <p className="label-type pt-1 text-white/60">{item.years}</p>
                <p className="text-[0.9375rem] text-white/75">
                  <span className="menu-type mr-2 text-lg text-white">
                    {item.qualification}
                  </span>
                  {item.institution}
                </p>
              </li>
            ))}
          </ul>
        </section>
      </div>
    </Screen>
  );
}
