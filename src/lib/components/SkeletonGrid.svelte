<script lang="ts">
	type Variant = 'card' | 'person' | 'gallery' | 'list';

	let {
		variant = 'card',
		count = 6,
		grid = 'grid gap-6 sm:grid-cols-2 lg:grid-cols-3'
	}: { variant?: Variant; count?: number; grid?: string } = $props();

	const items = $derived(Array.from({ length: count }));
</script>

{#if variant === 'list'}
	<ul class="divide-y divide-slate-200 border-y border-slate-200">
		{#each items as _, index (index)}
			<li class="flex flex-col gap-2 py-6 sm:flex-row sm:gap-6">
				<div class="h-3 w-24 shrink-0 animate-pulse rounded bg-slate-200"></div>
				<div class="flex flex-1 flex-col gap-2">
					<div class="h-4 w-2/3 animate-pulse rounded bg-slate-200"></div>
					<div class="h-3 w-full animate-pulse rounded bg-slate-200"></div>
					<div class="h-3 w-5/6 animate-pulse rounded bg-slate-200"></div>
				</div>
			</li>
		{/each}
	</ul>
{:else}
	<div class={grid}>
		{#each items as _, index (index)}
			{#if variant === 'gallery'}
				<div class="aspect-square animate-pulse rounded-lg bg-slate-200"></div>
			{:else}
				<div class="flex flex-col overflow-hidden border border-slate-200 bg-white shadow-sm">
					<div
						class="animate-pulse bg-slate-200 {variant === 'person' ? 'aspect-square' : 'aspect-video'}"
					></div>
					<div class="flex flex-col gap-3 p-5">
						<div class="h-3 w-20 animate-pulse rounded bg-slate-200"></div>
						<div class="h-4 w-3/4 animate-pulse rounded bg-slate-200"></div>
						<div class="h-3 w-full animate-pulse rounded bg-slate-200"></div>
						<div class="h-3 w-5/6 animate-pulse rounded bg-slate-200"></div>
					</div>
				</div>
			{/if}
		{/each}
	</div>
{/if}
