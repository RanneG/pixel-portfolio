import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  cacheComponents: true,
  partialPrefetching: true,
  // Lets the dev server be opened at 127.0.0.1 as well as localhost.
  allowedDevOrigins: ["127.0.0.1"],
  // The menu bars use every corner of the screen, so the dev badge would cover them.
  devIndicators: false,
  turbopack: {
    rules: {
      "*.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },
};

export default nextConfig;
