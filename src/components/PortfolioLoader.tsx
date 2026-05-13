import React from "react";
import { createPortal } from "react-dom";
import styles from "./PortfolioLoader.module.css";

/** How long the cube overlay stays visible for shell / route transitions */
export const PORTFOLIO_LOADER_HOLD_MS = 5000;

type Props = {
  /**
   * Backdrop style: `dark` = terminal shell transitions; `browse` = Baltic layout (cream-aware).
   * Both render as a fixed full-viewport layer portaled to `document.body` so sticky nav / docks
   * do not sit above the loader.
   */
  variant?: "dark" | "browse";
};

/**
 * 3D cube spinner (Uiverse.io / AqFox). Use during shell or route transitions — not for initial
 * portfolio JSON fetch (keep first paint on the simple text loader if preferred).
 */
export const PortfolioLoader: React.FC<Props> = ({ variant = "dark" }) => {
  const root =
    variant === "browse"
      ? `${styles.portalRoot} ${styles.overlay} bg-black/70 backdrop-blur-[3px]`
      : `${styles.portalRoot} ${styles.overlay} bg-black/55 backdrop-blur-[2px]`;

  const node = (
    <div
      className={root}
      role="status"
      aria-live="polite"
      aria-busy="true"
      aria-label="Loading"
    >
      <div className={styles.spinner}>
        <div />
        <div />
        <div />
        <div />
        <div />
        <div />
      </div>
    </div>
  );

  if (typeof document === "undefined") {
    return node;
  }

  return createPortal(node, document.body);
};
