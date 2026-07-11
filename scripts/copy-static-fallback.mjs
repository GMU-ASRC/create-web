import { existsSync, copyFileSync } from 'node:fs';

if (!process.env.VERCEL) {
	const source = 'build/index.html';
	const target = 'build/404.html';
	if (existsSync(source)) {
		copyFileSync(source, target);
		console.log('Copied build/index.html to build/404.html for static host deep-link fallback.');
	}
}
