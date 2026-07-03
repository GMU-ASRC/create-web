<script lang="ts">
	import Icon from '@iconify/svelte';

	let { items = [] }: { items?: string[] } = $props();

	let lightbox = $state<number | null>(null);
	const current = $derived(lightbox === null ? null : items[lightbox]);

	const videoExtensions = /\.(mp4|webm|ogg|ogv|mov|m4v)$/i;

	function isVideo(src: string): boolean {
		return videoExtensions.test(src);
	}

	function open(index: number) {
		lightbox = index;
	}
	function close() {
		lightbox = null;
	}
	function step(delta: number) {
		if (lightbox === null) return;
		lightbox = (lightbox + delta + items.length) % items.length;
	}
	function onKeydown(event: KeyboardEvent) {
		if (lightbox === null) return;
		if (event.key === 'Escape') close();
		else if (event.key === 'ArrowRight') step(1);
		else if (event.key === 'ArrowLeft') step(-1);
	}
</script>

<svelte:window onkeydown={onKeydown} />

<div class="grid grid-cols-2 gap-4 sm:grid-cols-3">
	{#each items as src, index (src)}
		<button
			type="button"
			onclick={() => open(index)}
			class="group relative block aspect-square w-full overflow-hidden rounded-lg border border-slate-200 bg-slate-50"
		>
			{#if isVideo(src)}
				<video
					{src}
					muted
					preload="metadata"
					class="h-full w-full bg-slate-900 object-cover transition-transform duration-300 group-hover:scale-105"
				></video>
				<span class="pointer-events-none absolute inset-0 flex items-center justify-center text-white/90">
					<Icon icon="mdi:play-circle-outline" width="44" />
				</span>
			{:else}
				<img
					{src}
					alt=""
					loading="lazy"
					class="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
				/>
				<span
					class="pointer-events-none absolute inset-0 flex items-center justify-center bg-slate-900/0 text-white opacity-0 transition group-hover:bg-slate-900/30 group-hover:opacity-100"
				>
					<Icon icon="mdi:magnify-plus-outline" width="32" />
				</span>
			{/if}
		</button>
	{/each}
</div>

{#if current}
	<div class="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/90 p-4">
		<button type="button" class="absolute inset-0 cursor-default" aria-label="Close" onclick={close}
		></button>
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
				aria-label="Previous"
				onclick={() => step(-1)}
			>
				<Icon icon="mdi:chevron-left" width="40" />
			</button>
			<button
				type="button"
				class="absolute right-3 z-10 text-white/80 hover:text-white sm:right-6"
				aria-label="Next"
				onclick={() => step(1)}
			>
				<Icon icon="mdi:chevron-right" width="40" />
			</button>
		{/if}
		<div class="relative z-10 max-w-4xl">
			{#if isVideo(current)}
				<!-- svelte-ignore a11y_media_has_caption -->
				<video src={current} controls autoplay class="mx-auto max-h-[85vh] w-auto rounded-lg"></video>
			{:else}
				<img src={current} alt="" class="mx-auto max-h-[85vh] w-auto rounded-lg" />
			{/if}
		</div>
	</div>
{/if}
