import React from "react";

export const SkipToContent: React.FC = () => {
  return (
    <a
      href="#main-content"
      className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-[9999] focus:p-4 focus:bg-primary focus:text-bg focus:font-pixel focus:text-xs focus:pixel-border focus:outline-none focus:shadow-lg"
      aria-label="Skip to main content"
    >
      SKIP TO CONTENT
    </a>
  );
};

