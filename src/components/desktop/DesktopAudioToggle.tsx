import React, { useEffect, useState } from "react";
import { isDesktopAudioMuted, toggleDesktopAudioMuted } from "../../utils/desktopAudio";

type Props = {
  className?: string;
};

export const DesktopAudioToggle: React.FC<Props> = ({ className }) => {
  const [muted, setMuted] = useState(isDesktopAudioMuted);

  useEffect(() => {
    setMuted(isDesktopAudioMuted());
  }, []);

  return (
    <button
      type="button"
      className={className}
      aria-pressed={muted}
      aria-label={muted ? "Unmute desktop audio" : "Mute desktop audio"}
      title={muted ? "Unmute" : "Mute"}
      onClick={() => setMuted(toggleDesktopAudioMuted())}
    >
      {muted ? "🔇" : "🔊"}
    </button>
  );
};
