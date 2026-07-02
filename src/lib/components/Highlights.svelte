<script lang="ts">
	import Icon from '@iconify/svelte';
	import { resolveAsset } from '$lib/ts/cms';
	import type { SiteHighlight } from '$lib/ts/site';

	let {
		highlights = [],
		location
	}: { highlights?: SiteHighlight[]; location: string } = $props();

	const visible = $derived(
		highlights.filter(
			(highlight) =>
				highlight.active !== false &&
				highlight.location === location &&
				((highlight.title ?? '').trim() || (highlight.body ?? '').trim() || highlight.image)
		)
	);
</script>

{#if visible.length}
	<div class="mx-auto max-w-7xl px-4">
		<div class="my-6 space-y-4">
			{#each visible as highlight (highlight.title + (highlight.body ?? ''))}
				<div
					class="flex flex-col gap-4 rounded-xl border border-slate-200 border-l-4 border-l-gmu-gold bg-white p-5 shadow-sm sm:flex-row sm:items-center"
				>
					{#if highlight.image}
						<img
							src={resolveAsset(highlight.image)}
							alt=""
							class="h-32 w-full rounded-lg object-cover sm:h-20 sm:w-32"
						/>
					{/if}
					<div class="min-w-0 flex-1">
						{#if highlight.title}
							<h3 class="font-semibold text-slate-900">{highlight.title}</h3>
						{/if}
						{#if highlight.body}
							<p class="mt-1 text-sm text-slate-600">{highlight.body}</p>
						{/if}
					</div>
					{#if highlight.link}
						<a
							href={highlight.link}
							target="_blank"
							rel="noopener noreferrer"
							class="inline-flex shrink-0 items-center gap-1.5 rounded-lg bg-gmu-green px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-gmu-green-dark"
						>
							{highlight.linkText || 'Learn more'}
							<Icon icon="mdi:arrow-right" width="16" />
						</a>
					{/if}
				</div>
			{/each}
		</div>
	</div>
{/if}
