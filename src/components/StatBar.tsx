import React from "react";
import type { StatBarProps } from "../types";

export const StatBar: React.FC<StatBarProps> = ({ label, value, color = "primary" }) => {
  const width = `${Math.min(Math.max(value, 0), 100)}%`;
  const fillClass =
    color === "secondary"
      ? "pixel-progress-fill-secondary"
      : color === "accent"
        ? "pixel-progress-fill-accent"
        : "pixel-progress-fill";

  return (
    <div className="space-y-1">
      <div className="flex justify-between text-xs md:text-sm font-pixel tracking-wide">
        <span>{label}</span>
        <span>LV.{value.toString().padStart(2, "0")}</span>
      </div>
      <div className="pixel-progress-track h-4 w-full">
        <div className={`${fillClass}`} style={{ width }} />
      </div>
    </div>
  );
};

