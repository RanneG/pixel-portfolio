import { Wordmark } from "@/components/wordmark";
import { site } from "@/content/site";

export default function TitleScreen() {
  return (
    <div className="screen-in flex flex-1 flex-col justify-center overflow-x-clip px-5 py-8 sm:px-10 lg:justify-start lg:px-16 lg:pt-[10vh] lg:pb-10">
      <div className="relative w-fit max-w-full">
        <h1>
          <Wordmark className="text-[clamp(2.7rem,12.5vw,9.5rem)]" />
        </h1>
        <p className="menu-type mt-3 inline-block -rotate-2 bg-primary px-2 py-1 text-xs text-primary-foreground shadow-[0.18em_0.18em_0_#000] sm:absolute sm:right-0 sm:-bottom-3 sm:mt-0 sm:-rotate-3 sm:px-2.5 sm:text-[clamp(0.75rem,1.9vw,1.25rem)] sm:shadow-[0.2em_0.2em_0_#000] lg:-right-6">
          {site.role}
        </p>
      </div>
      <p className="mt-5 max-w-md text-base font-medium text-white text-shadow-[0_1px_12px_rgb(0_0_0/0.7)] sm:mt-12 sm:text-xl">
        {site.tagline}
      </p>
    </div>
  );
}
