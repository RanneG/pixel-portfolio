"use client";

import { Button } from "@/components/ui/button";

type ErrorProps = {
  error: unknown;
  retry: () => void;
};

export default function ErrorScreen({ retry }: ErrorProps) {
  return (
    <div
      className="screen-in flex flex-1 flex-col items-center justify-center px-6 py-16 text-center"
    >
      <h1 className="menu-type text-4xl text-white sm:text-5xl">Mission failed</h1>
      <p className="mt-4 max-w-sm text-lg text-white/85">
        Something went wrong while loading this screen.
      </p>
      <Button size="lg" className="mt-7" onClick={() => retry()}>
        Try again
      </Button>
    </div>
  );
}
