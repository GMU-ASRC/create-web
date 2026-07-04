<script lang="ts">
	import { onMount } from 'svelte';
	import { page } from '$app/state';
	import Icon from '@iconify/svelte';
	import Seo from '$lib/components/Seo.svelte';
	import PageHero from '$lib/components/PageHero.svelte';
	import LoadState from '$lib/components/LoadState.svelte';
	import SkeletonGrid from '$lib/components/SkeletonGrid.svelte';
	import Img from '$lib/components/Img.svelte';
	import { cms, preloadImages } from '$lib/ts/cms';
	import type { GalleryItem } from '$lib/ts/gallery';

	let items = $state<GalleryItem[]>([]);
	let loading = $state(true);
	let lightbox = $state<number | null>(null);

	const current = $derived(lightbox === null ? null : items[lightbox]);

	const videoExtensions = /\.(mp4|webm|ogg|ogv|mov|m4v)$/i;

	function isVideo(item: GalleryItem): boolean {
		if (item.type) return item.type.startsWith('video/');
		return videoExtensions.test(item.image);
	}

	onMount(async () => {
		items = (await cms.gallery()) ?? [];
		preloadImages(items.filter((item) => !isVideo(item)).map((item) => item.image));
		loading = false;
	});

	const zoomSteps = [1, 2, 3];
	let zoomIndex = $state(0);
	let zoomOrigin = $state('center center');
	const zoomScale = $derived(zoomSteps[zoomIndex]);

	function zoomAt(event: MouseEvent) {
		event.stopPropagation();
		const img = event.currentTarget as HTMLImageElement;
		const rect = img.getBoundingClientRect();
		zoomOrigin = `${((event.clientX - rect.left) / rect.width) * 100}% ${((event.clientY - rect.top) / rect.height) * 100}%`;
		zoomIndex = (zoomIndex + 1) % zoomSteps.length;
	}
	function resetZoom() {
		zoomIndex = 0;
		zoomOrigin = 'center center';
	}

	function open(index: number) {
		lightbox = index;
		resetZoom();
	}
	function close() {
		lightbox = null;
		resetZoom();
	}
	function step(delta: number) {
		if (lightbox === null) return;
		lightbox = (lightbox + delta + items.length) % items.length;
		resetZoom();
	}
	function onKeydown(event: KeyboardEvent) {
		if (lightbox === null) return;
		if (event.key === 'Escape') close();
		else if (event.key === 'ArrowRight') step(1);
		else if (event.key === 'ArrowLeft') step(-1);
	}
</script>

<svelte:window onkeydown={onKeydown} />

<Seo
	brand="CREATE Lab"
	title="Gallery"
	description="Photos from the CREATE Lab at George Mason University."
	url={page.url.href}
/>

<PageHero eyebrow="Gallery" title="Gallery" />

<section class="mx-auto max-w-7xl px-4 py-16">
	{#if loading}
		<SkeletonGrid variant="gallery" count={8} grid="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4" />
	{:else if items.length === 0}
		<LoadState loading={false} empty="No gallery images yet." />
	{:else}
		<div class="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
			{#each items as item, index (index)}
				<button
					type="button"
					onclick={() => open(index)}
					class="group relative block aspect-square w-full overflow-hidden rounded-lg border border-slate-200 bg-slate-50"
				>
					{#if isVideo(item)}
						<video
							src={item.image}
							muted
							preload="metadata"
							class="h-full w-full bg-slate-900 object-cover transition-transform duration-300 group-hover:scale-105"
						></video>
						<span class="pointer-events-none absolute inset-0 flex items-center justify-center text-white/90">
							<Icon icon="mdi:play-circle-outline" width="48" />
						</span>
					{:else}
						<Img
							src={item.image}
							alt={item.title ?? ''}
							loading="lazy"
							class="h-full w-full object-cover group-hover:scale-105"
						/>
					{/if}
					{#if item.title}
						<p
							class="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/70 to-transparent px-3 pt-8 pb-2 text-left text-sm text-white"
						>
							{item.title}
						</p>
					{/if}
				</button>
			{/each}
		</div>
	{/if}
</section>

{#if current}
	<div class="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/90 p-4">
		<button type="button" class="absolute inset-0 cursor-default" aria-label="Close" onclick={close}></button>
		<button
			type="button"
			class="absolute top-4 right-4 z-10 text-white/80 hover:text-white"
			aria-label="Close"
			onclick={close}
		>
			<Icon icon="mdi:close" width="28" />
		</button>
		{#if items.length > 1}
			<button
				type="button"
				class="absolute left-3 z-10 text-white/80 hover:text-white sm:left-6"
				aria-label="Previous image"
				onclick={() => step(-1)}
			>
				<Icon icon="mdi:chevron-left" width="40" />
			</button>
			<button
				type="button"
				class="absolute right-3 z-10 text-white/80 hover:text-white sm:right-6"
				aria-label="Next image"
				onclick={() => step(1)}
			>
				<Icon icon="mdi:chevron-right" width="40" />
			</button>
		{/if}
		<figure class="relative z-10 flex max-w-4xl flex-col items-center overflow-hidden">
			{#if isVideo(current)}
				<!-- svelte-ignore a11y_media_has_caption -->
				<video
					src={current.image}
					controls
					autoplay
					class="mx-auto max-h-[85vh] w-auto rounded-lg"
				></video>
			{:else}
				<!-- svelte-ignore a11y_click_events_have_key_events -->
				<!-- svelte-ignore a11y_no_noninteractive_element_interactions -->
				<img
					src={current.image}
					alt={current.title ?? ''}
					onclick={zoomAt}
					style="transform: scale({zoomScale}); transform-origin: {zoomOrigin};"
					class="max-h-[85vh] w-auto rounded-lg transition-transform duration-200 {zoomIndex ===
					zoomSteps.length - 1
						? 'cursor-zoom-out'
						: 'cursor-zoom-in'}"
				/>
			{/if}
			{#if current.title}
				<figcaption class="mt-3 text-center text-sm text-white/80">{current.title}</figcaption>
			{/if}
		</figure>
	</div>
{/if}
