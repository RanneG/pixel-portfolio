export type BootPhase = "bios" | "login" | "desktop";

export type DesktopWindowId =
  | "home"
  | "portfolio"
  | "contact"
  | "recycle"
  | "mycomputer"
  | "terminal"
  | "music"
  | "browser";

export interface DesktopWindowState {
  id: DesktopWindowId;
  isOpen: boolean;
  isMinimized: boolean;
  zIndex: number;
}
