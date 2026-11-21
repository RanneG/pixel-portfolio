# rannegerodias.com

Ranne Gerodias's portfolio, laid out like a game title screen. A full-screen backdrop sits behind a wordmark, and a menu bar along the bottom opens five screens: About Me, Projects, Roles, Skills and Contact.

Built with Next.js (App Router), TypeScript, Tailwind CSS and shadcn/ui. Every page is prerendered, so it can be hosted anywhere that runs Next.js.

## Run it locally

Requires Node.js 20.9 or newer.

```bash
npm install
npm run dev
```

Then open http://localhost:43210.

| Command | What it does |
| --- | --- |
| `npm run dev` | Development server with hot reload |
| `npm run build` | Production build |
| `npm run start` | Serve the production build |
| `npm run lint` | ESLint |
| `npm run typecheck` | Generate route types, then run TypeScript |
| `npm run video -- "clip.mp4"` | Prepare a background video (see below) |

## Background video

The backdrop plays the video in `public/media`. The clip there now is a looping night street scene: full colour on the title screen, and desaturated and dimmed behind the other screens so the text stays readable. If those files are removed, the site falls back to a built-in animated skyline.

To replace the clip, with [ffmpeg](https://ffmpeg.org/download.html) installed:

```bash
npm run video -- "path/to/your-clip.mp4"
```

This writes three files to `public/media`:

- `background.mp4`: H.264, no audio, capped at 1080p
- `background.webm`: VP9, a smaller file for browsers that support it
- `background-poster.jpg`: the first frame, shown while the video loads

Commit those files and the site uses them on the next build. You can also put files with those names in `public/media` yourself; only one of the two video formats is required.

The video is full colour on the title screen, and desaturated and dimmed behind the other screens so text stays readable. The pause button in the top bar stops the motion, and visitors whose system asks for reduced motion start with it paused.

## Editing content

All copy lives in `src/content`, separate from the layout:

| File | Contains |
| --- | --- |
| `site.ts` | Name, role, tagline, email, links, the About Me text, and the "Available for hire" switch |
| `projects.ts` | Projects, in the order they are listed |
| `roles.ts` | Work history and education |
| `skills.ts` | Skill groups, and the projects and roles each group links to as evidence |

To add a project, add an entry to the `projects` array. Its `slug` becomes the address (`/projects/<slug>`), and the page, list row, sitemap entry and any Skills links are generated from it.

## Keyboard controls

| Where | Keys |
| --- | --- |
| Title screen | `←` `→` move the cursor, `Enter` opens the item |
| Any section | `←` `→` switch section, `Esc` returns to the title screen |
| Projects (desktop) | `↑` `↓` browse the list |

## Project layout

```
src/app          Routes: title screen, one folder per section, 404 and error screens
src/components   Menu bar, top bar, project list and detail, backdrop
src/components/ui  shadcn/ui primitives
src/content      Site copy and data
src/lib          Background media lookup, motion preference store
scripts          Background video preparation
```

## Deploying

www.rannegerodias.com is the Vercel project connected to [RanneG/pixel-portfolio](https://github.com/RanneG/pixel-portfolio). A push to `main` there builds this Next.js app. `vercel.json` forces the Next.js preset and clears the old Vite output directory (`dist`). The dashboard Framework Preset stays locked while that file is present.

The canonical address used for metadata and the sitemap is `site.url` in `src/content/site.ts`. Locally, `npm run build` then `npm run start` serves the production build.
