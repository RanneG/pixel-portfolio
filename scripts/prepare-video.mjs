#!/usr/bin/env node
// Prepares a background video for the site.
//
//   npm run video -- "path/to/clip.mp4"
//
// Writes three files to public/media, which the site picks up automatically:
//   background.mp4          H.264, muted, capped at 1080p, streamable
//   background.webm         VP9, smaller for browsers that support it
//   background-poster.jpg   first frame, shown while the video loads
//
// Requires ffmpeg on your PATH (https://ffmpeg.org/download.html).

import { spawnSync } from "node:child_process";
import { existsSync, mkdirSync, statSync } from "node:fs";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const input = process.argv[2];
if (!input) {
  console.error('Usage: npm run video -- "path/to/clip.mp4"');
  process.exit(1);
}

const source = resolve(input);
if (!existsSync(source)) {
  console.error(`No file found at ${source}`);
  process.exit(1);
}

const outputDir = join(dirname(fileURLToPath(import.meta.url)), "..", "public", "media");
mkdirSync(outputDir, { recursive: true });

// Never upscale, and keep dimensions even as H.264 requires.
const scale = "scale='min(1920,iw)':-2";

function ffmpeg(label, args) {
  console.log(`\n${label}`);
  const result = spawnSync("ffmpeg", ["-hide_banner", "-loglevel", "error", "-y", ...args], {
    stdio: "inherit",
  });
  if (result.error?.code === "ENOENT") {
    console.error("ffmpeg was not found. Install it from https://ffmpeg.org/download.html and try again.");
    process.exit(1);
  }
  if (result.status !== 0) {
    console.error(`ffmpeg failed while writing ${label}.`);
    process.exit(result.status ?? 1);
  }
}

const mp4 = join(outputDir, "background.mp4");
const webm = join(outputDir, "background.webm");
const poster = join(outputDir, "background-poster.jpg");

ffmpeg("background.mp4", [
  "-i", source,
  "-an",
  "-vf", scale,
  "-c:v", "libx264",
  "-profile:v", "high",
  "-pix_fmt", "yuv420p",
  "-crf", "25",
  "-preset", "slow",
  "-movflags", "+faststart",
  mp4,
]);

ffmpeg("background.webm", [
  "-i", source,
  "-an",
  "-vf", scale,
  "-c:v", "libvpx-vp9",
  "-pix_fmt", "yuv420p",
  "-crf", "34",
  "-b:v", "0",
  "-row-mt", "1",
  webm,
]);

ffmpeg("background-poster.jpg", [
  "-i", source,
  "-frames:v", "1",
  "-vf", scale,
  "-q:v", "3",
  poster,
]);

const megabytes = (file) => `${(statSync(file).size / 1024 / 1024).toFixed(1)} MB`;
console.log(`\nDone. Wrote to public/media:`);
console.log(`  background.mp4         ${megabytes(mp4)}`);
console.log(`  background.webm        ${megabytes(webm)}`);
console.log(`  background-poster.jpg  ${megabytes(poster)}`);
console.log(`\nRestart the dev server (or rebuild) to see it.`);
