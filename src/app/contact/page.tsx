import type { Metadata } from "next";
import { ArrowUpRight, Mail } from "lucide-react";

import { CopyButton } from "@/components/copy-button";
import { Screen } from "@/components/screen";
import { Button } from "@/components/ui/button";
import { site } from "@/content/site";

export const metadata: Metadata = {
  title: "Contact",
  description: `Get in touch with ${site.name} by email, GitHub or LinkedIn.`,
};

const profiles = [
  { name: "GitHub", ...site.links.github },
  { name: "LinkedIn", ...site.links.linkedin },
];

export default function ContactPage() {
  return (
    <Screen title="Contact">
      <div className="grid gap-3 lg:grid-cols-[minmax(0,1.25fr)_minmax(0,1fr)]">
        <section className="panel border-t-2 border-t-primary p-5 sm:p-7">
          <p className="max-w-xl text-base leading-relaxed text-white/85 sm:text-lg">
            Hiring for local-first product work, MCP and RAG tooling, or DevOps
            that removes toil? Email is the quickest way to reach me.
          </p>
          <h2 className="label-type mt-7 text-primary">Email</h2>
          <p className="mt-1 text-xl font-semibold break-all text-white select-all sm:text-2xl">
            {site.email}
          </p>
          <div className="mt-5 flex flex-wrap gap-2">
            <Button
              size="lg"
              nativeButton={false}
              render={<a href={`mailto:${site.email}`} />}
            >
              <Mail data-icon="inline-start" />
              Write an email
            </Button>
            <CopyButton value={site.email} label="Copy address" />
          </div>
        </section>

        <section className="panel" aria-label="Profiles and location">
          <ul className="divide-y divide-border">
            {profiles.map((profile) => (
              <li key={profile.name}>
                <a
                  href={profile.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group flex items-center gap-4 px-5 py-4 outline-none transition-colors hover:bg-white hover:text-black focus-visible:bg-white focus-visible:text-black sm:px-6"
                >
                  <span className="min-w-0 flex-1">
                    <span className="label-type block text-primary group-hover:text-black/60 group-focus-visible:text-black/60">
                      {profile.name}
                    </span>
                    <span className="mt-1 block truncate text-[0.9375rem]">
                      {profile.label}
                    </span>
                  </span>
                  <ArrowUpRight className="size-5 shrink-0" aria-hidden="true" />
                </a>
              </li>
            ))}
            <li className="px-5 py-4 sm:px-6">
              <span className="label-type block text-primary">Based</span>
              <span className="mt-1 block text-[0.9375rem] text-white/90">
                {site.location} · {site.timezone}
              </span>
            </li>
          </ul>
        </section>
      </div>
    </Screen>
  );
}
