# CREATE Lab Website

![SvelteKit](https://img.shields.io/badge/SvelteKit-FF3E00?logo=svelte&logoColor=white)
![Svelte 5](https://img.shields.io/badge/Svelte_5-FF3E00?logo=svelte&logoColor=white)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS_v4-06B6D4?logo=tailwindcss&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?logo=typescript&logoColor=white)
![Vercel](https://img.shields.io/badge/Vercel-000000?logo=vercel&logoColor=white)
![Bun](https://img.shields.io/badge/Bun-000000?logo=bun&logoColor=white)

Public website for the GMU CREATE Lab. Content is managed in the sibling [CMS](../cms) and fetched at runtime.

## Tech Stack

- SvelteKit with Svelte 5 runes
- TailwindCSS v4 (theme tokens in `src/lib/css/app.css`)
- `@sveltejs/adapter-vercel` on Vercel, `@sveltejs/adapter-static` everywhere else (see Deployment)
- `@iconify/svelte` for icons
- Bun for installing and running

The app is client-rendered (`src/routes/+layout.ts` sets `ssr = false`), fetching all content
from the CMS at runtime, with a short in-memory cache and image preloading in `src/lib/ts/cms.ts`.
A footer accessibility panel (text size, high contrast, reduce motion) can be toggled from Site Info.

## Getting Started

```bash
bun install
bun run dev      # start the dev server
bun run build    # production build
bun run preview  # preview the build
```

## Configuration

Set `PUBLIC_CMS_URL` in `.env` to the CMS URL. The client in `src/lib/ts/cms.ts` fetches all
content from it; uploaded assets are referenced as `/api/files/<id>` and resolved against that URL.

## Deployment

`vite.config.ts` picks the adapter automatically:

- On Vercel, the `VERCEL` env var is set by their build system, so `bun run build` uses
  `@sveltejs/adapter-vercel`. No extra setup needed.
- Anywhere else (e.g. your machine, CI), `bun run build` uses `@sveltejs/adapter-static` and
  produces a plain static/SPA build in `build/`, with `index.html` as the entry point and all
  routing handled client-side. A `postbuild` step copies `index.html` to `404.html` so a static
  host without rewrite rules still serves the app for direct links like `/events/some-talk`.

Before building for a static host, make sure `PUBLIC_CMS_URL` points at the real production CMS
(e.g. via a `.env.production` file), since it gets baked into the build at build time. Upload the
contents of `build/` to the host.

## Structure

- `src/routes/` page routes (`/`, `projects`, `research`, `team`, `publications`, `news`, `gallery`, plus `[slug]`/`[id]` detail pages)
- `src/lib/components/` reusable components
- `src/lib/ts/` data types and the CMS client
- `src/lib/css/app.css` Tailwind import and theme tokens
- `static/` image and icon assets
