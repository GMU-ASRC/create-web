<script lang="ts">
	import Icon from '@iconify/svelte';
	import { onMount } from 'svelte';
	import type { SiteAlert } from '$lib/ts/site';

	let { alerts = [] }: { alerts?: SiteAlert[] } = $props();

	const storageKey = 'dismissed_alerts';
	let dismissed = $state<string[]>([]);

	function keyFor(alert: SiteAlert): string {
		return (alert.message ?? '').trim();
	}

	onMount(() => {
		try {
			const raw = localStorage.getItem(storageKey);
			if (raw) dismissed = JSON.parse(raw) as string[];
		} catch {
			void 0;
		}
	});

	const visible = $derived(
		alerts.filter((alert) => {
			if (alert.active === false) return false;
			if (!keyFor(alert)) return false;
			if (alert.dismissible !== false && dismissed.includes(keyFor(alert))) return false;
			return true;
		})
	);

	function dismiss(alert: SiteAlert) {
		dismissed = [...dismissed, keyFor(alert)];
		try {
			localStorage.setItem(storageKey, JSON.stringify(dismissed));
		} catch {
			void 0;
		}
	}

	type AlertStyle = { bg: string; border: string; text: string; accent: string; icon: string };

	const styles: Record<string, AlertStyle> = {
		info: {
			bg: 'bg-sky-950',
			border: 'border-sky-400/50',
			text: 'text-sky-50',
			accent: 'text-sky-300',
			icon: 'mdi:information-outline'
		},
		warning: {
			bg: 'bg-amber-950',
			border: 'border-amber-400/50',
			text: 'text-amber-50',
			accent: 'text-amber-300',
			icon: 'mdi:alert-outline'
		},
		success: {
			bg: 'bg-emerald-950',
			border: 'border-emerald-400/50',
			text: 'text-emerald-50',
			accent: 'text-emerald-300',
			icon: 'mdi:check-circle-outline'
		},
		error: {
			bg: 'bg-red-950',
			border: 'border-red-400/50',
			text: 'text-red-50',
			accent: 'text-red-300',
			icon: 'mdi:alert-circle-outline'
		}
	};

	function styleFor(level?: string): AlertStyle {
		return styles[level ?? 'info'] ?? styles.info;
	}
</script>

{#each visible as alert (keyFor(alert))}
	{@const style = styleFor(alert.level)}
	<div class="w-full border-b {style.bg} {style.border} {style.text}">
		<div class="flex w-full items-center gap-3 px-4 py-3 sm:px-6">
			<span
				class="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-white/10 {style.accent}"
			>
				<Icon icon={style.icon} width="20" />
			</span>
			<p class="flex-1 text-sm font-medium sm:text-[0.9375rem]">
				{alert.message}
				{#if alert.link}
					<a
						href={alert.link}
						target="_blank"
						rel="noopener noreferrer"
						class="ml-1 font-semibold underline underline-offset-2 transition-opacity hover:opacity-80 {style.accent}"
					>
						{alert.linkText || 'Learn more'}
					</a>
				{/if}
			</p>
			{#if alert.dismissible !== false}
				<button
					type="button"
					onclick={() => dismiss(alert)}
					class="shrink-0 rounded-full p-1.5 opacity-70 transition-all hover:bg-white/10 hover:opacity-100"
					aria-label="Dismiss alert"
				>
					<Icon icon="mdi:close" width="18" />
				</button>
			{/if}
		</div>
	</div>
{/each}
