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
  className?: string;
  headerClassName?: string;
  children: React.ReactNode;
};

/** Shared frame for a menu section: heading plus content, over the dimmed backdrop. */
export function Screen({
  title,
  summary,
  fill = false,
  className,
  headerClassName,
  children,
}: ScreenProps) {
  return (
    <div
      className={cn(
        "screen-in mx-auto flex w-full max-w-6xl flex-col px-4 pt-4 pb-5 sm:px-8 sm:pt-5 lg:pt-8 lg:pb-8",
        fill ? "lg:min-h-0 lg:flex-1" : "shrink-0",
        className,
      )}
    >
      <header
        className={cn(
          "mb-4 flex flex-col items-start gap-1 lg:mb-5 lg:flex-row lg:flex-wrap lg:items-baseline lg:justify-between lg:gap-x-6",
          headerClassName,
        )}
      >
        <h1 className="menu-type text-[1.75rem] leading-none text-white sm:text-4xl">
          {title}
        </h1>
        {summary ? (
          <p className="text-sm text-white/55">{summary}</p>
        ) : null}
      </header>
      <div className={cn(fill && "lg:min-h-0 lg:flex-1")}>{children}</div>
    </div>
  );
}
