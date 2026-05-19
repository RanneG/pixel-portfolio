import React from "react";
import { useLanguage } from "../contexts/LanguageContext";
import { useSiteViewSwitch } from "../hooks/useSiteViewSwitch";
import styles from "./SiteViewToggle.module.css";

export type SiteViewToggleProps = {
  /** Floating chip (terminal) or inline in browse nav */
  variant?: "floating" | "nav";
};

function IconHome({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" aria-hidden="true" focusable="false">
      <path
        fill="currentColor"
        d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z"
      />
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

export const SiteViewToggle: React.FC<SiteViewToggleProps> = ({ variant = "floating" }) => {
  const { t } = useLanguage();
  const { siteView, switchTo } = useSiteViewSwitch();

  const isBrowse = siteView === "browse";
  const label = isBrowse ? t("siteView.openTerminal") : t("siteView.openBrowse");
  const ariaLabel = isBrowse ? t("siteView.ariaOpenTerminal") : t("siteView.ariaOpenBrowse");

  const onClick = () => switchTo(isBrowse ? "terminal" : "browse");

  if (variant === "nav") {
    if (!isBrowse) return null;
    return (
      <button
        type="button"
        className={`${styles.navBtn} site-view-nav-btn`}
        onClick={onClick}
        aria-label={ariaLabel}
      >
        <IconTerminal className={styles.navIcon} />
        <span>{label}</span>
      </button>
    );
  }

  const Icon = isBrowse ? IconTerminal : IconHome;
  const floatingClass = isBrowse ? `${styles.floating} ${styles.floatingBrowse}` : styles.floating;

  return (
    <button
      type="button"
      className={floatingClass}
      onClick={onClick}
      aria-label={ariaLabel}
      title={label}
    >
      <Icon className={styles.floatingIcon} />
      <span className={styles.floatingLabel}>{label}</span>
    </button>
  );
};
