"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import { site } from "@/content/site";
import { cn } from "@/lib/utils";

type TopBarProps = {
  actions?: React.ReactNode;
};

export function TopBar({ actions }: TopBarProps) {
  const pathname = usePathname();
  const isTitleScreen = pathname === "/";

  return (
    <header className="sticky top-0 z-30 flex h-11 shrink-0 items-center justify-between gap-4 bg-black px-4 sm:px-8">
      <Link
        href="/"
        aria-label={`${site.name}, back to the title screen`}
        tabIndex={isTitleScreen ? -1 : undefined}
        aria-hidden={isTitleScreen ? true : undefined}
        className={cn(
          "menu-type text-sm text-white/80 transition-opacity duration-300 outline-none hover:text-white focus-visible:text-primary",
          isTitleScreen && "pointer-events-none opacity-0",
        )}
      >
        {site.name}
      </Link>
      <div className="flex items-center gap-1">
        {site.availableForHire ? (
          <Link
            href="/contact"
            className="label-type flex items-center gap-2 px-2 py-1 whitespace-nowrap text-white/70 outline-none hover:text-white focus-visible:text-primary"
          >
            <span className="size-1.5 shrink-0 rounded-full bg-emerald-400" aria-hidden="true" />
            Available for hire
          </Link>
        ) : null}
        {actions}
      </div>
    </header>
  );
}
