<script lang="ts">
	import { onMount } from 'svelte';
	import { page as pageState } from '$app/state';
	import Icon from '@iconify/svelte';
	import Seo from '$lib/components/Seo.svelte';
	import PageHero from '$lib/components/PageHero.svelte';
	import LoadState from '$lib/components/LoadState.svelte';
	import Pagination from '$lib/components/Pagination.svelte';
	import { cms } from '$lib/ts/cms';
	import { newsLink, type NewsEntry } from '$lib/ts/news';
	import { formatDate } from '$lib/ts/dates';

	const newsBase = '/news';
	const pageSize = 10;

	let news = $state<NewsEntry[]>([]);
	let loading = $state(true);
	let page = $state(1);

	const visible = $derived(news.slice((page - 1) * pageSize, page * pageSize));

	onMount(async () => {
		news = (await cms.news()) ?? [];
		loading = false;
	});
</script>

<Seo
	brand="CREATE Lab"
	title="News"
	description="The latest news and announcements from the CREATE Lab at George Mason University, including awards, grants, and competition updates."
	url={pageState.url.href}
/>

<PageHero eyebrow="News" title="News and Updates" />

<section class="mx-auto max-w-4xl px-4 py-16">
	{#if loading || news.length === 0}
		<LoadState {loading} empty="No news yet." />
	{:else}
		<ul class="divide-y divide-slate-200 border-y border-slate-200">
			{#each visible as item (item.title + item.date)}
				{@const link = newsLink(item, newsBase)}
				<li class="flex flex-col gap-2 py-6 sm:flex-row sm:gap-6">
					<span class="w-28 shrink-0 font-mono text-xs font-semibold text-gmu-green">{formatDate(item.date)}</span>
					<div>
						<h2 class="font-semibold text-slate-900">{item.title}</h2>
						{#if item.author}
							<p class="mt-0.5 text-xs font-medium text-slate-500">By {item.author}</p>
						{/if}
						{#if item.body}
							<div class="rich-content mt-2 text-sm text-slate-600">{@html item.body}</div>
						{/if}
						{#if link}
							<a
								href={link.href}
								target={link.external ? '_blank' : undefined}
								rel={link.external ? 'noopener noreferrer' : undefined}
								class="mt-3 inline-flex items-center gap-1 text-sm font-medium text-gmu-green hover:underline"
							>
								Read more
								<Icon icon="mdi:arrow-right" width="16" />
							</a>
						{/if}
					</div>
				</li>
			{/each}
		</ul>
		<Pagination bind:page total={news.length} {pageSize} />
	{/if}
</section>
