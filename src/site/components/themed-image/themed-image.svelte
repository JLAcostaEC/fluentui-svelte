<script lang="ts">
	import type { Picture } from '@sveltejs/enhanced-img';
	import type { HTMLImgAttributes } from 'svelte/elements';

	type Props = Omit<HTMLImgAttributes, 'src' | 'alt'> & {
		/** Image shown with the light theme. */
		light: Picture;
		/** Image shown with the dark theme. */
		dark: Picture;
		alt: string;
	};

	let { light, dark, alt, class: classes, loading, fetchpriority, ...attributes }: Props = $props();
</script>

<!--
	@component
	Shows one of two optimized images depending on the theme. The theme lives in a class on `<html>`, so the swap is
	done in CSS: it needs no JavaScript and does not flash on load. `loading` and `fetchpriority` belong to the light
	image; the dark one is always lazy, so the browser only downloads it when the theme is dark.
-->
<enhanced:img src={light} {alt} {loading} {fetchpriority} class={['themed-light', classes]} {...attributes} />
<enhanced:img src={dark} {alt} loading="lazy" class={['themed-dark', classes]} {...attributes} />

<style>
	.themed-dark {
		display: none;
	}
	:global(html.dark) .themed-light,
	:global(html:has(.dark)) .themed-light {
		display: none;
	}
	:global(html.dark) .themed-dark,
	:global(html:has(.dark)) .themed-dark {
		display: revert;
	}
</style>
