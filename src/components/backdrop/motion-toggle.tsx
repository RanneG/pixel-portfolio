"use client";

import { useEffect } from "react";
import { Pause, Play } from "lucide-react";

import { Button } from "@/components/ui/button";
import { setMotionPaused, useMotionPaused } from "@/lib/motion-store";

export function MotionToggle() {
  const paused = useMotionPaused();

  useEffect(() => {
    document.documentElement.dataset.motion = paused ? "paused" : "playing";
  }, [paused]);

  const label = paused ? "Play background motion" : "Pause background motion";

  return (
    <Button
      variant="ghost"
      size="icon"
      aria-label={label}
      title={label}
      className="size-10 text-white/70 hover:text-white lg:size-8"
      onClick={() => setMotionPaused(!paused)}
    >
      {paused ? <Play /> : <Pause />}
    </Button>
  );
}
