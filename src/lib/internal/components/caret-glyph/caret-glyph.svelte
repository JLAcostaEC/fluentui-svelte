<script lang="ts">
	import { CaretDownFilled, CaretLeftFilled, CaretRightFilled, CaretUpFilled } from 'fluentui-icons-svelte';

	/** A filled Fluent caret cropped to its glyph: `size` is the visible width (up/down) or height (left/right). */
	let { direction, size = 8 }: { direction: 'up' | 'down' | 'left' | 'right'; size?: number } = $props();

	// Each viewBox crops the 24px icon box to the glyph (+0.3 against antialias clipping). Depth = 0.643 × width.
	const glyphs = {
		up: { Icon: CaretUpFilled, viewBox: '4.55 7.7 14.9 9.58', across: true },
		down: { Icon: CaretDownFilled, viewBox: '4.55 7.7 14.9 9.58', across: true },
		left: { Icon: CaretLeftFilled, viewBox: '5.72 4.55 9.58 14.9', across: false },
		right: { Icon: CaretRightFilled, viewBox: '8.7 4.55 9.58 14.9', across: false }
	};
	const glyph = $derived(glyphs[direction]);
	const depth = $derived(+(size * 0.643).toFixed(2));
</script>

<glyph.Icon
	viewBox={glyph.viewBox}
	width={glyph.across ? size : depth}
	height={glyph.across ? depth : size}
	aria-hidden="true"
/>
