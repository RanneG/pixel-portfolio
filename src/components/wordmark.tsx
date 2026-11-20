import { cn } from "@/lib/utils";

type WordmarkProps = {
  className?: string;
};

/** The stacked "ranne gerodias" title-screen logo. Size it with a font-size class. */
export function Wordmark({ className }: WordmarkProps) {
  return (
    <span className={cn("wordmark", className)}>
      <span>Ranne</span> <span>Gerodias</span>
    </span>
  );
}
