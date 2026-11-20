import type { ProjectStatus } from "@/content/projects";
import { cn } from "@/lib/utils";

const dotColour: Record<ProjectStatus, string> = {
  "In progress": "bg-primary",
  Live: "bg-emerald-400",
  "Live demo": "bg-emerald-400",
  "Early access": "bg-sky-400",
  Shipped: "bg-current opacity-40",
};

type StatusProps = {
  status: ProjectStatus;
  className?: string;
};

export function StatusDot({ status, className }: StatusProps) {
  return (
    <span
      role="img"
      aria-label={status}
      title={status}
      className={cn("size-2 rounded-full", dotColour[status], className)}
    />
  );
}

export function StatusLabel({ status, className }: StatusProps) {
  return (
    <span className={cn("label-type flex items-center gap-2 text-white/80", className)}>
      <span
        className={cn("size-2 rounded-full", dotColour[status])}
        aria-hidden="true"
      />
      {status}
    </span>
  );
}
