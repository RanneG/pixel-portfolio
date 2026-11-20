"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";

import { menu } from "@/content/site";
import { cn } from "@/lib/utils";

function isTypingTarget(target: EventTarget | null): boolean {
  if (!(target instanceof HTMLElement)) return false;
  return (
    target.isContentEditable ||
    target.tagName === "INPUT" ||
    target.tagName === "TEXTAREA" ||
    target.tagName === "SELECT"
  );
}

function Key({ children }: { children: React.ReactNode }) {
  return (
    <kbd className="inline-flex h-5 min-w-5 items-center justify-center border border-white/25 px-1 font-sans text-[0.6875rem] font-semibold text-white/80">
      {children}
    </kbd>
  );
}

/**
 * The title-screen menu. On the title screen it works like a game menu: a
 * cursor rests on an item, arrow keys move it and Enter opens it. Inside a
 * section the arrow keys switch sections and Escape returns to the title.
 */
export function MenuBar() {
  const pathname = usePathname();
  const router = useRouter();
  const [cursor, setCursor] = useState(0);

  const isTitleScreen = pathname === "/";
  const sectionIndex = menu.findIndex(
    (item) => pathname === item.href || pathname.startsWith(`${item.href}/`),
  );
  const highlighted = isTitleScreen ? cursor : sectionIndex;
  const inProjects = menu[sectionIndex]?.href === "/projects";

  // On large screens the content area, not the page, is the scroll container,
  // so it has to be returned to the top when the section changes. A link to an
  // anchor (a role, from Skills) keeps the position the browser scrolled to.
  useEffect(() => {
    if (window.location.hash) return;
    document.getElementById("content")?.scrollTo({ top: 0 });
  }, [sectionIndex]);

  useEffect(() => {
    function onKeyDown(event: KeyboardEvent) {
      if (
        event.defaultPrevented ||
        event.metaKey ||
        event.ctrlKey ||
        event.altKey ||
        event.shiftKey ||
        isTypingTarget(event.target)
      ) {
        return;
      }

      if (event.key === "ArrowRight" || event.key === "ArrowLeft") {
        const step = event.key === "ArrowRight" ? 1 : -1;
        const from = highlighted < 0 ? (step === 1 ? -1 : 0) : highlighted;
        const next = (from + step + menu.length) % menu.length;
        event.preventDefault();
        if (isTitleScreen) {
          setCursor(next);
        } else {
          router.push(menu[next].href);
        }
        return;
      }

      if (event.key === "Enter" && isTitleScreen) {
        // A focused link or button handles Enter itself.
        const focused = document.activeElement;
        if (focused instanceof HTMLElement && focused.closest("a, button")) {
          return;
        }
        event.preventDefault();
        router.push(menu[cursor].href);
        return;
      }

      if (event.key === "Escape" && !isTitleScreen) {
        if (sectionIndex >= 0) setCursor(sectionIndex);
        router.push("/");
      }
    }

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [cursor, highlighted, isTitleScreen, router, sectionIndex]);

  return (
    <div
      // Read by the backdrop styles: full colour behind the title screen,
      // desaturated behind a section. It lives here, in the persistent layout,
      // because previously visited screens stay in the DOM while hidden.
      data-screen={isTitleScreen ? "title" : "section"}
      className="menu-bar sticky bottom-0 z-30 flex shrink-0 items-stretch justify-between gap-6 bg-black px-1 pb-[env(safe-area-inset-bottom)] min-[400px]:px-2 sm:px-6"
    >
      <nav aria-label="Main menu" className="min-w-0 flex-1 lg:flex-none">
        <ul className="flex h-14 items-stretch justify-between gap-0 sm:justify-start sm:gap-2 lg:h-16">
          {menu.map((item, index) => {
            const isCurrent = !isTitleScreen && index === sectionIndex;
            const isHighlighted = index === highlighted;
            return (
              <li key={item.href} className="flex">
                <Link
                  href={item.href}
                  aria-current={isCurrent ? "page" : undefined}
                  onMouseEnter={() => {
                    if (isTitleScreen) setCursor(index);
                  }}
                  onFocus={() => {
                    if (isTitleScreen) setCursor(index);
                  }}
                  className={cn(
                    "menu-type flex items-center px-[clamp(0.25rem,1.6vw,0.5rem)] text-[clamp(0.6875rem,3.6vw,0.9375rem)] whitespace-nowrap outline-none transition-colors duration-150 sm:px-3 sm:text-lg lg:text-xl",
                    "focus-visible:bg-white/10",
                    isHighlighted
                      ? "text-primary"
                      : "text-white/85 hover:text-white",
                  )}
                >
                  {item.label}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>
      <div
        className="hidden items-center gap-5 text-white/60 lg:flex"
        aria-hidden="true"
      >
        {inProjects ? (
          <span className="label-type flex items-center gap-1.5">
            <Key>↑</Key>
            <Key>↓</Key>
            Browse
          </span>
        ) : null}
        <span className="label-type flex items-center gap-1.5">
          <Key>←</Key>
          <Key>→</Key>
          {isTitleScreen ? "Select" : "Switch"}
        </span>
        <span className="label-type flex items-center gap-1.5">
          {isTitleScreen ? (
            <>
              <Key>Enter</Key>
              Open
            </>
          ) : (
            <>
              <Key>Esc</Key>
              Back
            </>
          )}
        </span>
      </div>
    </div>
  );
}
