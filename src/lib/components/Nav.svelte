<script lang="ts">
	import Icon from '@iconify/svelte';
	import { page } from '$app/state';
	import { siteNav, basePath } from '$lib/ts/site';

	let { siteName = '', logo = '/create_logo.png' }: { siteName?: string; logo?: string } = $props();

	let menuOpen = $state(false);

	const homeHref = basePath || '/';

	function linkHref(path: string): string {
		return path ? `/${path}` : homeHref;
	}

	function isActive(path: string): boolean {
		const pathname = page.url.pathname;
		if (path === '') return pathname === '/';
		return pathname.startsWith(`/${path}`);
	}
</script>

<header class="sticky top-0 z-50 border-b border-slate-200 bg-white/90 backdrop-blur">
	<div class="h-1 w-full bg-gmu-green"></div>
	<nav class="mx-auto flex max-w-7xl items-center justify-between px-4 py-4">
		<a href={homeHref} class="flex items-center gap-2">
			<img src={logo} alt="" class="h-9 w-auto" />
			<span class="text-lg font-bold tracking-tight text-slate-900">{siteName}</span>
		</a>

		<button
			class="p-2 text-slate-700 md:hidden"
			aria-label="Toggle navigation"
			onclick={() => (menuOpen = !menuOpen)}
		>
			<Icon icon={menuOpen ? 'mdi:close' : 'mdi:menu'} width="24" />
		</button>

		<ul class="hidden items-center gap-6 md:flex">
			{#each siteNav as link (link.path)}
				<li>
					<a
						href={linkHref(link.path)}
						class="text-sm font-medium text-slate-600 transition-colors hover:text-gmu-green"
						class:text-gmu-green={isActive(link.path)}
					>
						{link.label}
					</a>
				</li>
			{/each}
		</ul>
	</nav>

	{#if menuOpen}
		<ul class="border-t border-slate-200 px-4 pb-3 md:hidden">
			{#each siteNav as link (link.path)}
				<li>
					<a
						href={linkHref(link.path)}
						class="block py-2 text-sm font-medium text-slate-600 hover:text-gmu-green"
						class:text-gmu-green={isActive(link.path)}
						onclick={() => (menuOpen = false)}
					>
						{link.label}
					</a>
				</li>
			{/each}
		</ul>
	{/if}
</header>
