import React, { useCallback, useMemo, useState } from "react";
import { usePortfolioData } from "../../contexts/PortfolioDataContext";
import { useLanguage } from "../../contexts/LanguageContext";
import { Win98Window } from "./Win98Window";
import { CrtOverlay } from "./CrtOverlay";
import { HomeWindowContent } from "./windows/HomeWindowContent";
import { PortfolioWindowContent } from "./windows/PortfolioWindowContent";
import { ContactWindowContent } from "./windows/ContactWindowContent";
import { RecycleBinContent } from "./windows/RecycleBinContent";
import { MyComputerContent } from "./windows/MyComputerContent";
import { TerminalWindowContent } from "./windows/TerminalWindowContent";
import { MusicWindowContent } from "./windows/MusicWindowContent";
import { BrowserWindowContent } from "./windows/BrowserWindowContent";
import type { DesktopWindowId, DesktopWindowState } from "./types";

const BOOT_DONE_KEY = "portfolio-desktop-boot-done";

const WINDOW_LAYOUT: Record<
  DesktopWindowId,
  { titleKey: string; defaultStyle: React.CSSProperties; status?: (count: number) => string }
> = {
  home: {
    titleKey: "desktop.windows.home",
    defaultStyle: { top: 40, left: "50%", transform: "translateX(-50%)", width: "min(720px, calc(100vw - 24px))", height: "min(520px, calc(100dvh - 80px))" }
  },
  portfolio: {
    titleKey: "desktop.windows.portfolio",
    defaultStyle: { top: 60, left: 24, width: "min(480px, calc(100vw - 48px))", height: "min(440px, calc(100dvh - 100px))" },
    status: (n) => `${n} project(s)`
  },
  contact: {
    titleKey: "desktop.windows.contact",
    defaultStyle: { top: 80, left: "50%", transform: "translateX(-30%)", width: "min(400px, calc(100vw - 48px))", height: 320 }
  },
  recycle: {
    titleKey: "desktop.windows.recycle",
    defaultStyle: { top: 100, left: "50%", transform: "translateX(-20%)", width: "min(420px, calc(100vw - 48px))", height: 300 },
    status: (n) => `${n} object(s)`
  },
  mycomputer: {
    titleKey: "desktop.windows.myComputer",
    defaultStyle: { top: 48, left: 100, width: 340, height: 260 }
  },
  terminal: {
    titleKey: "desktop.windows.terminal",
    defaultStyle: {
      top: 88,
      left: 56,
      width: "min(640px, calc(100vw - 48px))",
      height: "min(400px, calc(100dvh - 100px))"
    },
    status: () => "ranne@portfolio"
  },
  music: {
    titleKey: "desktop.windows.music",
    defaultStyle: {
      top: 56,
      left: "50%",
      transform: "translateX(-50%)",
      width: "min(380px, calc(100vw - 32px))",
      height: "min(520px, calc(100dvh - 80px))"
    },
    status: () => "404 object(s)"
  },
  browser: {
    titleKey: "desktop.windows.browser",
    defaultStyle: {
      top: 64,
      left: "50%",
      transform: "translateX(-42%)",
      width: "min(520px, calc(100vw - 32px))",
      height: "min(460px, calc(100dvh - 80px))"
    },
    status: () => "Offline"
  }
};

function initialWindows(): DesktopWindowState[] {
  return [
    { id: "home", isOpen: true, isMinimized: false, zIndex: 10 },
    { id: "portfolio", isOpen: false, isMinimized: false, zIndex: 5 },
    { id: "contact", isOpen: false, isMinimized: false, zIndex: 5 },
    { id: "recycle", isOpen: false, isMinimized: false, zIndex: 5 },
    { id: "mycomputer", isOpen: false, isMinimized: false, zIndex: 5 },
    { id: "terminal", isOpen: false, isMinimized: false, zIndex: 5 },
    { id: "music", isOpen: false, isMinimized: false, zIndex: 5 },
    { id: "browser", isOpen: false, isMinimized: false, zIndex: 5 }
  ];
}

export const DesktopShell: React.FC = () => {
  const { data } = usePortfolioData();
  const { t } = useLanguage();
  const [windows, setWindows] = useState<DesktopWindowState[]>(initialWindows);
  const [activeId, setActiveId] = useState<DesktopWindowId>("home");
  const [topZ, setTopZ] = useState(10);

  const projectCount = data.projects?.length ?? 0;

  const focusWindow = useCallback((id: DesktopWindowId) => {
    setActiveId(id);
    setTopZ((z) => {
      const nextZ = z + 1;
      setWindows((prev) =>
        prev.map((w) =>
          w.id === id ? { ...w, isOpen: true, isMinimized: false, zIndex: nextZ } : w
        )
      );
      return nextZ;
    });
  }, []);

  const openWindow = useCallback(
    (id: DesktopWindowId) => {
      focusWindow(id);
    },
    [focusWindow]
  );

  const minimizeWindow = useCallback((id: DesktopWindowId) => {
    setWindows((prev) => prev.map((w) => (w.id === id ? { ...w, isMinimized: true } : w)));
  }, []);

  const closeWindow = useCallback(
    (id: DesktopWindowId) => {
      if (id === "home") {
        minimizeWindow("home");
        return;
      }
      setWindows((prev) => {
        const next = prev.map((w) => (w.id === id ? { ...w, isOpen: false } : w));
        setActiveId((current) => {
          if (current !== id) return current;
          const remaining = next.filter((w) => w.isOpen && !w.isMinimized);
          return remaining.length > 0 ? remaining[remaining.length - 1].id : "home";
        });
        return next;
      });
    },
    [minimizeWindow]
  );

  const toggleTaskbar = useCallback(
    (id: DesktopWindowId) => {
      const win = windows.find((w) => w.id === id);
      if (!win?.isOpen) {
        openWindow(id);
        return;
      }
      if (win.isMinimized) {
        focusWindow(id);
        return;
      }
      if (activeId === id) {
        minimizeWindow(id);
      } else {
        focusWindow(id);
      }
    },
    [windows, activeId, openWindow, focusWindow, minimizeWindow]
  );

  const taskbarWindows = useMemo(
    () =>
      (["home", "portfolio", "contact", "terminal"] as const).map((id) => ({
        id,
        label: t(WINDOW_LAYOUT[id].titleKey)
      })),
    [t]
  );

  const desktopIcons = useMemo(
    () => [
      { id: "mycomputer" as const, glyph: "🖥️", label: t("desktop.icons.myComputer") },
      { id: "portfolio" as const, glyph: "📁", label: t("desktop.icons.portfolio") },
      { id: "terminal" as const, glyph: "⌨️", label: t("desktop.icons.terminal") },
      { id: "music" as const, glyph: "💿", label: t("desktop.icons.music") },
      { id: "browser" as const, glyph: "🌐", label: t("desktop.icons.browser") }
    ],
    [t]
  );

  const renderWindowContent = (id: DesktopWindowId) => {
    switch (id) {
      case "home":
        return (
          <HomeWindowContent
            onOpenPortfolio={() => openWindow("portfolio")}
            onOpenContact={() => openWindow("contact")}
          />
        );
      case "portfolio":
        return <PortfolioWindowContent />;
      case "contact":
        return <ContactWindowContent />;
      case "recycle":
        return <RecycleBinContent />;
      case "mycomputer":
        return <MyComputerContent />;
      case "terminal":
        return <TerminalWindowContent />;
      case "music":
        return <MusicWindowContent />;
      case "browser":
        return <BrowserWindowContent />;
      default:
        return null;
    }
  };

  const statusFor = (id: DesktopWindowId): string | undefined => {
    const cfg = WINDOW_LAYOUT[id];
    if (id === "portfolio" && cfg.status) return cfg.status(projectCount);
    if (id === "recycle" && cfg.status) return cfg.status(5);
    if (id === "home") return `${projectCount + 12} object(s)`;
    if (id === "terminal" && cfg.status) return cfg.status(projectCount);
    if (id === "music" && cfg.status) return cfg.status(projectCount);
    if (id === "browser" && cfg.status) return cfg.status(projectCount);
    return undefined;
  };

  return (
    <div className="win98-root win98-desktop" role="main" id="main-content">
      <div className="win98-desktop-icons">
        {desktopIcons.map((icon) => (
          <button
            key={icon.label}
            type="button"
            className="win98-icon-btn"
            onDoubleClick={() => {
              if ("action" in icon && icon.action) icon.action();
              else if ("id" in icon) openWindow(icon.id);
            }}
            onClick={() => {
              if ("id" in icon && icon.id) openWindow(icon.id);
            }}
          >
            <span className="win98-icon-glyph" aria-hidden>
              {icon.glyph}
            </span>
            <span>{icon.label}</span>
          </button>
        ))}
      </div>

      <div className="win98-desktop-icon-tr">
        <button
          type="button"
          className="win98-icon-btn"
          onDoubleClick={() => openWindow("recycle")}
          onClick={() => openWindow("recycle")}
        >
          <span className="win98-icon-glyph" aria-hidden>
            🗑️
          </span>
          <span>{t("desktop.icons.recycle")}</span>
        </button>
      </div>

      {windows.map((win) => {
        if (!win.isOpen || win.isMinimized) return null;
        const cfg = WINDOW_LAYOUT[win.id];
        return (
          <Win98Window
            key={win.id}
            title={t(cfg.titleKey)}
            isActive={activeId === win.id}
            onFocus={() => focusWindow(win.id)}
            onClose={() => closeWindow(win.id)}
            onMinimize={() => minimizeWindow(win.id)}
            statusText={statusFor(win.id)}
            flushContent={win.id === "terminal"}
            style={{ ...cfg.defaultStyle, zIndex: win.zIndex }}
          >
            {renderWindowContent(win.id)}
          </Win98Window>
        );
      })}

      <nav className="win98-taskbar" aria-label="Taskbar">
        {taskbarWindows.map(({ id, label }) => {
          const win = windows.find((w) => w.id === id);
          const isActive = win?.isOpen && !win.isMinimized && activeId === id;
          return (
            <button
              key={id}
              type="button"
              className={`win98-taskbar-btn${isActive ? " win98-taskbar-btn-active" : ""}`}
              onClick={() => toggleTaskbar(id)}
            >
              <span aria-hidden>
                {id === "home"
                  ? "🏠"
                  : id === "portfolio"
                    ? "📁"
                    : id === "terminal"
                      ? "⌨️"
                      : "✉️"}
              </span>
              {label}
            </button>
          );
        })}
        <div className="win98-taskbar-tray" aria-hidden>
          <span>RG</span>
        </div>
      </nav>

      <CrtOverlay />
    </div>
  );
};

export function markDesktopBootDone(): void {
  try {
    sessionStorage.setItem(BOOT_DONE_KEY, "1");
  } catch {
    /* ignore */
  }
}

export function isDesktopBootDone(): boolean {
  try {
    return sessionStorage.getItem(BOOT_DONE_KEY) === "1";
  } catch {
    return false;
  }
}
