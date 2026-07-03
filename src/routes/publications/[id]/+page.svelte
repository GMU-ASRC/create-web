<script lang="ts">
	import { onMount } from 'svelte';
	import Icon from '@iconify/svelte';
	import { page } from '$app/state';
	import Seo from '$lib/components/Seo.svelte';
	import LoadState from '$lib/components/LoadState.svelte';
	import { cms } from '$lib/ts/cms';
	import type { Publication } from '$lib/ts/publications';
	import { formatDate } from '$lib/ts/dates';

	let publication = $state<Publication | null>(null);
	let loading = $state(true);

	onMount(async () => {
		const id = page.params.id;
		const sections = await cms.publications();
		const all = (sections ?? []).flatMap((section) => section.entries);
		publication = all.find((entry) => entry.id === id) ?? null;
		loading = false;
	});

	function doiLink(doi: string): string {
		return /^https?:\/\//.test(doi) ? doi : `https://doi.org/${doi}`;
	}

	function pdfFilename(): string {
		const base = publication?.tag || publication?.title || 'publication';
		return `${base}.pdf`.replace(/[^a-z0-9.\-_]+/gi, '_');
	}

	async function downloadPdf() {
		const url = publication?.pdf;
		if (!url) return;
		try {
			const response = await fetch(url);
			if (!response.ok) throw new Error('Download failed');
			const blob = await response.blob();
			const objectUrl = URL.createObjectURL(blob);
			const link = document.createElement('a');
			link.href = objectUrl;
			link.download = pdfFilename();
			document.body.appendChild(link);
			link.click();
			link.remove();
			URL.revokeObjectURL(objectUrl);
		} catch {
			window.open(url, '_blank', 'noopener');
		}
	}
</script>

<Seo
	brand="CREATE Lab"
	title={publication?.title ?? 'Publication'}
	description={publication
		? `${publication.authors}. ${publication.title} ${publication.venue}`
		: 'A publication from the CREATE Lab at George Mason University.'}
	url={page.url.href}
	type="article"
/>

<div class="mx-auto max-w-4xl px-4 py-12">
	<a
		href="/publications"
		class="inline-flex items-center gap-1 text-sm font-medium text-gmu-green hover:underline"
	>
		<Icon icon="mdi:arrow-left" width="16" />
		Back to Publications
	</a>

	{#if loading || !publication}
		<LoadState {loading} empty="Publication not found." />
	{:else}
		<div class="mt-8">
			<span class="border border-slate-300 px-2 py-0.5 font-mono text-xs text-slate-500">
				{publication.tag}
			</span>
			<h1 class="mt-3 text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
				{publication.title}
			</h1>
			<div class="mt-3 h-1 w-12 bg-gmu-gold"></div>
			<p class="mt-4 text-slate-600">{publication.authors}</p>
			<p class="mt-1 text-sm text-slate-500">
				{publication.venue}{#if publication.date}<span> &middot; {formatDate(publication.date)}</span>{/if}
			</p>
			{#if publication.award}
				<p class="mt-3 inline-flex items-center gap-1 text-sm font-medium text-amber-700">
					<Icon icon="mdi:trophy" width="16" />
					{publication.award}
				</p>
			{/if}

			<div class="mt-5 flex flex-wrap items-center gap-3">
				{#if publication.pdf}
					<a
						href={publication.pdf}
						target="_blank"
						rel="noopener noreferrer"
						class="inline-flex items-center gap-2 bg-gmu-green px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-gmu-green-dark"
					>
						<Icon icon="mdi:file-pdf-box" width="18" />
						Open PDF
					</a>
					<button
						type="button"
						onclick={downloadPdf}
						class="inline-flex items-center gap-2 border border-slate-300 px-4 py-2 text-sm font-medium text-gmu-green transition-colors hover:border-gmu-green"
					>
						<Icon icon="mdi:download" width="18" />
						Download
					</button>
				{/if}
				{#if publication.doi}
					<a
						href={doiLink(publication.doi)}
						target="_blank"
						rel="noopener noreferrer"
						class="inline-flex items-center gap-2 border border-slate-300 px-4 py-2 text-sm font-medium text-gmu-green transition-colors hover:border-gmu-green"
					>
						<Icon icon="mdi:link-variant" width="18" />
						DOI
					</a>
				{/if}
				{#if publication.video}
					<a
						href={publication.video}
						target="_blank"
						rel="noopener noreferrer"
						class="inline-flex items-center gap-2 border border-slate-300 px-4 py-2 text-sm font-medium text-gmu-green transition-colors hover:border-gmu-green"
					>
						<Icon icon="mdi:play-circle" width="18" />
						Video
					</a>
				{/if}
			</div>

			{#if publication.pdf}
				<iframe
					src={publication.pdf}
					title={publication.title}
					style="height: 85vh; min-height: 800px;"
					class="mt-8 w-full rounded-lg border border-slate-200 bg-slate-50"
				></iframe>
			{:else}
				<p class="mt-8 text-slate-500">No PDF available for this publication.</p>
			{/if}
		</div>
	{/if}
</div>
