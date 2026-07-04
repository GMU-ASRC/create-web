<script lang="ts">
	import Icon from '@iconify/svelte';
	import Img from '$lib/components/Img.svelte';
	import { projectLink, type ResearchProject } from '$lib/ts/research';
	import { basePath } from '$lib/ts/site';

	let { project, featured = false }: { project: ResearchProject; featured?: boolean } = $props();

	const link = $derived(projectLink(project, `${basePath}/research`, `${basePath}/projects`));
	const summaryText = $derived(
		(project.summary ?? '').replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim()
	);
</script>

<a
	href={link.href}
	target={link.external ? '_blank' : undefined}
	rel={link.external ? 'noopener noreferrer' : undefined}
	class="group relative flex flex-col overflow-hidden border bg-white shadow-sm transition hover:shadow-md {featured
		? 'border-gmu-gold ring-1 ring-gmu-gold'
		: 'border-slate-200 hover:border-gmu-green'}"
>
	{#if featured}
		<span class="absolute top-3 right-3 z-10 inline-flex items-center gap-1 rounded-full bg-gmu-gold px-2.5 py-1 text-xs font-bold text-gmu-green-dark shadow">
			<Icon icon="mdi:star" width="13" />
			Featured
		</span>
	{/if}
	<div class="h-1.5 w-full origin-left bg-gmu-gold transition-transform duration-300 {featured
		? ''
		: 'scale-x-0 group-hover:scale-x-100'}"></div>
	<div class="aspect-video overflow-hidden bg-gmu-green-light">
		{#if project.image}
			<Img
				src={project.image}
				alt={project.title}
				class="h-full w-full object-cover group-hover:scale-105"
			/>
		{:else}
			<div class="flex h-full w-full items-center justify-center text-gmu-green/40">
				<Icon icon="mdi:file-document-outline" width="48" />
			</div>
		{/if}
	</div>
	<div class="flex flex-1 flex-col p-5">
		{#if project.status || project.years}
			<p class="font-mono text-xs text-gmu-green">{project.status ?? project.years}</p>
		{/if}
		<h3 class="mt-1 font-semibold text-slate-900">{project.title}</h3>
		{#if project.author}
			<p class="mt-0.5 text-xs font-medium text-slate-500">By {project.author}</p>
		{/if}
		{#if summaryText}
			<p class="mt-2 line-clamp-2 text-sm text-slate-600">{summaryText}</p>
		{/if}
		<span
			class="mt-4 inline-flex items-center gap-1 text-sm font-medium text-gmu-green group-hover:gap-2"
		>
			Explore
			<Icon icon="mdi:arrow-right" width="16" />
		</span>
	</div>
</a>
