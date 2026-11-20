"use client";

import { useEffect, useRef, useState } from "react";

import { useMotionPaused } from "@/lib/motion-store";
import { cn } from "@/lib/utils";

type BackgroundVideoProps = {
  mp4: string | null;
  webm: string | null;
  poster: string | null;
};

export function BackgroundVideo({ mp4, webm, poster }: BackgroundVideoProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const paused = useMotionPaused();
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;
    if (paused) {
      video.pause();
      return;
    }
    // React does not reliably reflect `muted` onto server-rendered markup,
    // and browsers refuse to autoplay a video that is not muted.
    video.muted = true;
    // Autoplay can still be refused (data saver, low power mode); the poster
    // or artwork underneath stays visible in that case.
    video.play().catch(() => {});
  }, [paused]);

  return (
    <video
      ref={videoRef}
      className={cn(
        "absolute inset-0 size-full object-cover transition-opacity duration-700",
        ready || poster ? "opacity-100" : "opacity-0",
      )}
      poster={poster ?? undefined}
      muted
      loop
      playsInline
      preload="auto"
      disablePictureInPicture
      aria-hidden="true"
      tabIndex={-1}
      onLoadedData={() => setReady(true)}
    >
      {webm ? <source src={webm} type="video/webm" /> : null}
      {mp4 ? <source src={mp4} type="video/mp4" /> : null}
    </video>
  );
}
