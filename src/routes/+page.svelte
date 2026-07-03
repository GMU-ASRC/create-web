<script lang="ts">
	import { onMount } from 'svelte';
	import Icon from '@iconify/svelte';
	import Seo from '$lib/components/Seo.svelte';
	import SectionHeading from '$lib/components/SectionHeading.svelte';
	import ResearchCard from '$lib/components/ResearchCard.svelte';
	import SponsorGrid from '$lib/components/SponsorGrid.svelte';
	import HeroShowcase from '$lib/components/HeroShowcase.svelte';
	import Highlights from '$lib/components/Highlights.svelte';
	import { cms, resolveAsset, preloadImages } from '$lib/ts/cms';
	import type { ResearchProject } from '$lib/ts/research';
	import { newsLink, type NewsEntry } from '$lib/ts/news';
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
	let sponsors = $state<Sponsor[]>([]);
	let news = $state<NewsEntry[]>([]);
	let highlights = $state<SiteHighlight[]>([]);

	const featuredProjects = $derived(
		[...projects]
			.sort((first, second) => Number(Boolean(second.featured)) - Number(Boolean(first.featured)))
			.slice(0, 4)
	);
	const recentNews = $derived(news.slice(0, 3));

	function formatDate(value: string): string {
		const date = new Date(value);
		if (Number.isNaN(date.getTime())) return value;
		return date.toLocaleDateString('en-US', { year: 'numeric', month: 'short', timeZone: 'UTC' });
	}

	onMount(async () => {
		const [info, projectData, sponsorData, newsData] = await Promise.all([
			cms.siteInfo<SiteInfo>(),
			cms.projects(),
			cms.sponsors(),
			cms.news()
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
		sponsors = sponsorData ?? [];
		news = newsData ?? [];
		preloadImages([
			...heroImages,
			...projects.map((project) => project.image),
			...sponsors.map((sponsor) => sponsor.image)
		]);
	});
</script>

<Seo brand="CREATE Lab" title="Home" description={labIntro} />

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
	<div class="mx-auto max-w-7xl px-4 py-10">
		<div class="flex items-end justify-between gap-4">
			<SectionHeading
				eyebrow="Projects"
				title="What we work on"
			/>
			<a
				href="/projects"
				class="hidden shrink-0 text-sm font-medium text-gmu-green hover:underline sm:block"
			>
				All projects
			</a>
		</div>
		{#if featuredProjects.length > 0}
			<div class="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
				{#each featuredProjects as project (project.title)}
					<ResearchCard {project} featured={Boolean(project.featured)} />
				{/each}
			</div>
		{/if}
	</div>
</section>

{#if recentNews.length > 0}
<section class="mx-auto max-w-7xl px-4 py-10">
	<div class="flex items-end justify-between gap-4">
		<SectionHeading eyebrow="News" title="Latest updates" />
		<a
			href="/news"
			class="hidden shrink-0 text-sm font-medium text-gmu-green hover:underline sm:block"
		>
			All news
		</a>
	</div>
	<div class="mt-6 grid gap-6 md:grid-cols-3">
		{#each recentNews as item (item.title + item.date)}
			{@const link = newsLink(item, '/news')}
			<article class="flex flex-col border border-slate-200 border-l-4 border-l-gmu-gold bg-white p-5 shadow-sm transition-colors hover:border-gmu-green hover:border-l-gmu-gold">
				<p class="font-mono text-xs text-gmu-green">{formatDate(item.date)}</p>
				<h3 class="mt-2 font-semibold text-slate-900">{item.title}</h3>
				{#if item.author}
					<p class="mt-0.5 text-xs font-medium text-slate-500">By {item.author}</p>
				{/if}
				{#if link}
					<a
						href={link.href}
						target={link.external ? '_blank' : undefined}
						rel={link.external ? 'noopener noreferrer' : undefined}
						class="mt-4 inline-flex items-center gap-1 text-sm font-medium text-gmu-green hover:underline"
					>
						Read more
						<Icon icon="mdi:arrow-right" width="16" />
					</a>
				{/if}
			</article>
		{/each}
	</div>
</section>
{/if}

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
