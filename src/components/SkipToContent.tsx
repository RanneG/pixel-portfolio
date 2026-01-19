import React from "react";

export const SkipToContent: React.FC = () => {
  return (
    <a
      href="#main-content"
      className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-50 focus:p-4 focus:bg-primary focus:text-bg focus:font-pixel focus:text-xs focus:pixel-border focus:outline-none"
      aria-label="Skip to main content"
    >
      SKIP TO CONTENT
    </a>
  );
};

