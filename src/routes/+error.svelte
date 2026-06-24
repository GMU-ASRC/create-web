<script lang="ts">
	import Icon from '@iconify/svelte';
	import { page } from '$app/state';

	const isNotFound = $derived(page.status === 404);
</script>

<svelte:head><title>{page.status} | CREATE Lab</title></svelte:head>

<section class="relative overflow-hidden bg-gmu-green text-white">
	<div
		class="absolute inset-0 opacity-15"
		style="background-image: radial-gradient(#ffffff 1.2px, transparent 1.2px); background-size: 20px 20px;"
	></div>
	<div class="relative mx-auto flex max-w-3xl flex-col items-center px-4 py-24 text-center">
		<Icon
			icon={isNotFound ? 'mdi:map-marker-question-outline' : 'mdi:alert-circle-outline'}
			width="56"
			class="text-gmu-gold"
		/>
		<h1 class="mt-6 text-4xl font-bold tracking-tight sm:text-5xl">
			{isNotFound ? 'Page not found' : 'Something went wrong'}
		</h1>
		<div class="mt-4 h-1 w-16 bg-gmu-gold"></div>
		<p class="mt-6 max-w-md text-white/85">
			{page.error?.message ?? 'An unexpected error occurred.'}
		</p>
		<a
			href="/"
			class="mt-8 inline-flex items-center gap-2 bg-gmu-gold px-5 py-3 text-sm font-bold text-gmu-green-dark transition-colors hover:bg-white"
		>
			<Icon icon="mdi:home-outline" width="18" />
			Back to home
		</a>
	</div>
</section>
