<script lang="ts">
	import { onMount } from 'svelte';
	import { page } from '$app/state';
	import Icon from '@iconify/svelte';
	import Seo from '$lib/components/Seo.svelte';
	import SectionHeading from '$lib/components/SectionHeading.svelte';
	import ResearchCard from '$lib/components/ResearchCard.svelte';
	import SponsorGrid from '$lib/components/SponsorGrid.svelte';
	import SkeletonGrid from '$lib/components/SkeletonGrid.svelte';
	import HeroShowcase from '$lib/components/HeroShowcase.svelte';
	import Highlights from '$lib/components/Highlights.svelte';
	import { cms, resolveAsset, preloadImages } from '$lib/ts/cms';
	import type { ResearchProject } from '$lib/ts/research';
	import { newsLink, type NewsEntry } from '$lib/ts/news';
	import {
		eventLink,
		eventStatus,
		eventStatusClass,
		formatEventRange,
		type EventEntry
	} from '$lib/ts/events';
	import { formatDate } from '$lib/ts/dates';
	import type { Sponsor } from '$lib/ts/home';
	import { highlightLocations, type SiteHighlight } from '$lib/ts/site';

	type SiteInfo = {
		logo?: string;
		labName?: string;
		tagline?: string;
		intro?: string;
		heroImages?: string[];
		highlights?: SiteHighlight[];
	};

	let heroImages = $state<string[]>([]);
	let labLogo = $state('/create_logo.png');
	let labName = $state('');
	let labTagline = $state('');
	let labIntro = $state('');
	let projects = $state<ResearchProject[]>([]);
	let research = $state<ResearchProject[]>([]);
	let sponsors = $state<Sponsor[]>([]);
	let news = $state<NewsEntry[]>([]);
	let events = $state<EventEntry[]>([]);
	let highlights = $state<SiteHighlight[]>([]);
	let loading = $state(true);

	const featuredProjects = $derived(
		[...projects]
			.sort((first, second) => Number(Boolean(second.featured)) - Number(Boolean(first.featured)))
			.slice(0, 3)
	);
	const featuredResearch = $derived(research.slice(0, 3));
	const panelNews = $derived(news.slice(0, 5));
	const panelEvents = $derived.by(() => {
		const upcoming = events
			.filter((event) => eventStatus(event) !== 'Past')
			.sort((first, second) => (first.date < second.date ? -1 : first.date > second.date ? 1 : 0));
		return (upcoming.length ? upcoming : events).slice(0, 5);
	});

	onMount(async () => {
		const [info, projectData, articleData, sponsorData, newsData, eventData] = await Promise.all([
			cms.siteInfo<SiteInfo>(),
			cms.projects(),
			cms.articles(),
			cms.sponsors(),
			cms.news(),
			cms.events()
		]);
		if (info) {
			labLogo = resolveAsset(info.logo) || '/create_logo.png';
			labName = info.labName ?? '';
			labTagline = info.tagline ?? '';
			labIntro = info.intro ?? '';
			heroImages = (info.heroImages ?? [])
				.filter((path): path is string => typeof path === 'string' && path.length > 0)
				.map((path) => resolveAsset(path))
				.filter((src): src is string => Boolean(src));
			highlights = info.highlights ?? [];
		}
		projects = projectData ?? [];
		research = (articleData ?? []).map((article) => {
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
		sponsors = sponsorData ?? [];
		news = newsData ?? [];
		events = eventData ?? [];
		preloadImages([
			...heroImages,
			...projects.map((project) => project.image),
			...research.map((article) => article.image),
			...sponsors.map((sponsor) => sponsor.image)
		]);
		loading = false;
	});
</script>

<Seo brand="CREATE Lab" title="Home" description={labIntro} image={labLogo} url={page.url.href} />

<section class="relative isolate overflow-hidden bg-gmu-green text-white">
	<div
		class="absolute inset-0 opacity-15"
		style="background-image: radial-gradient(#ffffff 1.2px, transparent 1.2px); background-size: 20px 20px;"
	></div>
	<HeroShowcase images={heroImages} alt={labName} />
	<div class="relative mx-auto grid max-w-7xl items-center gap-12 px-4 py-28 md:grid-cols-2">
		<div class="flex flex-col items-center gap-6 sm:flex-row sm:items-center">
			{#if labLogo}
				<img src={labLogo} alt="" class="h-46 w-auto shrink-0 rounded-lg bg-white sm:h-44 md:h-48" />
			{/if}
			<div>
				<p class="font-mono text-xs font-semibold tracking-widest text-gmu-gold uppercase">
					{labTagline}
				</p>
				<div class="mt-4 flex items-center gap-4">
					<h1 class="text-4xl font-bold tracking-tight sm:text-5xl">{labName}</h1>
				</div>
				<div class="mt-4 h-1 w-16 bg-gmu-gold"></div>
				<p class="mt-6 text-lg text-white/85">{labIntro}</p>
				<div class="mt-8 flex flex-wrap gap-3">
					<a
						href="/projects"
						class="inline-flex items-center gap-2 bg-gmu-gold px-5 py-3 text-sm font-bold text-gmu-green-dark transition-colors hover:bg-white"
					>
						View Projects
						<Icon icon="mdi:arrow-right" width="18" />
					</a>
					<a
						href="/team"
						class="inline-flex items-center gap-2 border border-white/50 px-5 py-3 text-sm font-semibold text-white transition-colors hover:bg-white/10"
					>
						Meet the Team
					</a>
				</div>
			</div>
		</div>
		<div class="hidden md:block"></div>
	</div>
</section>

<Highlights {highlights} location={highlightLocations.homeHero} />

<section class="bg-slate-100">
	<div class="grid w-full gap-8 px-6 py-10 lg:grid-cols-4 lg:px-12">
		<div class="space-y-12 lg:col-span-3">
			<div>
				<div class="flex items-end justify-between gap-4">
					<SectionHeading eyebrow="Projects" title="What we work on" />
					<a
						href="/projects"
						class="hidden shrink-0 items-center gap-1 text-sm font-medium text-gmu-green hover:underline sm:flex"
					>
						All projects
						<Icon icon="mdi:arrow-right" width="16" />
					</a>
				</div>
				{#if loading}
					<div class="mt-6">
						<SkeletonGrid variant="card" count={3} grid="grid gap-6 sm:grid-cols-2 lg:grid-cols-3" />
					</div>
				{:else if featuredProjects.length > 0}
					<div class="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
						{#each featuredProjects as project (project.title)}
							<ResearchCard {project} featured={Boolean(project.featured)} />
						{/each}
					</div>
				{/if}
			</div>

			<div>
				<div class="flex items-end justify-between gap-4">
					<SectionHeading eyebrow="Research" title="In-depth research" />
					<a
						href="/research"
						class="hidden shrink-0 items-center gap-1 text-sm font-medium text-gmu-green hover:underline sm:flex"
					>
						All research
						<Icon icon="mdi:arrow-right" width="16" />
					</a>
				</div>
				{#if loading}
					<div class="mt-6">
						<SkeletonGrid variant="card" count={3} grid="grid gap-6 sm:grid-cols-2 lg:grid-cols-3" />
					</div>
				{:else if featuredResearch.length > 0}
					<div class="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
						{#each featuredResearch as article (article.title)}
							<ResearchCard project={article} />
						{/each}
					</div>
				{:else}
					<p class="mt-6 text-sm text-slate-500">No research articles yet.</p>
				{/if}
			</div>
		</div>

		<aside class="flex flex-col gap-6">
			<div class="border border-slate-200 bg-white shadow-sm">
				<div class="flex items-center justify-between border-b border-slate-100 px-5 py-3.5">
					<h3 class="flex items-center gap-2 font-mono text-sm font-bold tracking-wide text-gmu-green uppercase">
						<Icon icon="mdi:newspaper-variant-outline" width="18" />
						Latest News
					</h3>
					<a href="/news" class="inline-flex items-center gap-1 text-xs font-medium text-gmu-green hover:underline">
						All
						<Icon icon="mdi:arrow-right" width="14" />
					</a>
				</div>
				{#if loading}
					<div class="space-y-3 px-5 py-4">
						{#each Array(3) as _, index (index)}
							<div class="h-3 w-1/3 animate-pulse rounded bg-slate-200"></div>
							<div class="h-4 w-full animate-pulse rounded bg-slate-200"></div>
						{/each}
					</div>
				{:else if panelNews.length > 0}
					<ul class="divide-y divide-slate-100">
						{#each panelNews as item (item.title + item.date)}
							{@const link = newsLink(item, '/news')}
							<li>
								<a
									href={link ? link.href : '/news'}
									target={link?.external ? '_blank' : undefined}
									rel={link?.external ? 'noopener noreferrer' : undefined}
									class="group block px-5 py-3 transition-colors hover:bg-slate-50"
								>
									<p class="font-mono text-[11px] text-gmu-green">{formatDate(item.date)}</p>
									<p class="mt-0.5 line-clamp-2 text-sm font-semibold text-slate-900 group-hover:text-gmu-green">
										{item.title}
									</p>
									{#if item.author}
										<p class="mt-0.5 text-xs text-slate-500">By {item.author}</p>
									{/if}
								</a>
							</li>
						{/each}
					</ul>
				{:else}
					<p class="px-5 py-4 text-sm text-slate-500">No news yet.</p>
				{/if}
			</div>

			<div class="border border-slate-200 bg-white shadow-sm">
				<div class="flex items-center justify-between border-b border-slate-100 px-5 py-3.5">
					<h3 class="flex items-center gap-2 font-mono text-sm font-bold tracking-wide text-gmu-green uppercase">
						<Icon icon="mdi:calendar-star" width="18" />
						Events
					</h3>
					<a href="/events" class="inline-flex items-center gap-1 text-xs font-medium text-gmu-green hover:underline">
						All
						<Icon icon="mdi:arrow-right" width="14" />
					</a>
				</div>
				{#if loading}
					<div class="space-y-3 px-5 py-4">
						{#each Array(3) as _, index (index)}
							<div class="h-3 w-1/2 animate-pulse rounded bg-slate-200"></div>
							<div class="h-4 w-full animate-pulse rounded bg-slate-200"></div>
						{/each}
					</div>
				{:else if panelEvents.length > 0}
					<ul class="divide-y divide-slate-100">
						{#each panelEvents as event (event.slug || event.id || event.title)}
							{@const elink = eventLink(event)}
							{@const status = eventStatus(event)}
							<li>
								<a
									href={elink.href}
									target={elink.external ? '_blank' : undefined}
									rel={elink.external ? 'noopener noreferrer' : undefined}
									class="group block px-5 py-3 transition-colors hover:bg-slate-50"
								>
									<div class="flex items-center gap-2">
										<span class="font-mono text-[11px] text-gmu-green">{formatEventRange(event.date, event.endDate)}</span>
										<span class="rounded-full px-1.5 py-0.5 text-[10px] font-medium {eventStatusClass(status)}">
											{status}
										</span>
									</div>
									<p class="mt-0.5 line-clamp-2 text-sm font-semibold text-slate-900 group-hover:text-gmu-green">
										{event.title}
									</p>
									{#if event.location}
										<p class="mt-0.5 inline-flex items-center gap-1 text-xs text-slate-500">
											<Icon icon="mdi:map-marker-outline" width="12" />
											{event.location}
										</p>
									{/if}
								</a>
							</li>
						{/each}
					</ul>
				{:else}
					<p class="px-5 py-4 text-sm text-slate-500">No upcoming events.</p>
				{/if}
			</div>
		</aside>
	</div>
</section>

{#if sponsors.length > 0}
	<section class="bg-gmu-green-light">
		<div class="mx-auto max-w-7xl px-4 py-16">
			<h2 class="text-center font-mono text-xl font-bold tracking-wide text-gmu-green uppercase sm:text-2xl">
				Sponsors and Collaborators
			</h2>
			<div class="mt-8">
				<SponsorGrid {sponsors} />
			</div>
		</div>
	</section>
{/if}

<Highlights {highlights} location={highlightLocations.homeFooter} />
