<script lang="ts">
	let { eyebrow, title, description }: { eyebrow?: string; title: string; description?: string } =
		$props();
</script>

<section class="relative overflow-hidden bg-gmu-green text-white">
	<div
		class="absolute inset-0 opacity-15"
		style="background-image: radial-gradient(#ffffff 1.2px, transparent 1.2px); background-size: 18px 18px;"
	></div>
	<div class="absolute top-0 right-0 h-full w-2 bg-gmu-gold"></div>
	<div class="relative mx-auto max-w-7xl px-4 py-16">
		<h1 class="text-3xl font-bold tracking-tight sm:text-4xl">{title}</h1>
		<div class="mt-3 h-1 w-12 bg-gmu-gold"></div>
		{#if description}
			<p class="mt-4 max-w-2xl text-white/80">{description}</p>
		{/if}
	</div>
</section>
