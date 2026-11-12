<script lang="ts">
	import { CaretDownFilled, CaretLeftFilled, CaretRightFilled, CaretUpFilled } from 'fluentui-icons-svelte';

	let {
		direction,
		viewport,
		step
	}: { direction: 'up' | 'down' | 'left' | 'right'; viewport: () => HTMLElement; step: () => number } = $props();

	// The Fluent carets sit inside a 24px box; each viewBox crops it to the glyph's bounding box
	// (plus 0.3 units so antialiasing never clips the tip) so it renders 8px wide.
	const icons = {
		up: { Icon: CaretUpFilled, viewBox: '4.55 7.7 14.9 9.58', width: 8, height: 5.14 },
		down: { Icon: CaretDownFilled, viewBox: '4.55 7.7 14.9 9.58', width: 8, height: 5.14 },
		left: { Icon: CaretLeftFilled, viewBox: '5.72 4.55 9.58 14.9', width: 5.14, height: 8 },
		right: { Icon: CaretRightFilled, viewBox: '8.7 4.55 9.58 14.9', width: 5.14, height: 8 }
	};
	const glyph = $derived(icons[direction]);

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
		window.removeEventListener('pointerup', stop);
		window.removeEventListener('pointercancel', stop);
	}

	function start(event: PointerEvent) {
		if (event.button !== 0) return;
		event.preventDefault();
		const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;
		scroll(reduced ? 'auto' : 'smooth');
		delay = setTimeout(() => (repeat = setInterval(() => scroll('auto'), 40)), 400);
		window.addEventListener('pointerup', stop);
		window.addEventListener('pointercancel', stop);
	}

	$effect(() => stop);
</script>

<button type="button" class="fs-scroll-bar-arrow {direction}" tabindex="-1" aria-hidden="true" onpointerdown={start}>
	<glyph.Icon viewBox={glyph.viewBox} width={glyph.width} height={glyph.height} />
</button>

<style>
	/* A 16px end cap of the 12px rail; the 8px glyph sits 4px from the end. */
	.fs-scroll-bar-arrow {
		position: absolute;
		display: flex;
		align-items: center;
		justify-content: center;
		margin: 0;
		padding: 0;
		border: none;
		border-radius: 6px;
		background: transparent;
		color: var(--fs-control-strong-default);
		/* Hidden at rest; visibility switches after the fade so it stays clickable while fading. */
		opacity: 0;
		visibility: hidden;
		pointer-events: auto;
		transition:
			opacity 0.15s,
			visibility 0s 0.15s;
		cursor: default;
		&.up,
		&.down {
			left: 0;
			width: 12px;
			height: 16px;
		}
		&.left,
		&.right {
			top: 0;
			width: 16px;
			height: 12px;
		}
		&.up {
			top: 0;
			align-items: flex-start;
			padding-top: 4px;
		}
		&.down {
			bottom: 0;
			align-items: flex-end;
			padding-bottom: 4px;
		}
		&.left {
			left: 0;
			justify-content: flex-start;
			padding-left: 4px;
		}
		&.right {
			right: 0;
			justify-content: flex-end;
			padding-right: 4px;
		}
		& :global(svg) {
			flex: none;
		}
	}
</style>
