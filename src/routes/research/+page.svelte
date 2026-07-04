<script lang="ts">
	import { onMount } from 'svelte';
	import { page as pageState } from '$app/state';
	import Seo from '$lib/components/Seo.svelte';
	import PageHero from '$lib/components/PageHero.svelte';
	import ResearchCard from '$lib/components/ResearchCard.svelte';
	import LoadState from '$lib/components/LoadState.svelte';
	import SkeletonGrid from '$lib/components/SkeletonGrid.svelte';
	import Pagination from '$lib/components/Pagination.svelte';
	import { cms, resolveAsset, preloadImages } from '$lib/ts/cms';
	import type { ResearchProject } from '$lib/ts/research';

	const pageSize = 9;

	let articles = $state<ResearchProject[]>([]);
	let loading = $state(true);
	let page = $state(1);

	const visible = $derived(articles.slice((page - 1) * pageSize, page * pageSize));

	onMount(async () => {
		const [articleData, projectData] = await Promise.all([cms.articles(), cms.projects()]);
		const projects = projectData ?? [];
		articles = (articleData ?? []).map((article) => {
			const match = projects.find((project) => project.slug === article.slug);
			return {
				title: article.title,
				author: article.author,
				years: article.years,
				slug: article.slug,
				image: resolveAsset(article.image) || match?.image || '',
				href: ''
			};
		});
		preloadImages(articles.map((article) => article.image));
		loading = false;
	});
</script>

<Seo
	brand="CREATE Lab"
	title="Research"
	description="In-depth research write-ups from the CREATE Lab on the analysis and control of networked cyber-physical systems."
	url={pageState.url.href}
/>

<PageHero eyebrow="Research" title="Research Articles" />

<section class="bg-slate-100">
	<div class="mx-auto max-w-7xl px-4 py-16">
		{#if loading}
			<SkeletonGrid variant="card" count={6} />
		{:else if articles.length === 0}
			<LoadState loading={false} empty="No research articles yet." />
		{:else}
			<div class="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
				{#each visible as project (project.title)}
					<ResearchCard {project} />
				{/each}
			</div>
			<Pagination bind:page total={articles.length} {pageSize} />
		{/if}
	</div>
</section>
