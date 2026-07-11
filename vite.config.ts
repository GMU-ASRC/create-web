import tailwindcss from '@tailwindcss/vite';
import adapterVercel from '@sveltejs/adapter-vercel';
import adapterStatic from '@sveltejs/adapter-static';
import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig } from 'vite';

// Vercel sets VERCEL=1 during its own builds, so `vite build` targets Vercel
// there automatically. Everywhere else (e.g. building for a static host),
// it produces a plain static/SPA build with index.html as the entry point.
const adapter = process.env.VERCEL
	? adapterVercel()
	: adapterStatic({ pages: 'build', assets: 'build', fallback: 'index.html', strict: false });

export default defineConfig({
	plugins: [
		tailwindcss(),
		sveltekit({
			compilerOptions: {
				// Force runes mode for the project, except for libraries. Can be removed in svelte 6.
				runes: ({ filename }) => filename.split(/[/\\]/).includes('node_modules') ? undefined : true
			},

			adapter
		})
	]
});
