import tailwindcss from '@tailwindcss/vite';
import adapterVercel from '@sveltejs/adapter-vercel';
import adapterStatic from '@sveltejs/adapter-static';
import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig, loadEnv } from 'vite';

// Vercel sets VERCEL=1 during its own builds, so `vite build` targets Vercel
// there automatically, served from the domain root. Everywhere else (e.g.
// building for a static host), it produces a plain static/SPA build with
// index.html as the entry point, served from BASE_PATH if the host needs
// a subfolder (e.g. a university personal-page server at /~username).
export default defineConfig(({ mode }) => {
	const env = loadEnv(mode, process.cwd(), '');
	const onVercel = Boolean(process.env.VERCEL);
	const adapter = onVercel
		? adapterVercel()
		: adapterStatic({ pages: 'build', assets: 'build', fallback: 'index.html', strict: false });
	const base = onVercel ? '' : (env.BASE_PATH ?? '');

	return {
		plugins: [
			tailwindcss(),
			sveltekit({
				compilerOptions: {
					// Force runes mode for the project, except for libraries. Can be removed in svelte 6.
					runes: ({ filename }) => filename.split(/[/\\]/).includes('node_modules') ? undefined : true
				},

				adapter,
				paths: { base }
			})
		]
	};
});
