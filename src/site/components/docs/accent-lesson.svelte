<script lang="ts">
	import { getAccentPreference } from '#site/preferences.js';
	import { accentCss } from '#site/utils/accent-ramp.js';
	import AccentPresets from '#site/components/home/accent-presets.svelte';
	import RenderShiki from '#site/components/render-shiki/render-shiki.svelte';

	const accent = getAccentPreference();
	const code = $derived(accentCss(accent.ramp, accent.textColors));
</script>

<div class="accent-lesson">
	<AccentPresets accent={accent.color} select={accent.setColor} />
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
