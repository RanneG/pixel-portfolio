import React, { useCallback, useState } from "react";
import { BiosScreen } from "./BiosScreen";
import { LoginScreen } from "./LoginScreen";
import { DesktopShell, isDesktopBootDone, markDesktopBootDone } from "./DesktopShell";
import type { BootPhase } from "./types";

function initialPhase(): BootPhase {
  return isDesktopBootDone() ? "desktop" : "bios";
}

export const DesktopExperience: React.FC = () => {
  const [phase, setPhase] = useState<BootPhase>(initialPhase);

  const enterLogin = useCallback(() => setPhase("login"), []);

  const enterDesktop = useCallback(() => {
    markDesktopBootDone();
    setPhase("desktop");
  }, []);

  if (phase === "bios") {
    return <BiosScreen onEnter={enterLogin} />;
  }

  if (phase === "login") {
    return <LoginScreen onConfirm={enterDesktop} />;
  }

  return <DesktopShell />;
};
