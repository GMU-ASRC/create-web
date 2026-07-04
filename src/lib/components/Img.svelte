<script lang="ts">
	import type { HTMLImgAttributes } from 'svelte/elements';

	let { src, alt = '', class: className = '', ...rest }: HTMLImgAttributes = $props();

	let el = $state<HTMLImageElement>();
	let loaded = $state(false);

	$effect(() => {
		void src;
		loaded = Boolean(el?.complete && el.naturalWidth > 0);
	});
</script>

<img
	bind:this={el}
	{src}
	{alt}
	onload={() => (loaded = true)}
	onerror={() => (loaded = true)}
	class="{className} transition duration-500 {loaded ? 'opacity-100' : 'opacity-0'}"
	{...rest}
/>
