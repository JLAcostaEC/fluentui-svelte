<script lang="ts">
	import { CaretGlyph } from '#internal';

	let {
		direction,
		viewport,
		step
	}: { direction: 'up' | 'down' | 'left' | 'right'; viewport: () => HTMLElement; step: () => number } = $props();

	let delay: ReturnType<typeof setTimeout> | undefined;
	let repeat: ReturnType<typeof setInterval> | undefined;

	function scroll(behavior: ScrollBehavior) {
		const sign = direction === 'up' || direction === 'left' ? -1 : 1;
		const distance = sign * step();
		const vertical = direction === 'up' || direction === 'down';
		viewport().scrollBy({ top: vertical ? distance : 0, left: vertical ? 0 : distance, behavior });
	}

	function stop() {
		clearTimeout(delay);
		clearInterval(repeat);
	}

	function start(event: PointerEvent) {
		if (event.button !== 0) return;
		event.preventDefault();
		const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;
		scroll(reduced ? 'auto' : 'smooth');
		delay = setTimeout(() => (repeat = setInterval(() => scroll('auto'), 40)), 400);
	}

	$effect(() => stop);
</script>

<!-- The press can end anywhere, not only over the arrow. -->
<svelte:window onpointerup={stop} onpointercancel={stop} />

<button type="button" class="fs-scroll-bar-arrow {direction}" tabindex="-1" aria-hidden="true" onpointerdown={start}>
	<CaretGlyph {direction} />
</button>

<style>
	/* Rail end cap; the glyph sits --fs-scroll-bar-glyph-offset from the end. */
	.fs-scroll-bar-arrow {
		--track: var(--fs-scroll-bar-track, 12px);
		--cap: var(--fs-scroll-bar-cap, 12px);
		--glyph: var(--fs-scroll-bar-glyph, 8px);
		--gap: var(--fs-scroll-bar-glyph-offset, 4px);
		position: absolute;
		display: flex;
		align-items: center;
		justify-content: center;
		margin: 0;
		padding: 0;
		border: none;
		border-radius: calc(var(--track) / 2);
		background: transparent;
		color: var(--fs-control-strong-default);
		/* visibility switches after the fade: clickable while fading. */
		opacity: 0;
		visibility: hidden;
		pointer-events: auto;
		transition:
			opacity 0.15s,
			visibility 0s 0.15s;
		cursor: default;
		/* The cropped carets are 0.643 times as deep as they are wide. */
		&.up,
		&.down {
			left: 0;
			width: var(--track);
			height: var(--cap);
			& :global(svg) {
				width: var(--glyph);
				height: calc(var(--glyph) * 0.643);
			}
		}
		&.left,
		&.right {
			top: 0;
			width: var(--cap);
			height: var(--track);
			& :global(svg) {
				width: calc(var(--glyph) * 0.643);
				height: var(--glyph);
			}
		}
		&.up {
			top: 0;
			align-items: flex-start;
			padding-top: var(--gap);
		}
		&.down {
			bottom: 0;
			align-items: flex-end;
			padding-bottom: var(--gap);
		}
		&.left {
			left: 0;
			justify-content: flex-start;
			padding-left: var(--gap);
		}
		&.right {
			right: 0;
			justify-content: flex-end;
			padding-right: var(--gap);
		}
		& :global(svg) {
			flex: none;
		}
	}
</style>
