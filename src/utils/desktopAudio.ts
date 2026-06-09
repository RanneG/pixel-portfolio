const MUTE_KEY = "portfolio-desktop-audio-muted";

let muted = false;

function loadMuted(): boolean {
  try {
    return localStorage.getItem(MUTE_KEY) === "1";
  } catch {
    return false;
  }
}

function persistMuted(value: boolean): void {
  try {
    localStorage.setItem(MUTE_KEY, value ? "1" : "0");
  } catch {
    /* ignore */
  }
}

muted = loadMuted();

if (typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
  muted = true;
}

export function isDesktopAudioMuted(): boolean {
  return muted;
}

export function setDesktopAudioMuted(value: boolean): void {
  muted = value;
  persistMuted(value);
}

export function toggleDesktopAudioMuted(): boolean {
  setDesktopAudioMuted(!muted);
  return muted;
}

/** Play a pre-baked clip from /public/audio (no API calls). */
export function playDesktopClip(src: string, volume = 0.85): void {
  if (muted || typeof window === "undefined") return;
  try {
    const audio = new Audio(src);
    audio.volume = Math.max(0, Math.min(1, volume));
    void audio.play().catch(() => {
      /* autoplay policy — user can unmute and retry on next interaction */
    });
  } catch {
    /* ignore */
  }
}
