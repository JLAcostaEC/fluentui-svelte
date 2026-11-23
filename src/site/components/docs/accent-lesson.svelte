<script lang="ts">
	import { getAccentPreference } from '#site/preferences.js';
	import { accentCss, defaultAccent, generateAccentRamp, normalizeAccent } from '#site/utils/accent-ramp.js';
	import AccentPresets from '#site/components/home/accent-presets.svelte';
	import RenderShiki from '#site/components/render-shiki/render-shiki.svelte';

	const storedAccent = getAccentPreference();
	const accent = $derived(normalizeAccent(storedAccent.current) ?? defaultAccent);
	const code = $derived(accentCss(generateAccentRamp(accent)));
</script>

<div class="accent-lesson">
	<AccentPresets {accent} select={(color) => (storedAccent.current = color)} />
	<RenderShiki {code} lang="css" />
</div>

<style>
	.accent-lesson {
		display: grid;
		grid-template-columns: minmax(0, 1fr);
		gap: 0.75rem;
		width: 100%;
		min-width: 0;
	}
</style>
