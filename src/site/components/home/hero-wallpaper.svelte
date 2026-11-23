<script lang="ts">
	import { onMount } from 'svelte';
	import { prefersReducedMotion } from 'svelte/motion';
	import { MediaQuery } from 'svelte/reactivity';
	import { getReducedMotion } from '#lib/providers/fluentui-svelte/fluentui-svelte.js';
	import { generateAccentRamp } from '#site/utils/accent-ramp.js';
	import { startWallpaper } from '#site/utils/hero-wallpaper.js';

	let { accent }: { accent: string } = $props();
	let bands: HTMLCanvasElement;
	let lines: HTMLCanvasElement;
	const getMotionPreference = getReducedMotion();
	const compact = new MediaQuery('(max-width: 600px)');
	let update = $state.raw<ReturnType<typeof startWallpaper>['update']>();

	onMount(() => {
		const wallpaper = startWallpaper(bands, lines);
		update = wallpaper.update;
		return wallpaper.destroy;
	});

	const colors = $derived(generateAccentRamp(accent));
	const still = $derived(compact.current || prefersReducedMotion.current || getMotionPreference());

	$effect(() => update?.(colors, still));
</script>

<div class="wallpaper" aria-hidden="true">
	<canvas class="bands" bind:this={bands}></canvas>
	<canvas class="lines" bind:this={lines}></canvas>
</div>

<style>
	.wallpaper {
		position: absolute;
		inset: 0;
		overflow: hidden;
		z-index: -1;
		pointer-events: none;
	}

	canvas {
		position: absolute;
		inset: 0;
		width: 100%;
		height: 100%;
	}

	.bands {
		filter: blur(clamp(1.25rem, 3.3vw, 3rem)) saturate(1.25);
		transform: scale(1.11);
	}

	.lines {
		mix-blend-mode: screen;
	}
</style>
