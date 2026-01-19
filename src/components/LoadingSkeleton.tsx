import React from "react";

interface LoadingSkeletonProps {
  type?: "card" | "bar" | "text";
  className?: string;
}

export const LoadingSkeleton: React.FC<LoadingSkeletonProps> = ({
  type = "card",
  className = ""
}) => {
  if (type === "card") {
    return (
      <div
        className={`pixel-border bg-card p-4 md:p-6 animate-pulse ${className}`}
        aria-label="Loading..."
      >
        <div className="h-4 bg-muted/30 rounded-none mb-3 w-3/4" />
        <div className="h-3 bg-muted/20 rounded-none mb-2 w-full" />
        <div className="h-3 bg-muted/20 rounded-none mb-2 w-5/6" />
        <div className="h-8 bg-muted/20 rounded-none w-1/2 mt-4" />
      </div>
    );
  }

  if (type === "bar") {
    return (
      <div
        className={`pixel-progress-track h-4 w-full animate-pulse ${className}`}
        aria-label="Loading..."
      >
        <div className="h-full bg-muted/30 w-3/4" />
      </div>
    );
  }

  return (
    <div
      className={`h-4 bg-muted/30 rounded-none animate-pulse w-3/4 ${className}`}
      aria-label="Loading..."
    />
  );
};

export const QuestLogSkeleton: React.FC = () => {
  return (
    <div className="grid gap-4 md:gap-5 md:grid-cols-2">
      {[1, 2, 3].map((i) => (
        <LoadingSkeleton key={i} type="card" />
      ))}
    </div>
  );
};

export const SkillInventorySkeleton: React.FC = () => {
  return (
    <div className="grid gap-4 md:gap-5 md:grid-cols-2">
      {[1, 2, 3, 4].map((i) => (
        <div key={i} className="pixel-border bg-card p-4 md:p-6 animate-pulse">
          <div className="flex justify-between mb-3">
            <div className="h-4 bg-muted/30 rounded-none w-24" />
            <div className="h-3 bg-muted/20 rounded-none w-20" />
          </div>
          <LoadingSkeleton type="bar" className="mb-3" />
          <div className="space-y-2">
            <LoadingSkeleton type="bar" />
            <LoadingSkeleton type="bar" />
            <LoadingSkeleton type="bar" />
          </div>
        </div>
      ))}
    </div>
  );
};

