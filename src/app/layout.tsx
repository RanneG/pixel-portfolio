import { Suspense } from "react";
import type { Metadata, Viewport } from "next";
import { Archivo } from "next/font/google";

import { Backdrop } from "@/components/backdrop/backdrop";
import { MotionToggle } from "@/components/backdrop/motion-toggle";
import { MenuBar } from "@/components/menu-bar";
import { TopBar } from "@/components/top-bar";
import { site } from "@/content/site";

import "./globals.css";

const archivo = Archivo({
  variable: "--font-archivo",
  subsets: ["latin"],
  axes: ["wdth"],
});

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: {
    default: `${site.name} — ${site.role}`,
    template: `%s — ${site.name}`,
  },
  description: site.description,
  openGraph: {
    type: "website",
    siteName: site.name,
    title: `${site.name} — ${site.role}`,
    description: site.description,
    url: site.url,
  },
  twitter: { card: "summary_large_image" },
};

// Every route is content known at build time, so the whole site is prerendered.
export const ensureStatic = "navigation";

export const viewport: Viewport = {
  themeColor: "#000000",
  colorScheme: "dark",
  viewportFit: "cover",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en-GB" className={`${archivo.variable} dark h-full antialiased`}>
      {/* Small screens scroll the page between two sticky bars; large screens
          are a fixed, game-style viewport where the content area scrolls. */}
      <body className="flex min-h-dvh flex-col lg:h-dvh lg:overflow-hidden">
        <a
          href="#content"
          className="sr-only focus:not-sr-only focus:fixed focus:top-2 focus:left-2 focus:z-50 focus:bg-primary focus:px-3 focus:py-2 focus:text-sm focus:font-semibold focus:text-primary-foreground"
        >
          Skip to content
        </a>
        <Backdrop />
        <Suspense fallback={<div className="sticky top-0 h-11 shrink-0 bg-black" />}>
          <TopBar actions={<MotionToggle />} />
        </Suspense>
        <main
          id="content"
          className="flex flex-1 flex-col lg:min-h-0 lg:overflow-y-auto"
        >
          {children}
        </main>
        <Suspense
          fallback={<div className="sticky bottom-0 h-14 shrink-0 bg-black lg:h-16" />}
        >
          <MenuBar />
        </Suspense>
      </body>
    </html>
  );
}
