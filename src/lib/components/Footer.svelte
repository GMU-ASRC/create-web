<script lang="ts">
	import Icon from '@iconify/svelte';
	import AccessibilityControls from './AccessibilityControls.svelte';
	import type { SiteContact } from '$lib/ts/site';

	let {
		siteName = '',
		institution = '',
		tagline = '',
		contact = null,
		showAccessibility = true,
		logo = '/create_logo.png'
	}: {
		siteName?: string;
		institution?: string;
		tagline?: string;
		contact?: SiteContact | null;
		showAccessibility?: boolean;
		logo?: string;
	} = $props();
</script>

<footer class="relative overflow-hidden bg-gmu-green text-white">
	<div class="h-1.5 w-full bg-gmu-gold"></div>
	<div
		class="pointer-events-none absolute inset-0 opacity-10"
		style="background-image: radial-gradient(#ffffff 1.2px, transparent 1.2px); background-size: 18px 18px;"
	></div>

	<div class="relative mx-auto grid max-w-7xl gap-8 px-4 py-8 sm:grid-cols-2">
		<div>
			<div class="flex items-center gap-2.5">
				<span class="flex h-9 w-9 items-center justify-center rounded-lg bg-white shadow-sm">
					<img src={logo} alt="" class="h-6 w-auto" />
				</span>
				<span class="font-bold tracking-tight">{siteName}</span>
			</div>
			{#if tagline}
				<p class="mt-3 max-w-sm text-sm leading-relaxed text-white/70">{tagline}</p>
			{/if}
			{#if institution}
				<p class="mt-2 text-sm font-medium text-white/80">{institution}</p>
			{/if}
		</div>

		{#if contact}
			<div>
				<h2 class="text-xs font-semibold tracking-widest text-gmu-gold uppercase">Contact</h2>
				<ul class="mt-3 space-y-1.5 text-sm text-white/80">
					{#if contact.department}<li>{contact.department}</li>{/if}
					{#each contact.address ?? [] as line (line)}
						<li>{line}</li>
					{/each}
					{#if contact.email}
						<li class="pt-1">
							<a
								href={`mailto:${contact.email}`}
								class="inline-flex items-center gap-1.5 font-medium text-gmu-gold hover:underline"
							>
								<Icon icon="mdi:email-outline" width="16" />
								{contact.email}
							</a>
						</li>
					{/if}
				</ul>
			</div>
		{/if}
	</div>

	{#if showAccessibility}
		<div class="relative border-t border-white/15">
			<div class="mx-auto max-w-7xl px-4 py-5">
				<AccessibilityControls />
			</div>
		</div>
	{/if}
</footer>
