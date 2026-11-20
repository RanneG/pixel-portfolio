import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

import { Screen } from "@/components/screen";
import { Button } from "@/components/ui/button";
import { about, site } from "@/content/site";

export const metadata: Metadata = {
  title: "About Me",
  description: site.description,
};

export default function AboutPage() {
  return (
    <Screen title="About Me" summary={site.tagline}>
      <div className="grid gap-3 lg:grid-cols-[minmax(0,1.25fr)_minmax(0,1fr)]">
        <section className="panel border-t-2 border-t-primary p-5 sm:p-7">
          <div className="space-y-4 text-base leading-relaxed text-white/90 sm:text-lg">
            {about.paragraphs.map((paragraph) => (
              <p key={paragraph}>{paragraph}</p>
            ))}
          </div>
          <div className="mt-7 flex flex-wrap gap-2">
            <Button size="lg" nativeButton={false} render={<Link href="/projects" />}>
              See my projects
              <ArrowRight data-icon="inline-end" />
            </Button>
            <Button
              size="lg"
              variant="outline"
              nativeButton={false}
              render={<Link href="/contact" />}
            >
              Get in touch
            </Button>
          </div>
        </section>

        <section className="panel" aria-label="At a glance">
          <dl className="divide-y divide-border">
            {about.facts.map((fact) => (
              <div key={fact.label} className="px-5 py-4 sm:px-6">
                <dt className="label-type text-primary">{fact.label}</dt>
                <dd className="mt-1 text-[0.9375rem] leading-snug text-white/90">
                  {fact.value}
                </dd>
              </div>
            ))}
          </dl>
        </section>
      </div>
    </Screen>
  );
}
