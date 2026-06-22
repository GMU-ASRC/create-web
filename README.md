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
- `@sveltejs/adapter-vercel` for deployment
- `@iconify/svelte` for icons
- Bun for installing and running

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

## Structure

- `src/routes/` page routes (`/`, `projects`, `research`, `team`, `publications`, `news`)
- `src/lib/components/` reusable components
- `src/lib/ts/` data types and the CMS client
- `src/lib/css/app.css` Tailwind import and theme tokens
- `static/` image and icon assets
