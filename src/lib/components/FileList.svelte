<script lang="ts">
	import Icon from '@iconify/svelte';
	import { fileIcon, type FileAttachment } from '$lib/ts/files';

	let { files = [], heading = 'Files' }: { files?: FileAttachment[]; heading?: string } = $props();
</script>

{#if files.length}
	<div class="mt-12">
		<h2 class="text-lg font-bold text-slate-900">{heading}</h2>
		<ul class="mt-4 space-y-2">
			{#each files as file (file.path)}
				<li>
					<a
						href={file.path}
						target="_blank"
						rel="noopener noreferrer"
						download={file.name}
						class="flex items-center gap-3 rounded-lg border border-slate-200 bg-white px-4 py-3 text-sm text-slate-700 transition hover:border-gmu-green hover:text-gmu-green"
					>
						<Icon icon={fileIcon(file.name)} width="22" class="shrink-0 text-gmu-green" />
						<span class="min-w-0 flex-1 truncate">{file.name}</span>
						<Icon icon="mdi:download" width="18" class="shrink-0" />
					</a>
				</li>
			{/each}
		</ul>
	</div>
{/if}
