import { cn } from "@/lib/utils";

type ScreenProps = {
  title: string;
  /** Short line of context shown beside the title. */
  summary?: string;
  /**
   * On large screens, fit the screen to the viewport and let its panels
   * scroll on their own, instead of scrolling the whole screen.
   */
  fill?: boolean;
  children: React.ReactNode;
};

/** Shared frame for a menu section: heading plus content, over the dimmed backdrop. */
export function Screen({ title, summary, fill = false, children }: ScreenProps) {
  return (
    <div
      className={cn(
        "screen-in mx-auto flex w-full max-w-6xl flex-col px-4 pt-5 pb-6 sm:px-8 lg:pt-8 lg:pb-8",
        fill ? "lg:min-h-0 lg:flex-1" : "shrink-0",
      )}
    >
      <header className="mb-4 flex flex-wrap items-baseline justify-between gap-x-6 gap-y-1 lg:mb-5">
        <h1 className="menu-type text-3xl text-white sm:text-4xl">{title}</h1>
        {summary ? (
          <p className="text-sm text-muted-foreground">{summary}</p>
        ) : null}
      </header>
      <div className={cn(fill && "lg:min-h-0 lg:flex-1")}>{children}</div>
    </div>
  );
}
