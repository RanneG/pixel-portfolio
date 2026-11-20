import { existsSync } from "node:fs";
import { join } from "node:path";

export type BackgroundMedia = {
  mp4: string | null;
  webm: string | null;
  poster: string | null;
};

const MEDIA_DIR = join(process.cwd(), "public", "media");

function publicPath(file: string): string | null {
  return existsSync(join(MEDIA_DIR, file)) ? `/media/${file}` : null;
}

/**
 * Looks for the background video in `public/media`. The site falls back to
 * the built-in artwork when no video has been added, so the files are optional.
 * `npm run video -- <file>` writes all three.
 */
export function getBackgroundMedia(): BackgroundMedia {
  return {
    mp4: publicPath("background.mp4"),
    webm: publicPath("background.webm"),
    poster: publicPath("background-poster.jpg"),
  };
}
