import { BackgroundVideo } from "@/components/backdrop/background-video";
import { Skyline } from "@/components/backdrop/skyline";
import { getBackgroundMedia } from "@/lib/background-media";

export function Backdrop() {
  const media = getBackgroundMedia();
  const hasVideo = Boolean(media.mp4 || media.webm);

  return (
    <div className="pointer-events-none fixed inset-x-0 top-0 -z-10 h-lvh overflow-hidden bg-black">
      <div className="backdrop-media absolute inset-0">
        {hasVideo ? <BackgroundVideo {...media} /> : <Skyline />}
      </div>
      {/* Keeps the wordmark legible on the title screen, whatever the footage. */}
      <div className="backdrop-title-shade absolute inset-0 bg-linear-to-r from-black/65 via-black/15 to-transparent" />
      <div className="absolute inset-x-0 bottom-0 h-40 bg-linear-to-t from-black/70 to-transparent" />
    </div>
  );
}
