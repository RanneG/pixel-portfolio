import { Wordmark } from "@/components/wordmark";
import { site } from "@/content/site";

export default function TitleScreen() {
  return (
    <div
      className="screen-in flex flex-1 flex-col justify-start px-5 pt-[8vh] pb-10 sm:px-10 lg:px-16 lg:pt-[10vh]"
    >
      <div className="relative w-fit">
        <h1>
          <Wordmark className="text-[clamp(3.25rem,13.5vw,9.5rem)]" />
        </h1>
        <p className="menu-type absolute right-0 -bottom-3 -rotate-3 bg-primary px-2.5 py-1 text-[clamp(0.75rem,1.9vw,1.25rem)] text-primary-foreground shadow-[0.2em_0.2em_0_#000] sm:-right-6">
          {site.role}
        </p>
      </div>
      <p className="mt-10 max-w-md text-lg font-medium text-white text-shadow-[0_1px_12px_rgb(0_0_0/0.7)] sm:text-xl lg:mt-12">
        {site.tagline}
      </p>
    </div>
  );
}
