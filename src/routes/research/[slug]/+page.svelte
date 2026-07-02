<script lang="ts">
	import { onMount } from 'svelte';
	import Icon from '@iconify/svelte';
	import { page } from '$app/state';
	import Seo from '$lib/components/Seo.svelte';
	import PublicationList from '$lib/components/PublicationList.svelte';
	import FileList from '$lib/components/FileList.svelte';
	import LoadState from '$lib/components/LoadState.svelte';
	import { cms, relatedSectionsFrom } from '$lib/ts/cms';
	import type { ResearchArticle } from '$lib/ts/researchArticles';
	import type { PublicationSection } from '$lib/ts/publications';

	let article = $state<ResearchArticle | null>(null);
	let relatedSections = $state<PublicationSection[]>([]);
	let loading = $state(true);

	const videoExtensions = /\.(mp4|webm|ogg|ogv|mov|m4v)$/i;

	function isVideo(src: string): boolean {
		return videoExtensions.test(src);
	}

	onMount(async () => {
		const slug = page.params.slug ?? '';
		const [cmsArticle, pubData] = await Promise.all([cms.article(slug), cms.publications()]);
		if (cmsArticle) {
			article = cmsArticle;
			if (pubData) relatedSections = relatedSectionsFrom(pubData, cmsArticle.relatedPublications);
		}
		loading = false;
	});
</script>

<Seo
	brand="CREATE Lab"
	title={article?.title ?? 'Research'}
	description={article
		? `${article.title} (${article.years}), a research theme of the CREATE Lab at George Mason University.`
		: 'A research theme of the CREATE Lab at George Mason University.'}
/>

<div class="mx-auto max-w-3xl px-4 py-12">
	<a
		href="/research"
		class="inline-flex items-center gap-1 text-sm font-medium text-gmu-green hover:underline"
	>
		<Icon icon="mdi:arrow-left" width="16" />
		Back to Research
	</a>

	{#if loading || !article}
		<LoadState {loading} empty="Research article not found." />
	{:else}
		<p class="mt-8 font-mono text-xs font-semibold tracking-widest text-gmu-green uppercase">
			{article.years}
		</p>
		<h1 class="mt-2 text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">{article.title}</h1>
		{#if article.author}
			<p class="mt-3 text-sm font-medium text-slate-600">By {article.author}</p>
		{/if}
		<div class="mt-3 h-1 w-12 bg-gmu-gold"></div>

		{#if article.content}
			<!-- eslint-disable-next-line svelte/no-at-html-tags -->
			<div class="rich-content mt-8 text-slate-700">{@html article.content}</div>
		{:else}
			<p class="mt-8 text-slate-500">No content available.</p>
		{/if}

		{#if article.gallery?.length}
			<div class="mt-12">
				<h2 class="text-lg font-bold text-slate-900">Gallery</h2>
				<div class="mt-4 grid grid-cols-2 gap-4 sm:grid-cols-3">
					{#each article.gallery as src (src)}
						{#if isVideo(src)}
							<!-- svelte-ignore a11y_media_has_caption -->
							<video
								{src}
								controls
								preload="metadata"
								class="aspect-square w-full rounded-lg border border-slate-200 bg-slate-900 object-cover"
							></video>
						{:else}
							<img
								{src}
								alt=""
								class="aspect-square w-full rounded-lg border border-slate-200 object-cover"
							/>
						{/if}
					{/each}
				</div>
			</div>
		{/if}

		<FileList files={article.files} />

		{#each relatedSections as section (section.heading)}
			<div class="mt-12">
				<h2 class="text-lg font-bold text-slate-900">{section.heading}</h2>
				<div class="mt-4">
					<PublicationList {section} />
				</div>
			</div>
		{/each}
	{/if}
</div>
