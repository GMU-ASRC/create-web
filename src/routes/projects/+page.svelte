<script lang="ts">
	import { onMount } from 'svelte';
	import { page as pageState } from '$app/state';
	import Seo from '$lib/components/Seo.svelte';
	import PageHero from '$lib/components/PageHero.svelte';
	import ResearchCard from '$lib/components/ResearchCard.svelte';
	import LoadState from '$lib/components/LoadState.svelte';
	import SkeletonGrid from '$lib/components/SkeletonGrid.svelte';
	import Pagination from '$lib/components/Pagination.svelte';
	import { cms, preloadImages } from '$lib/ts/cms';
	import type { ResearchProject } from '$lib/ts/research';

	const pageSize = 12;

	let projects = $state<ResearchProject[]>([]);
	let loading = $state(true);
	let page = $state(1);

	const ordered = $derived(
		[...projects].sort(
			(first, second) => Number(Boolean(second.featured)) - Number(Boolean(first.featured))
		)
	);
	const visible = $derived(ordered.slice((page - 1) * pageSize, page * pageSize));

	onMount(async () => {
		projects = (await cms.projects()) ?? [];
		preloadImages(projects.map((project) => project.image));
		loading = false;
	});
</script>

<Seo
	brand="CREATE Lab"
	title="Projects"
	description="Projects from the CREATE Lab spanning swarm robotics, neuromorphic learning, autonomous coordination, and the control of spreading processes."
	url={pageState.url.href}
/>

<PageHero eyebrow="Projects" title="Our Projects" />

<section class="bg-slate-100">
	<div class="mx-auto max-w-7xl px-4 py-16">
		{#if loading}
			<SkeletonGrid variant="card" count={8} grid="grid gap-6 sm:grid-cols-2 lg:grid-cols-4" />
		{:else if projects.length === 0}
			<LoadState loading={false} empty="No projects yet." />
		{:else}
			<div class="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
				{#each visible as project (project.title)}
					<ResearchCard {project} featured={Boolean(project.featured)} />
				{/each}
			</div>
			<Pagination bind:page total={projects.length} {pageSize} />
		{/if}
	</div>
</section>
