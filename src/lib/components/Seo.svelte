<script lang="ts">
	import { siteName } from '$lib/ts/navigation';
	import { basePath } from '$lib/ts/site';

	const defaultImage = `${basePath}/create_logo.png`;

	let {
		title,
		description,
		brand = `${siteName} | CREATE Lab`,
		image = defaultImage,
		url = '',
		type = 'website'
	}: {
		title: string;
		description: string;
		brand?: string;
		image?: string;
		url?: string;
		type?: string;
	} = $props();

	const fullTitle = $derived(`${title} | ${brand}`);

	const absoluteImage = $derived.by(() => {
		if (!image) return '';
		if (/^https?:\/\//.test(image)) return image;
		if (url) {
			try {
				return new URL(image, url).href;
			} catch {
				return image;
			}
		}
		return image;
	});

	const cardType = $derived(image && image !== defaultImage ? 'summary_large_image' : 'summary');
</script>

<svelte:head>
	<title>{fullTitle}</title>
	<meta name="description" content={description} />
	{#if url}
		<link rel="canonical" href={url} />
	{/if}
	<meta property="og:title" content={fullTitle} />
	<meta property="og:description" content={description} />
	<meta property="og:type" content={type} />
	{#if url}
		<meta property="og:url" content={url} />
	{/if}
	{#if absoluteImage}
		<meta property="og:image" content={absoluteImage} />
	{/if}
	<meta name="twitter:card" content={cardType} />
	<meta name="twitter:title" content={fullTitle} />
	<meta name="twitter:description" content={description} />
	{#if absoluteImage}
		<meta name="twitter:image" content={absoluteImage} />
	{/if}
</svelte:head>
