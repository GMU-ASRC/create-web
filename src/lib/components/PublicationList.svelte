<script lang="ts">
	import Icon from '@iconify/svelte';
	import Pagination from './Pagination.svelte';
	import type { PublicationSection } from '$lib/ts/publications';
	import { formatDate } from '$lib/ts/dates';
	import { basePath } from '$lib/ts/site';

	let { section }: { section: PublicationSection } = $props();

	const pageSize = 10;
	let page = $state(1);
	const visible = $derived(section.entries.slice((page - 1) * pageSize, page * pageSize));

	$effect(() => {
		section.entries;
		page = 1;
	});

	function doiLink(doi: string): string {
		return /^https?:\/\//.test(doi) ? doi : `https://doi.org/${doi}`;
	}
</script>

<ul class="divide-y divide-slate-200 border-y border-slate-200">
	{#each visible as entry (entry.id ?? entry.tag)}
		<li class="flex gap-4 py-4">
			<span class="h-fit shrink-0 whitespace-nowrap border border-slate-300 px-2 py-0.5 font-mono text-xs text-slate-500">
				{entry.tag}
			</span>
			<div class="text-sm leading-relaxed">
				<span class="text-slate-500">{entry.authors}.</span>
				{#if entry.id}
					<a
						href={`${basePath}/publications/${entry.id}`}
						class="font-semibold text-slate-900 hover:text-gmu-green hover:underline"
					>
						{entry.title}
					</a>
				{:else}
					<span class="font-semibold text-slate-900">{entry.title}</span>
				{/if}
				<span class="text-slate-500">{entry.venue}</span>
				{#if entry.date}
					<span class="text-slate-500">{formatDate(entry.date)}</span>
				{/if}
				<div class="mt-1 flex items-center gap-4">
					{#if entry.pdf}
						<a
							href={entry.pdf}
							target="_blank"
							rel="noopener noreferrer"
							class="inline-flex items-center gap-1 text-xs font-medium text-gmu-green hover:underline"
						>
							<Icon icon="mdi:file-pdf-box" width="14" />
							PDF
						</a>
					{/if}
					{#if entry.doi}
						<a
							href={doiLink(entry.doi)}
							target="_blank"
							rel="noopener noreferrer"
							class="inline-flex items-center gap-1 text-xs font-medium text-gmu-green hover:underline"
						>
							<Icon icon="mdi:link-variant" width="14" />
							DOI
						</a>
					{/if}
					{#if entry.video}
						<a
							href={entry.video}
							target="_blank"
							rel="noopener noreferrer"
							class="inline-flex items-center gap-1 text-xs font-medium text-gmu-green hover:underline"
						>
							<Icon icon="mdi:play-circle" width="14" />
							Video
						</a>
					{/if}
				</div>
				{#if entry.award}
					<p class="mt-1 inline-flex items-center gap-1 text-xs font-medium text-amber-700">
						<Icon icon="mdi:trophy" width="14" />
						{entry.award}
					</p>
				{/if}
			</div>
		</li>
	{/each}
</ul>

<Pagination bind:page total={section.entries.length} {pageSize} />
