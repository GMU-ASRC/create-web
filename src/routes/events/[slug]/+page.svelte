<script lang="ts">
	import { onMount } from 'svelte';
	import Icon from '@iconify/svelte';
	import { page } from '$app/state';
	import Seo from '$lib/components/Seo.svelte';
	import LoadState from '$lib/components/LoadState.svelte';
	import FileList from '$lib/components/FileList.svelte';
	import GalleryGrid from '$lib/components/GalleryGrid.svelte';
	import { cms } from '$lib/ts/cms';
	import {
		eventStatus,
		eventStatusClass,
		formatEventRange,
		type EventEntry
	} from '$lib/ts/events';
	import { memberPhoto, type Member } from '$lib/ts/group';

	let event = $state<EventEntry | null>(null);
	let memberByName = $state<Record<string, Member>>({});
	let loading = $state(true);

	const tags = $derived((event?.tags ?? []).filter((tag) => tag.trim()));
	const teamMembers = $derived((event?.teamMembers ?? []).filter((name) => name.trim()));
	const links = $derived((event?.links ?? []).filter((link) => link.href));
	const summaryPlain = $derived(
		(event?.summary ?? '').replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim()
	);

	onMount(async () => {
		const key = page.params.slug;
		const [events, team] = await Promise.all([cms.events(), cms.team()]);
		event = events?.find((entry) => entry.slug === key || entry.id === key) ?? null;
		if (team) {
			const everyone = [team.professor, ...team.groups.flatMap((group) => group.members)];
			const map: Record<string, Member> = {};
			for (const member of everyone) {
				if (member.name) map[member.name] = member;
			}
			memberByName = map;
		}
		loading = false;
	});
</script>

<Seo
	brand="CREATE Lab"
	title={event?.title ?? 'Event'}
	description={summaryPlain ||
		(event
			? `${event.title}, an event of the CREATE Lab at George Mason University.`
			: 'An event of the CREATE Lab at George Mason University.')}
	image={event?.image || '/create_logo.png'}
	url={page.url.href}
	type="article"
/>

<div class="mx-auto max-w-3xl px-4 py-12">
	<a
		href="/events"
		class="inline-flex items-center gap-1 text-sm font-medium text-gmu-green hover:underline"
	>
		<Icon icon="mdi:arrow-left" width="16" />
		Back to Events
	</a>

	{#if loading || !event}
		<LoadState {loading} empty="Event not found." />
	{:else}
		<div class="mt-8 flex flex-wrap items-center gap-3 font-mono text-xs font-semibold tracking-widest text-gmu-green uppercase">
			<span class="inline-flex items-center gap-1.5">
				<Icon icon="mdi:calendar" width="15" />
				{formatEventRange(event.date, event.endDate)}
			</span>
			<span class="rounded-full px-2.5 py-0.5 font-sans normal-case {eventStatusClass(eventStatus(event))}">
				{eventStatus(event)}
			</span>
		</div>
		<h1 class="mt-2 text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">{event.title}</h1>
		{#if event.location}
			<p class="mt-3 inline-flex items-center gap-1.5 text-sm font-medium text-slate-600">
				<Icon icon="mdi:map-marker-outline" width="16" />
				{event.location}
			</p>
		{/if}
		<div class="mt-3 h-1 w-12 bg-gmu-gold"></div>

		{#if event.summary}
			<!-- eslint-disable-next-line svelte/no-at-html-tags -->
			<div class="rich-content mt-6 text-lg text-slate-600">{@html event.summary}</div>
		{/if}

		{#if tags.length}
			<div class="mt-5 flex flex-wrap gap-2">
				{#each tags as tag (tag)}
					<span class="rounded-full bg-gmu-green-light px-3 py-1 text-xs font-medium text-gmu-green">
						{tag}
					</span>
				{/each}
			</div>
		{/if}

		{#if event.image}
			<img
				src={event.image}
				alt={event.title}
				class="mt-8 max-h-[32rem] w-full rounded-lg border border-slate-200 bg-slate-50 object-contain"
			/>
		{/if}

		{#if links.length}
			<div class="mt-6 flex flex-wrap gap-3">
				{#each links as link (link.href)}
					<a
						href={link.href}
						target="_blank"
						rel="noopener noreferrer"
						class="inline-flex items-center gap-2 rounded-lg border border-slate-200 px-4 py-2 text-sm font-medium text-gmu-green transition hover:border-gmu-green"
					>
						<Icon icon="mdi:open-in-new" width="16" />
						{link.label || link.href}
					</a>
				{/each}
			</div>
		{/if}

		{#if event.content}
			<!-- eslint-disable-next-line svelte/no-at-html-tags -->
			<div class="rich-content mt-8 text-slate-700">{@html event.content}</div>
		{/if}

		{#if teamMembers.length}
			<div class="mt-12">
				<h2 class="text-lg font-bold text-slate-900">Team</h2>
				<div class="mt-5 grid grid-cols-2 gap-x-4 gap-y-6 sm:grid-cols-3 lg:grid-cols-4">
					{#each teamMembers as name (name)}
						{@const member = memberByName[name]}
						{#if member}
							<a
								href={`/team/${member.slug || member.id}`}
								class="group flex flex-col items-center text-center"
							>
								<img
									src={memberPhoto(member.photo)}
									alt={member.name}
									class="h-20 w-20 rounded-full border border-slate-200 object-cover transition group-hover:border-gmu-green group-hover:shadow-md"
								/>
								<span class="mt-2 text-sm font-medium text-slate-800 group-hover:text-gmu-green">
									{member.name}
								</span>
							</a>
						{:else}
							<div class="flex flex-col items-center text-center">
								<img
									src={memberPhoto(undefined)}
									alt=""
									class="h-20 w-20 rounded-full border border-slate-200 object-cover"
								/>
								<span class="mt-2 text-sm text-slate-700">{name}</span>
							</div>
						{/if}
					{/each}
				</div>
			</div>
		{/if}

		{#if event.gallery?.length}
			<div class="mt-12">
				<h2 class="text-lg font-bold text-slate-900">Gallery</h2>
				<div class="mt-4">
					<GalleryGrid items={event.gallery} />
				</div>
			</div>
		{/if}

		<FileList files={event.files} />
	{/if}
</div>
