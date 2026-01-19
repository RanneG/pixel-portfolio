import React, { useState, useEffect } from "react";
import { debounce } from "../utils/debounce";
import { usePrefetch } from "../hooks/usePrefetch";
import { useAchievementTracker } from "../hooks/useAchievementTracker";
import { soundManager } from "../utils/soundManager";
import { analytics } from "../utils/analytics";

interface NavItem {
  href: string;
  label: string;
}

interface NavigationProps {
  name?: string;
}

const Navigation: React.FC<NavigationProps> = ({ name = "PLAYER ONE" }) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState("hero");
  const { trackSectionVisit } = useAchievementTracker();

  // Prefetch components on hover for better performance
  const prefetchSkills = usePrefetch(
    () => import("../components/SkillInventory"),
    true
  );
  const prefetchQuests = usePrefetch(
    () => import("../components/QuestLog"),
    true
  );

  const items: NavItem[] = [
    { href: "#hero", label: "HOME" },
    { href: "#character", label: "CHARACTER STATS" },
    { href: "#skills", label: "SKILL INVENTORY" },
    { href: "#quests", label: "QUEST LOG" },
    { href: "#save-point", label: "SAVE POINT" }
  ];

  useEffect(() => {
    const handleScroll = () => {
      const sections = items.map((item) => item.href.substring(1));
      const scrollPosition = window.scrollY + 100;

      for (const section of sections) {
        const element = document.getElementById(section);
        if (element) {
          const { offsetTop, offsetHeight } = element;
          if (scrollPosition >= offsetTop && scrollPosition < offsetTop + offsetHeight) {
            if (activeSection !== section) {
              soundManager.transition();
              trackSectionVisit(section);
              analytics.trackEvent("section_viewed", { section });
            }
            setActiveSection(section);
            break;
          }
        }
      }
    };

    // Debounce scroll events for better performance
    const debouncedScroll = debounce(handleScroll, 10);

    window.addEventListener("scroll", debouncedScroll, { passive: true });
    return () => window.removeEventListener("scroll", debouncedScroll);
  }, [items]);

  return (
    <header className="fixed inset-x-0 top-0 z-40 bg-bg/90 backdrop-blur border-b border-muted" role="banner">
      <nav className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3 md:px-6" aria-label="Main navigation">
        <a href="#hero" className="flex items-center gap-3" aria-label="Home">
          <span className="font-pixel text-xs md:text-sm text-primary neon-glow">
            {"<DEV/>"}
          </span>
          <span className="hidden text-[10px] font-retro text-muted md:inline">
            {name.toUpperCase()} PORTFOLIO
          </span>
        </a>
        
        {/* Mobile menu button */}
        <button
          className="md:hidden pixel-border bg-card p-3 text-primary hover:bg-card/80 active:scale-95 transition-transform min-w-[48px] min-h-[48px] flex items-center justify-center"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          aria-label="Toggle mobile menu"
          aria-expanded={isMobileMenuOpen}
        >
          <span className="font-pixel text-sm">{isMobileMenuOpen ? "✕" : "☰"}</span>
        </button>

        {/* Desktop menu */}
        <ul className="hidden md:flex items-center gap-3 md:gap-6 text-[10px] md:text-xs font-pixel">
          {items.map((item) => {
            const sectionId = item.href.substring(1);
            const isActive = activeSection === sectionId;
            // Prefetch on hover for skills and quests
            const prefetchProps =
              sectionId === "skills"
                ? prefetchSkills
                : sectionId === "quests"
                  ? prefetchQuests
                  : {};
            return (
              <li key={item.href}>
                <a
                  href={item.href}
                  {...prefetchProps}
                  className={`flex items-center gap-1 transition-colors min-h-[44px] min-w-[44px] items-center justify-center ${
                    isActive ? "text-primary" : "text-foreground hover:text-primary"
                  }`}
                  aria-current={isActive ? "page" : undefined}
                >
                  <span className={isActive ? "opacity-100 text-primary" : "opacity-0 group-hover:opacity-100 text-primary"}>
                    &gt;
                  </span>
                  <span>{item.label}</span>
                </a>
              </li>
            );
          })}
        </ul>

        {/* Mobile menu */}
        <div
          className={`absolute top-full left-0 right-0 bg-bg border-b border-muted md:hidden overflow-hidden transition-all duration-300 ease-in-out ${
            isMobileMenuOpen ? "max-h-[500px] opacity-100" : "max-h-0 opacity-0"
          }`}
        >
          <ul className="flex flex-col p-4 gap-3 text-sm font-pixel">
            {items.map((item) => {
              const sectionId = item.href.substring(1);
              const isActive = activeSection === sectionId;
              return (
                <li key={item.href}>
                  <a
                    href={item.href}
                    onClick={() => setIsMobileMenuOpen(false)}
                    className={`block px-4 py-4 pixel-border bg-card min-h-[48px] flex items-center gap-3 active:scale-[0.98] transition-transform ${
                      isActive ? "text-primary" : "text-foreground"
                    }`}
                    aria-current={isActive ? "page" : undefined}
                  >
                    <span className={isActive ? "text-primary text-base" : "text-muted"}>
                      &gt;
                    </span>
                    <span>{item.label}</span>
                  </a>
                </li>
              );
            })}
          </ul>
        </div>
      </nav>
    </header>
  );
};

export default Navigation;

