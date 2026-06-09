import React, { useCallback, useState } from "react";
import { BiosScreen } from "./BiosScreen";
import { LoginScreen } from "./LoginScreen";
import { DesktopShell, isDesktopBootDone, markDesktopBootDone } from "./DesktopShell";
import { DesktopAudioToggle } from "./DesktopAudioToggle";
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

  const audioToggle = (
    <div className="win98-audio-toggle-wrap">
      <DesktopAudioToggle className="win98-audio-toggle" />
    </div>
  );

  if (phase === "bios") {
    return (
      <>
        <BiosScreen onEnter={enterLogin} />
        {audioToggle}
      </>
    );
  }

  if (phase === "login") {
    return (
      <>
        <LoginScreen onConfirm={enterDesktop} />
        {audioToggle}
      </>
    );
  }

  return <DesktopShell />;
};
