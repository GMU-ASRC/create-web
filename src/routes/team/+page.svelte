<script lang="ts">
	import { onMount } from 'svelte';
	import { page } from '$app/state';
	import Icon from '@iconify/svelte';
	import Seo from '$lib/components/Seo.svelte';
	import PageHero from '$lib/components/PageHero.svelte';
	import TeamGroup from '$lib/components/TeamGroup.svelte';
	import LoadState from '$lib/components/LoadState.svelte';
	import SkeletonGrid from '$lib/components/SkeletonGrid.svelte';
	import Img from '$lib/components/Img.svelte';
	import EducationList from '$lib/components/EducationList.svelte';
	import { socialIcon, socialLabel } from '$lib/ts/socialIcons';
	import { cms, preloadImages } from '$lib/ts/cms';
	import { memberPhoto, type Member, type MemberGroup } from '$lib/ts/group';

	let professor = $state<Member | null>(null);
	let groups = $state<MemberGroup[]>([]);
	let loading = $state(true);

	onMount(async () => {
		const data = await cms.team();
		if (data) {
			professor = data.professor;
			groups = data.groups;
			preloadImages([
				data.professor.photo,
				...data.groups.flatMap((group) => group.members.map((member) => member.photo))
			]);
		}
		loading = false;
	});
</script>

<Seo
	brand="CREATE Lab"
	title="Team"
	description="Meet the CREATE Lab team at George Mason University: the professor, current students, and alumni."
	url={page.url.href}
/>

<PageHero eyebrow="Team" title="The People" />

<section class="bg-slate-100">
	<div class="mx-auto max-w-7xl px-4 py-16">
		{#if loading}
			<div class="flex flex-col gap-6 border border-slate-200 bg-white p-6 shadow-sm sm:flex-row sm:items-center">
				<div class="h-40 w-40 shrink-0 animate-pulse bg-slate-200"></div>
				<div class="flex flex-1 flex-col gap-3">
					<div class="h-3 w-20 animate-pulse rounded bg-slate-200"></div>
					<div class="h-6 w-1/2 animate-pulse rounded bg-slate-200"></div>
					<div class="h-3 w-1/3 animate-pulse rounded bg-slate-200"></div>
					<div class="h-3 w-2/5 animate-pulse rounded bg-slate-200"></div>
				</div>
			</div>
			<div class="mt-14">
				<SkeletonGrid variant="person" count={8} grid="grid gap-6 sm:grid-cols-2 lg:grid-cols-4" />
			</div>
		{:else if !professor}
			<LoadState loading={false} empty="No team members yet." />
		{:else}
			<div class="flex flex-col gap-6 border border-slate-200 bg-white p-6 shadow-sm sm:flex-row sm:items-center">
				<a href={`/team/${professor.slug || professor.id}`} class="group flex-shrink-0">
					<Img
						src={memberPhoto(professor.photo)}
						alt={professor.name}
						class="h-40 w-40 object-cover group-hover:scale-105"
					/>
				</a>
				<div>
					<p class="text-xs font-semibold tracking-widest text-gmu-green uppercase">Professor</p>
					<a href={`/team/${professor.slug || professor.id}`}>
						<h2 class="mt-1 text-2xl font-bold text-slate-900 hover:text-gmu-green">{professor.name}</h2>
					</a>
					{#if professor.areaOfStudy}
						<p class="mt-1 text-sm font-medium text-slate-700">{professor.areaOfStudy}</p>
					{/if}
					{#if professor.education.length > 0}
						<div class="mt-2">
							<EducationList education={professor.education} />
						</div>
					{/if}
					<div class="mt-3 flex flex-wrap items-center gap-3 text-slate-500">
						{#if professor.email}
							<a
								href={`mailto:${professor.email}@gmu.edu`}
								aria-label="Email"
								class="hover:text-gmu-green"
							>
								<Icon icon="mdi:email" width="20" />
							</a>
						{/if}
						{#each professor.socials as social, index (index)}
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
				</div>
			</div>

			{#each groups as group (group.heading)}
				<TeamGroup {group} />
			{/each}
		{/if}
	</div>
</section>
