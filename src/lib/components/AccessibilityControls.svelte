<script lang="ts">
	import Icon from '@iconify/svelte';
	import { onMount } from 'svelte';
	import { browser } from '$app/environment';

	const scales = [0.9, 1, 1.15, 1.3];

	let scaleIndex = $state(1);
	let highContrast = $state(false);
	let reduceMotion = $state(false);
	let darkMode = $state(false);

	onMount(() => {
		const savedScale = scales.indexOf(Number(localStorage.getItem('a11y-font-scale')));
		if (savedScale !== -1) scaleIndex = savedScale;
		highContrast = localStorage.getItem('a11y-contrast') === '1';
		reduceMotion = localStorage.getItem('a11y-reduce-motion') === '1';
		darkMode = localStorage.getItem('a11y-dark') === '1';
		apply();
	});

	function apply() {
		if (!browser) return;
		const root = document.documentElement;
		root.style.fontSize = `${scales[scaleIndex] * 100}%`;
		root.classList.toggle('a11y-contrast', highContrast);
		root.classList.toggle('a11y-reduce-motion', reduceMotion);
		root.classList.toggle('a11y-dark', darkMode);
	}

	function setScale(index: number) {
		scaleIndex = Math.min(scales.length - 1, Math.max(0, index));
		localStorage.setItem('a11y-font-scale', String(scales[scaleIndex]));
		apply();
	}

	function toggleContrast() {
		highContrast = !highContrast;
		localStorage.setItem('a11y-contrast', highContrast ? '1' : '0');
		apply();
	}

	function toggleMotion() {
		reduceMotion = !reduceMotion;
		localStorage.setItem('a11y-reduce-motion', reduceMotion ? '1' : '0');
		apply();
	}

	function toggleDark() {
		darkMode = !darkMode;
		localStorage.setItem('a11y-dark', darkMode ? '1' : '0');
		apply();
	}

	const toggleIdle = 'border-white/25 text-white/80 hover:bg-white/10';
	const toggleActive = 'border-gmu-gold bg-gmu-gold text-gmu-green-dark';
</script>

<div class="flex flex-wrap items-center gap-x-6 gap-y-3">
	<span class="inline-flex items-center gap-1.5 text-xs font-semibold tracking-widest text-gmu-gold uppercase">
		<Icon icon="mdi:human" width="16" />
		Accessibility
	</span>

	<div class="flex items-center gap-2">
		<span class="text-xs text-white/70">Text size</span>
		<div class="inline-flex overflow-hidden rounded-lg border border-white/25">
			<button
				type="button"
				class="px-2.5 py-1 text-sm transition-colors hover:bg-white/10 disabled:cursor-not-allowed disabled:opacity-40"
				onclick={() => setScale(scaleIndex - 1)}
				disabled={scaleIndex === 0}
				aria-label="Decrease text size"
			>
				A&minus;
			</button>
			<button
				type="button"
				class="border-x border-white/25 px-2.5 py-1 text-sm transition-colors hover:bg-white/10"
				onclick={() => setScale(1)}
				aria-label="Reset text size"
			>
				A
			</button>
			<button
				type="button"
				class="px-2.5 py-1 text-sm transition-colors hover:bg-white/10 disabled:cursor-not-allowed disabled:opacity-40"
				onclick={() => setScale(scaleIndex + 1)}
				disabled={scaleIndex === scales.length - 1}
				aria-label="Increase text size"
			>
				A+
			</button>
		</div>
	</div>

	<button
		type="button"
		onclick={toggleDark}
		aria-pressed={darkMode}
		class="inline-flex items-center gap-1.5 rounded-lg border px-3 py-1 text-sm transition-colors {darkMode
			? toggleActive
			: toggleIdle}"
	>
		<Icon icon={darkMode ? 'mdi:weather-night' : 'mdi:weather-sunny'} width="16" />
		Dark mode
	</button>

	<button
		type="button"
		onclick={toggleContrast}
		aria-pressed={highContrast}
		class="inline-flex items-center gap-1.5 rounded-lg border px-3 py-1 text-sm transition-colors {highContrast
			? toggleActive
			: toggleIdle}"
	>
		<Icon icon="mdi:contrast-circle" width="16" />
		High contrast
	</button>

	<button
		type="button"
		onclick={toggleMotion}
		aria-pressed={reduceMotion}
		class="inline-flex items-center gap-1.5 rounded-lg border px-3 py-1 text-sm transition-colors {reduceMotion
			? toggleActive
			: toggleIdle}"
	>
		<Icon icon="mdi:motion-pause" width="16" />
		Reduce motion
	</button>
</div>
