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
		<div class="my-8 grid gap-5 {visible.length > 1 ? 'lg:grid-cols-2' : ''}">
			{#each visible as highlight (highlight.title + (highlight.body ?? ''))}
				<svelte:element
					this={highlight.link ? 'a' : 'div'}
					href={highlight.link || undefined}
					target={highlight.link ? '_blank' : undefined}
					rel={highlight.link ? 'noopener noreferrer' : undefined}
					class="group relative flex flex-col overflow-hidden rounded-2xl bg-white shadow-sm ring-1 ring-slate-200/80 transition-all duration-300 hover:shadow-xl hover:ring-gmu-green/30 sm:flex-row {highlight.link
						? 'hover:-translate-y-0.5'
						: ''}"
				>
					<span
						class="h-1.5 w-full shrink-0 bg-gradient-to-r from-gmu-gold to-gmu-green sm:h-auto sm:w-1.5 sm:bg-gradient-to-b"
					></span>

					{#if highlight.image}
						<div class="shrink-0 overflow-hidden sm:w-44">
							<img
								src={resolveAsset(highlight.image)}
								alt=""
								class="h-44 w-full object-cover transition-transform duration-500 group-hover:scale-105 sm:h-full"
							/>
						</div>
					{/if}

					<div class="flex flex-1 items-center gap-5 p-6">
						<div class="min-w-0 flex-1">
							<p
								class="mb-1.5 inline-flex items-center gap-1.5 text-[0.7rem] font-semibold tracking-[0.14em] text-gmu-green uppercase"
							>
								<Icon icon="mdi:star-four-points" width="12" class="text-gmu-gold" />
								Highlight
							</p>
							{#if highlight.title}
								<h3 class="text-lg leading-snug font-bold text-slate-900 sm:text-xl">
									{highlight.title}
								</h3>
							{/if}
							{#if highlight.body}
								<p class="mt-1.5 line-clamp-3 text-sm text-slate-600">{highlight.body}</p>
							{/if}
							{#if highlight.link}
								<span
									class="mt-3 inline-flex items-center gap-1.5 text-sm font-semibold text-gmu-green transition-all group-hover:gap-2.5"
								>
									{highlight.linkText || 'Learn more'}
									<Icon icon="mdi:arrow-right" width="16" />
								</span>
							{/if}
						</div>
					</div>
				</svelte:element>
			{/each}
		</div>
	</div>
{/if}
