<script lang="ts">
	import Icon from '@iconify/svelte';
	import Img from '$lib/components/Img.svelte';
	import { memberPhoto, type Member } from '$lib/ts/group';
	import EducationList from '$lib/components/EducationList.svelte';
	import { socialIcon, socialLabel } from '$lib/ts/socialIcons';
	import { basePath } from '$lib/ts/site';

	let { member }: { member: Member } = $props();

	const href = $derived(`${basePath}/team/${member.slug || member.id}`);
</script>

<article class="group flex flex-col border border-slate-200 bg-white shadow-sm transition hover:border-gmu-green hover:shadow-md">
	<div class="h-1.5 w-full origin-left scale-x-0 bg-gmu-gold transition-transform duration-300 group-hover:scale-x-100"></div>
	<a {href} class="flex flex-1 flex-col">
		<div class="aspect-square overflow-hidden bg-gmu-green-light">
			<Img src={memberPhoto(member.photo)} alt={member.name} class="h-full w-full object-cover group-hover:scale-105" />
		</div>
		<div class="flex flex-1 flex-col p-4">
			<h3 class="font-semibold text-slate-900 group-hover:text-gmu-green">{member.name}</h3>
			{#if member.period}
				<p class="font-mono text-xs text-gmu-green">{member.period}</p>
			{/if}
			{#if member.areaOfStudy}
				<p class="mt-1 text-sm font-medium text-slate-700">{member.areaOfStudy}</p>
			{/if}
			{#if member.note}
				<p class="mt-1 text-sm text-slate-500">{member.note}</p>
			{/if}
			{#if member.education.length > 0}
				<div class="mt-3">
					<EducationList education={member.education} />
				</div>
			{/if}
		</div>
	</a>
	{#if member.email || member.socials.length > 0}
		<div class="flex flex-wrap items-center gap-3 px-4 pb-4 text-slate-500">
			{#if member.email}
				<a href={`mailto:${member.email}@gmu.edu`} aria-label="Email" class="hover:text-gmu-green">
					<Icon icon="mdi:email" width="20" />
				</a>
			{/if}
			{#each member.socials as social, index (index)}
				<a
					href={social.href}
					target="_blank"
					rel="noopener noreferrer"
					aria-label={socialLabel(social)}
					title={socialLabel(social)}
					class="hover:text-gmu-green"
				>
					<Icon icon={socialIcon(social)} width="20" />
				</a>
			{/each}
		</div>
	{/if}
</article>
