/**
 * Matrix rain — adapted from Uiverse.io (author: whoisyourdeadie).
 */
import React, { useEffect, useMemo, useState } from "react";
import styles from "./MatrixBackground.module.css";

const VARIANT_CLASS = [
  styles.variant0,
  styles.variant1,
  styles.variant2,
  styles.variant3,
  styles.variant4,
] as const;

function columnCountForWidth(w: number): number {
  if (w <= 480) return 18;
  if (w <= 768) return 28;
  return 40;
}

function delayForIndex(i: number): string {
  const base = -4 + (i % 17) * 0.25;
  return `${base.toFixed(2)}s`;
}

function durationForIndex(i: number): string {
  const d = 2.3 + (i % 13) * 0.15;
  return `${d.toFixed(2)}s`;
}

export const MatrixBackground: React.FC = () => {
  const [reducedMotion, setReducedMotion] = useState(false);
  const [width, setWidth] = useState(
    typeof window !== "undefined" ? window.innerWidth : 1024
  );

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const update = () => setReducedMotion(mq.matches);
    update();
    mq.addEventListener("change", update);
    return () => mq.removeEventListener("change", update);
  }, []);

  useEffect(() => {
    const onResize = () => setWidth(window.innerWidth);
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  const colCount = columnCountForWidth(width);

  const columns = useMemo(() => {
    return Array.from({ length: colCount }, (_, i) => ({
      key: i,
      variant: VARIANT_CLASS[i % VARIANT_CLASS.length] ?? styles.variant0,
      leftPct: (i / colCount) * 100,
      delay: delayForIndex(i),
      duration: durationForIndex(i),
    }));
  }, [colCount]);

  return (
    <div
      className={`${styles.matrixContainer} ${reducedMotion ? styles.reducedMotion : ""}`}
      aria-hidden="true"
    >
      <div className={styles.matrixPattern}>
        {columns.map((c) => (
          <div
            key={c.key}
            className={`${styles.matrixColumn} ${c.variant}`}
            style={{
              left: `${c.leftPct}%`,
              animationDelay: reducedMotion ? undefined : c.delay,
              animationDuration: reducedMotion ? undefined : c.duration,
            }}
          />
        ))}
      </div>
    </div>
  );
};
