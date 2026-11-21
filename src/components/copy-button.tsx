"use client";

import { useEffect, useState } from "react";
import { Check, Copy, TriangleAlert } from "lucide-react";

import { Button } from "@/components/ui/button";

type CopyButtonProps = {
  value: string;
  label: string;
  className?: string;
};

type CopyState = "idle" | "copied" | "failed";

export function CopyButton({ value, label, className }: CopyButtonProps) {
  const [state, setState] = useState<CopyState>("idle");

  useEffect(() => {
    if (state === "idle") return;
    const timeout = window.setTimeout(() => setState("idle"), 2200);
    return () => window.clearTimeout(timeout);
  }, [state]);

  async function copy() {
    try {
      await navigator.clipboard.writeText(value);
      setState("copied");
    } catch {
      setState("failed");
    }
  }

  return (
    <Button variant="outline" size="lg" className={className} onClick={copy}>
      {state === "copied" ? (
        <Check data-icon="inline-start" />
      ) : state === "failed" ? (
        <TriangleAlert data-icon="inline-start" />
      ) : (
        <Copy data-icon="inline-start" />
      )}
      <span aria-live="polite">
        {state === "copied"
          ? "Copied"
          : state === "failed"
            ? "Copy failed, select it instead"
            : label}
      </span>
    </Button>
  );
}
