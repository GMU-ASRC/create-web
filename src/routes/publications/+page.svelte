<script lang="ts">
	import { onMount } from 'svelte';
	import { page } from '$app/state';
	import Icon from '@iconify/svelte';
	import Seo from '$lib/components/Seo.svelte';
	import PageHero from '$lib/components/PageHero.svelte';
	import PublicationList from '$lib/components/PublicationList.svelte';
	import LoadState from '$lib/components/LoadState.svelte';
	import SkeletonGrid from '$lib/components/SkeletonGrid.svelte';
	import { cms } from '$lib/ts/cms';
	import type { Publication, PublicationSection } from '$lib/ts/publications';

	let sections = $state<PublicationSection[]>([]);
	let loading = $state(true);
	let query = $state('');
	let activeType = $state('all');

	const typeFilters = $derived(['all', ...sections.map((section) => section.heading)]);

	const filteredSections = $derived(
		sections
			.filter((section) => activeType === 'all' || section.heading === activeType)
			.map((section) => ({
				heading: section.heading,
				entries: section.entries.filter((entry) => matches(entry, query))
			}))
			.filter((section) => section.entries.length > 0)
	);

	const resultCount = $derived(
		filteredSections.reduce((total, section) => total + section.entries.length, 0)
	);

	function matches(entry: Publication, term: string): boolean {
		const text = term.trim().toLowerCase();
		if (!text) return true;
		return (
			entry.title.toLowerCase().includes(text) ||
			entry.authors.toLowerCase().includes(text) ||
			entry.venue.toLowerCase().includes(text) ||
			entry.tag.toLowerCase().includes(text)
		);
	}

	function labelFor(type: string): string {
		return type === 'all' ? 'All' : type;
	}

	onMount(async () => {
		sections = (await cms.publications()) ?? [];
		loading = false;
	});
</script>

<Seo
	brand="CREATE Lab"
	title="Publications"
	description="Journal articles, book chapters, and conference proceedings from the CREATE Lab on event-triggered control, multi-agent coordination, and epidemic processes."
	url={page.url.href}
/>

<PageHero eyebrow="Publications" title="Publications" />

<section class="mx-auto max-w-5xl space-y-8 px-4 py-16">
	{#if loading}
		<SkeletonGrid variant="list" count={6} />
	{:else if sections.length === 0}
		<LoadState loading={false} empty="No publications yet." />
	{:else}
		<div class="space-y-4">
			<div class="relative">
				<Icon
					icon="mdi:magnify"
					width="20"
					class="pointer-events-none absolute top-1/2 left-3 -translate-y-1/2 text-slate-400"
				/>
				<input
					type="search"
					placeholder="Search by title, author, venue, or tag..."
					bind:value={query}
					class="w-full rounded-lg border border-slate-200 bg-white py-2.5 pr-4 pl-10 text-sm text-slate-900 placeholder:text-slate-400 focus:border-gmu-green focus:ring-1 focus:ring-gmu-green focus:outline-none"
				/>
			</div>
			<div class="flex flex-wrap items-center gap-2">
				{#each typeFilters as type (type)}
					<button
						type="button"
						onclick={() => (activeType = type)}
						class="rounded-full border px-4 py-1.5 text-sm font-medium transition-colors {activeType ===
						type
							? 'border-gmu-green bg-gmu-green text-white'
							: 'border-slate-200 bg-white text-slate-600 hover:border-slate-300'}"
					>
						{labelFor(type)}
					</button>
				{/each}
			</div>
		</div>

		{#if filteredSections.length === 0}
			<p class="py-8 text-center text-sm text-slate-500">No publications match your search.</p>
		{:else}
			<p class="text-sm text-slate-500">{resultCount} {resultCount === 1 ? 'result' : 'results'}</p>
			{#each filteredSections as section (section.heading)}
				<div>
					<h2 class="text-xl font-bold text-slate-900">{section.heading}</h2>
					<div class="mt-4">
						<PublicationList {section} />
					</div>
				</div>
			{/each}
		{/if}
	{/if}
</section>
