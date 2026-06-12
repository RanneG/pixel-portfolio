/**
 * Make the static RANNE.EXE landing the real site root.
 *
 * Vercel checks the filesystem before rewrites, so a rewrite from "/" can
 * never shadow the built index.html. Instead: the SPA entry becomes app.html
 * (vercel.json catch-all rewrite targets it) and the landing page from
 * public/exe/ becomes the root index.html.
 */
import { copyFileSync, renameSync, existsSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const dist = join(dirname(fileURLToPath(import.meta.url)), "..", "dist");
const spaIndex = join(dist, "index.html");
const appHtml = join(dist, "app.html");
const exeIndex = join(dist, "exe", "index.html");

if (!existsSync(spaIndex)) throw new Error("dist/index.html missing — run vite build first");
if (!existsSync(exeIndex)) throw new Error("dist/exe/index.html missing — public/exe not copied");

renameSync(spaIndex, appHtml);
copyFileSync(exeIndex, spaIndex);
console.log("postbuild: SPA -> /app.html, RANNE.EXE landing -> /index.html");
