import React from "react";
import { useLanguage } from "../contexts/LanguageContext";
import { useSiteViewSwitch } from "../hooks/useSiteViewSwitch";
import type { SiteView } from "../contexts/SettingsContext";
import styles from "./SiteViewToggle.module.css";

export type SiteViewToggleProps = {
  /** Floating chip (terminal) or inline in browse nav */
  variant?: "floating" | "nav";
};

const CYCLE: SiteView[] = ["desktop", "browse", "terminal"];

function nextView(current: SiteView): SiteView {
  const i = CYCLE.indexOf(current);
  return CYCLE[(i + 1) % CYCLE.length];
}

function IconHome({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" aria-hidden="true" focusable="false">
      <path fill="currentColor" d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z" />
    </svg>
  );
}

function IconTerminal({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" aria-hidden="true" focusable="false">
      <path
        fill="currentColor"
        d="M20 4H4a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V6a2 2 0 0 0-2-2zm0 14H4V8h16v10zM6 17h8v-2H6v2zm0-4h12v-2H6v2zm0-4h12V7H6v2z"
      />
    </svg>
  );
}

function IconDesktop({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" aria-hidden="true" focusable="false">
      <path
        fill="currentColor"
        d="M21 2H3c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h7v2H8v2h8v-2h-2v-2h7c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm0 14H3V4h18v12z"
      />
    </svg>
  );
}

function labelKeyForTarget(view: SiteView): string {
  switch (view) {
    case "browse":
      return "siteView.openBrowse";
    case "terminal":
      return "siteView.openTerminal";
    case "desktop":
      return "siteView.openDesktop";
  }
}

function ariaKeyForTarget(view: SiteView): string {
  switch (view) {
    case "browse":
      return "siteView.ariaOpenBrowse";
    case "terminal":
      return "siteView.ariaOpenTerminal";
    case "desktop":
      return "siteView.ariaOpenDesktop";
  }
}

function IconForView(view: SiteView) {
  switch (view) {
    case "browse":
      return IconHome;
    case "terminal":
      return IconTerminal;
    case "desktop":
      return IconDesktop;
  }
}

export const SiteViewToggle: React.FC<SiteViewToggleProps> = ({ variant = "floating" }) => {
  const { t } = useLanguage();
  const { siteView, switchTo } = useSiteViewSwitch();

  const target = nextView(siteView);
  const label = t(labelKeyForTarget(target));
  const ariaLabel = t(ariaKeyForTarget(target));
  const onClick = () => switchTo(target);
  const Icon = IconForView(target);

  if (variant === "nav") {
    if (siteView !== "browse") return null;
    return (
      <button
        type="button"
        className={`${styles.navBtn} site-view-nav-btn`}
        onClick={onClick}
        aria-label={ariaLabel}
      >
        <Icon className={styles.navIcon} />
        <span>{label}</span>
      </button>
    );
  }

  const floatingClass =
    siteView === "browse"
      ? `${styles.floating} ${styles.floatingBrowse}`
      : siteView === "desktop"
        ? `${styles.floating} ${styles.floatingDesktop}`
        : styles.floating;

  return (
    <button type="button" className={floatingClass} onClick={onClick} aria-label={ariaLabel} title={label}>
      <Icon className={styles.floatingIcon} />
      <span className={styles.floatingLabel}>{label}</span>
    </button>
  );
};
