import type { Metadata } from "next";
import Link from "next/link";

import { Button } from "@/components/ui/button";

export const metadata: Metadata = {
  title: "Page not found",
};

export default function NotFound() {
  return (
    <div
      className="screen-in flex flex-1 flex-col items-center justify-center px-6 py-16 text-center"
    >
      <h1 className="menu-type text-6xl text-destructive sm:text-8xl">Wasted</h1>
      <p className="mt-4 max-w-sm text-lg text-white/85">
        That page doesn&apos;t exist. Head back to the title screen and pick
        something from the menu.
      </p>
      <Button
        size="lg"
        className="mt-7"
        nativeButton={false}
        render={<Link href="/" />}
      >
        Back to title screen
      </Button>
    </div>
  );
}
