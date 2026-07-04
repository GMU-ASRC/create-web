<script lang="ts">
	import { onMount } from 'svelte';
	import Icon from '@iconify/svelte';
	import Img from '$lib/components/Img.svelte';
	import { page } from '$app/state';
	import Seo from '$lib/components/Seo.svelte';
	import LoadState from '$lib/components/LoadState.svelte';
	import EducationList from '$lib/components/EducationList.svelte';
	import PublicationList from '$lib/components/PublicationList.svelte';
	import { socialIcon, socialLabel } from '$lib/ts/socialIcons';
	import { cms } from '$lib/ts/cms';
	import { memberPhoto, type Member } from '$lib/ts/group';
	import { projectLink, type ResearchProject } from '$lib/ts/research';
	import { publicationsForMember, type PublicationSection } from '$lib/ts/publications';

	let member = $state<Member | null>(null);
	let label = $state('');
	let projects = $state<ResearchProject[]>([]);
	let publicationSections = $state<PublicationSection[]>([]);
	let loading = $state(true);

	const memberProjects = $derived(
		member
			? projects.filter((project) =>
					(project.teamMembers ?? []).some((name) => name === member?.name)
				)
			: []
	);

	const memberPublications = $derived<PublicationSection>({
		heading: 'Publications',
		entries: member ? publicationsForMember(publicationSections, member.name) : []
	});

	onMount(async () => {
		const slug = page.params.slug;
		const [data, projectData, publicationData] = await Promise.all([
			cms.team(),
			cms.projects(),
			cms.publications()
		]);
		if (data) {
			const everyone = [
				{ member: data.professor, label: 'Professor' },
				...data.groups.flatMap((group) =>
					group.members.map((person) => ({ member: person, label: group.heading }))
				)
			];
			const match = everyone.find(
				(entry) => entry.member.slug === slug || entry.member.id === slug
			);
			if (match) {
				member = match.member;
				label = match.label;
			}
		}
		projects = projectData ?? [];
		publicationSections = publicationData ?? [];
		loading = false;
	});
</script>

<Seo
	brand="CREATE Lab"
	title={member?.name ?? 'Team'}
	description={member
		? `${member.name}, ${label} in the CREATE Lab at George Mason University.`
		: 'A member of the CREATE Lab at George Mason University.'}
	image={member?.photo || '/create_logo.png'}
	url={page.url.href}
	type="profile"
/>

<div class="mx-auto max-w-4xl px-4 py-12">
	<a
		href="/team"
		class="inline-flex items-center gap-1 text-sm font-medium text-gmu-green hover:underline"
	>
		<Icon icon="mdi:arrow-left" width="16" />
		Back to Team
	</a>

	{#if loading || !member}
		<LoadState {loading} empty="Team member not found." />
	{:else}
		<div class="mt-8 flex flex-col gap-8 sm:flex-row">
			<div class="flex-shrink-0">
				<div class="h-1.5 w-full bg-gmu-gold"></div>
				<Img src={memberPhoto(member.photo)} alt={member.name} class="h-56 w-56 object-cover" />
			</div>
			<div>
				<p class="text-xs font-semibold tracking-widest text-gmu-green uppercase">{label}</p>
				<h1 class="mt-1 text-3xl font-bold tracking-tight text-slate-900">{member.name}</h1>
				{#if member.period}
					<p class="mt-1 font-mono text-sm text-gmu-green">{member.period}</p>
				{/if}
				{#if member.areaOfStudy}
					<p class="mt-2 text-sm text-slate-600">
						<span class="font-semibold text-slate-700">Area of Study:</span>
						{member.areaOfStudy}
					</p>
				{/if}
				{#if member.note}
					<p class="mt-2 text-slate-500">{member.note}</p>
				{/if}

				{#if member.education.length > 0}
					<div class="mt-4">
						<EducationList education={member.education} />
					</div>
				{/if}

				<div class="mt-5 flex flex-wrap items-center gap-4 text-slate-500">
					{#if member.email}
						<a
							href={`mailto:${member.email}@gmu.edu`}
							class="inline-flex items-center gap-1.5 text-sm font-medium hover:text-gmu-green"
						>
							<Icon icon="mdi:email" width="20" />
							{member.email}@gmu.edu
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
							<Icon icon={socialIcon(social)} width="22" />
						</a>
					{/each}
				</div>
			</div>
		</div>

		{#if member.bio}
			<!-- eslint-disable-next-line svelte/no-at-html-tags -->
			<div class="rich-content mt-10 text-slate-700">{@html member.bio}</div>
		{/if}

		{#if memberProjects.length > 0}
			<div class="mt-12">
				<h2 class="text-lg font-bold text-slate-900">Projects</h2>
				<ul class="mt-4 divide-y divide-slate-200 border-y border-slate-200">
					{#each memberProjects as project (project.slug || project.id || project.title)}
						{@const link = projectLink(project, '/research', '/projects')}
						<li>
							<a
								href={link.href}
								target={link.external ? '_blank' : undefined}
								rel={link.external ? 'noopener noreferrer' : undefined}
								class="group flex items-center justify-between gap-4 py-4"
							>
								<div>
									<p class="font-medium text-slate-900 group-hover:text-gmu-green">{project.title}</p>
									{#if project.years}
										<p class="mt-0.5 font-mono text-xs text-gmu-green">{project.years}</p>
									{/if}
								</div>
								<Icon
									icon={link.external ? 'mdi:open-in-new' : 'mdi:arrow-right'}
									width="18"
									class="shrink-0 text-slate-400 group-hover:text-gmu-green"
								/>
							</a>
						</li>
					{/each}
				</ul>
			</div>
		{/if}

		{#if memberPublications.entries.length > 0}
			<div class="mt-12">
				<h2 class="text-lg font-bold text-slate-900">Publications</h2>
				<div class="mt-4">
					<PublicationList section={memberPublications} />
				</div>
			</div>
		{/if}
	{/if}
</div>
