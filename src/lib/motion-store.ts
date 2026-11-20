"use client";

import { useSyncExternalStore } from "react";

/**
 * Whether the background (video or animated artwork) is paused.
 * Starts paused for visitors who prefer reduced motion; an explicit choice
 * made with the toggle wins and is remembered for the browser session.
 */
const STORAGE_KEY = "background-motion";
const REDUCED_MOTION = "(prefers-reduced-motion: reduce)";

const listeners = new Set<() => void>();
let choice: boolean | null = null;

function readStoredChoice(): boolean | null {
  try {
    const stored = window.sessionStorage.getItem(STORAGE_KEY);
    if (stored === "paused") return true;
    if (stored === "playing") return false;
  } catch {
    // Storage can be unavailable (private mode, blocked cookies).
  }
  return null;
}

function getSnapshot(): boolean {
  return (
    choice ?? readStoredChoice() ?? window.matchMedia(REDUCED_MOTION).matches
  );
}

function subscribe(listener: () => void) {
  listeners.add(listener);
  const query = window.matchMedia(REDUCED_MOTION);
  query.addEventListener("change", listener);
  return () => {
    listeners.delete(listener);
    query.removeEventListener("change", listener);
  };
}

export function setMotionPaused(paused: boolean) {
  choice = paused;
  try {
    window.sessionStorage.setItem(STORAGE_KEY, paused ? "paused" : "playing");
  } catch {
    // The in-memory choice still applies until the page is reloaded.
  }
  listeners.forEach((listener) => listener());
}

export function useMotionPaused(): boolean {
  return useSyncExternalStore(subscribe, getSnapshot, () => false);
}
