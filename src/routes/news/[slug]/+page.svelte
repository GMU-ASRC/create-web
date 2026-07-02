<script lang="ts">
	import { onMount } from 'svelte';
	import Icon from '@iconify/svelte';
	import { page } from '$app/state';
	import Seo from '$lib/components/Seo.svelte';
	import LoadState from '$lib/components/LoadState.svelte';
	import FileList from '$lib/components/FileList.svelte';
	import { cms } from '$lib/ts/cms';
	import type { NewsEntry } from '$lib/ts/news';

	let item = $state<NewsEntry | null>(null);
	let loading = $state(true);

	const bodyPlain = $derived(
		(item?.body ?? '').replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim()
	);

	const videoExtensions = /\.(mp4|webm|ogg|ogv|mov|m4v)$/i;

	function isVideo(src: string): boolean {
		return videoExtensions.test(src);
	}

	function formatDate(value: string): string {
		const date = new Date(value);
		if (Number.isNaN(date.getTime())) return value;
		return date.toLocaleDateString('en-US', { year: 'numeric', month: 'short', timeZone: 'UTC' });
	}

	onMount(async () => {
		const slug = page.params.slug;
		const news = await cms.news();
		if (news) {
			item = news.find((entry) => entry.slug === slug || entry.id === slug) ?? null;
		}
		loading = false;
	});
</script>

<Seo
	brand="CREATE Lab"
	title={item?.title ?? 'News'}
	description={bodyPlain ||
		'A news update from the CREATE Lab at George Mason University.'}
/>

<div class="mx-auto max-w-3xl px-4 py-12">
	<a
		href="/news"
		class="inline-flex items-center gap-1 text-sm font-medium text-gmu-green hover:underline"
	>
		<Icon icon="mdi:arrow-left" width="16" />
		Back to News
	</a>

	{#if loading || !item}
		<LoadState {loading} empty="News item not found." />
	{:else}
		<p class="mt-8 font-mono text-xs font-semibold tracking-widest text-gmu-green uppercase">
			{formatDate(item.date)}
		</p>
		<h1 class="mt-2 text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">{item.title}</h1>
		{#if item.author}
			<p class="mt-3 text-sm font-medium text-slate-600">By {item.author}</p>
		{/if}
		<div class="mt-3 h-1 w-12 bg-gmu-gold"></div>

		{#if item.body}
			<!-- eslint-disable-next-line svelte/no-at-html-tags -->
			<div class="rich-content mt-8 text-slate-700">{@html item.body}</div>
		{/if}

		{#if item.gallery?.length}
			<div class="mt-12">
				<h2 class="text-lg font-bold text-slate-900">Gallery</h2>
				<div class="mt-4 grid grid-cols-2 gap-4 sm:grid-cols-3">
					{#each item.gallery as src (src)}
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

		<FileList files={item.files} />
	{/if}
</div>
