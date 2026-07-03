<script lang="ts">
	import { onMount } from 'svelte';
	import { page as pageState } from '$app/state';
	import Icon from '@iconify/svelte';
	import Seo from '$lib/components/Seo.svelte';
	import PageHero from '$lib/components/PageHero.svelte';
	import LoadState from '$lib/components/LoadState.svelte';
	import Pagination from '$lib/components/Pagination.svelte';
	import { cms, preloadImages } from '$lib/ts/cms';
	import {
		eventLink,
		eventStatus,
		eventStatusClass,
		formatEventRange,
		type EventEntry
	} from '$lib/ts/events';

	const pageSize = 9;

	let events = $state<EventEntry[]>([]);
	let loading = $state(true);
	let page = $state(1);

	const visible = $derived(events.slice((page - 1) * pageSize, page * pageSize));

	function summaryText(summary?: string): string {
		return (summary ?? '').replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim();
	}

	onMount(async () => {
		events = (await cms.events()) ?? [];
		preloadImages(events.map((event) => event.image));
		loading = false;
	});
</script>

<Seo
	brand="CREATE Lab"
	title="Events"
	description="Talks, competitions, workshops, and other events hosted by or featuring the CREATE Lab at George Mason University."
	url={pageState.url.href}
/>

<PageHero eyebrow="Events" title="Events" />

<section class="bg-slate-100">
	<div class="mx-auto max-w-7xl px-4 py-16">
		{#if loading || events.length === 0}
			<LoadState {loading} empty="No events yet." />
		{:else}
			<div class="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
				{#each visible as event (event.slug || event.id || event.title)}
					{@const link = eventLink(event)}
					{@const status = eventStatus(event)}
					<a
						href={link.href}
						target={link.external ? '_blank' : undefined}
						rel={link.external ? 'noopener noreferrer' : undefined}
						class="group flex flex-col overflow-hidden border border-slate-200 bg-white shadow-sm transition hover:border-gmu-green hover:shadow-md"
					>
						<div class="h-1.5 w-full origin-left bg-gmu-gold transition-transform duration-300 scale-x-0 group-hover:scale-x-100"></div>
						<div class="aspect-video overflow-hidden bg-gmu-green-light">
							{#if event.image}
								<img
									src={event.image}
									alt={event.title}
									class="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
								/>
							{:else}
								<div class="flex h-full w-full items-center justify-center text-gmu-green/40">
									<Icon icon="mdi:calendar-star" width="48" />
								</div>
							{/if}
						</div>
						<div class="flex flex-1 flex-col p-5">
							<div class="flex items-center gap-2 font-mono text-xs text-gmu-green">
								<Icon icon="mdi:calendar" width="14" />
								<span>{formatEventRange(event.date, event.endDate)}</span>
								<span class="rounded-full px-2 py-0.5 font-sans font-medium {eventStatusClass(status)}">
									{status}
								</span>
							</div>
							<h2 class="mt-2 font-semibold text-slate-900 group-hover:text-gmu-green">{event.title}</h2>
							{#if event.location}
								<p class="mt-1 inline-flex items-center gap-1 text-xs text-slate-500">
									<Icon icon="mdi:map-marker-outline" width="13" />
									{event.location}
								</p>
							{/if}
							{#if summaryText(event.summary)}
								<p class="mt-2 line-clamp-2 text-sm text-slate-600">{summaryText(event.summary)}</p>
							{/if}
							<span class="mt-4 inline-flex items-center gap-1 text-sm font-medium text-gmu-green group-hover:gap-2">
								{link.external ? 'Visit event' : 'View event'}
								<Icon icon={link.external ? 'mdi:open-in-new' : 'mdi:arrow-right'} width="16" />
							</span>
						</div>
					</a>
				{/each}
			</div>
			<Pagination bind:page total={events.length} {pageSize} />
		{/if}
	</div>
</section>
