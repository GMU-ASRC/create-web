<script lang="ts">
	import { untrack } from 'svelte';

	let { images = [], alt = '' }: { images?: string[]; alt?: string } = $props();

	let index = $state(0);
	let restart = $state(0);

	const intervalMs = 9000;
	const slant = 22;
	const nodes = [0.16, 0.42, 0.68, 0.9];

	function goTo(target: number) {
		const count = images.length;
		if (count === 0) return;
		index = ((target % count) + count) % count;
		restart += 1;
	}

	$effect(() => {
		restart;
		const count = images.length;
		if (count <= 1) return;
		if (untrack(() => index) >= count) index = 0;
		const timer = setInterval(() => {
			index = (index + 1) % count;
		}, intervalMs);
		return () => clearInterval(timer);
	});
</script>

<div class="pointer-events-none absolute inset-y-0 right-0 hidden w-[54%] md:block">
	{#if images.length > 1}
		<div class="absolute inset-x-0 bottom-0 z-10 h-1 bg-white/25">
			{#key index}
				<div class="hero-progress h-full bg-gmu-gold" style="animation-duration: {intervalMs}ms"></div>
			{/key}
		</div>
	{/if}

	<div
		class="relative h-full w-full"
		style="clip-path: polygon({slant}% 0, 100% 0, 100% 100%, 0% 100%);"
	>
		{#each images as src, i (src + i)}
			<img
				{src}
				alt={i === index ? alt : ''}
				class="absolute inset-0 h-full w-full object-cover transition-opacity duration-[1200ms] ease-in-out"
				style:opacity={i === index ? 1 : 0}
			/>
		{/each}
	</div>

	<svg
		class="absolute inset-0 h-full w-full"
		viewBox="0 0 100 100"
		preserveAspectRatio="none"
		aria-hidden="true"
	>
		<polyline
			points="{slant},0 0,100"
			fill="none"
			stroke="var(--color-gmu-gold)"
			stroke-width="5"
			vector-effect="non-scaling-stroke"
		/>
	</svg>

	{#each nodes as t (t)}
		<span
			class="absolute h-3.5 w-3.5 -translate-x-1/2 -translate-y-1/2 rounded-full bg-gmu-gold ring-4 ring-gmu-green"
			style="left: {slant * (1 - t)}%; top: {t * 100}%;"
		></span>
	{/each}

	{#if images.length > 1}
		<div class="pointer-events-auto absolute inset-x-0 bottom-6 z-20 flex justify-center gap-2.5">
			{#each images as src, i (src + i)}
				<button
					type="button"
					onclick={() => goTo(i)}
					aria-label={`Show image ${i + 1}`}
					aria-current={i === index}
					class="h-2.5 rounded-full ring-1 ring-black/20 transition-all duration-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-gmu-gold {i === index
						? 'w-7 bg-gmu-gold'
						: 'w-2.5 bg-white/60 hover:bg-white'}"
				></button>
			{/each}
		</div>
	{/if}
</div>

<style>
	.hero-progress {
		width: 0%;
		animation-name: hero-progress-grow;
		animation-timing-function: linear;
		animation-fill-mode: forwards;
	}

	@keyframes hero-progress-grow {
		from {
			width: 0%;
		}
		to {
			width: 100%;
		}
	}

	@media (prefers-reduced-motion: reduce) {
		.hero-progress {
			animation: none;
			width: 100%;
		}
	}
</style>
