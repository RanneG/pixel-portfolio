import React, { useState, useEffect } from "react";

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
            setActiveSection(section);
            break;
          }
        }
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

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
          className="md:hidden pixel-border bg-card p-2 text-primary hover:bg-card/80"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          aria-label="Toggle mobile menu"
          aria-expanded={isMobileMenuOpen}
        >
          <span className="font-pixel text-xs">{isMobileMenuOpen ? "✕" : "☰"}</span>
        </button>

        {/* Desktop menu */}
        <ul className="hidden md:flex items-center gap-3 md:gap-6 text-[10px] md:text-xs font-pixel">
          {items.map((item) => {
            const sectionId = item.href.substring(1);
            const isActive = activeSection === sectionId;
            return (
              <li key={item.href}>
                <a
                  href={item.href}
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
        {isMobileMenuOpen && (
          <div className="absolute top-full left-0 right-0 bg-bg border-b border-muted md:hidden">
            <ul className="flex flex-col p-4 gap-2 text-xs font-pixel">
              {items.map((item) => {
                const sectionId = item.href.substring(1);
                const isActive = activeSection === sectionId;
                return (
                  <li key={item.href}>
                    <a
                      href={item.href}
                      onClick={() => setIsMobileMenuOpen(false)}
                      className={`block px-4 py-3 pixel-border bg-card min-h-[44px] flex items-center gap-2 ${
                        isActive ? "text-primary" : "text-foreground"
                      }`}
                      aria-current={isActive ? "page" : undefined}
                    >
                      <span className={isActive ? "text-primary" : "text-muted"}>
                        &gt;
                      </span>
                      <span>{item.label}</span>
                    </a>
                  </li>
                );
              })}
            </ul>
          </div>
        )}
      </nav>
    </header>
  );
};

export default Navigation;

