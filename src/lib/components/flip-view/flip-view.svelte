<script lang="ts">
	import { on } from 'svelte/events';
	import { CaretGlyph } from '#internal';
	import type { FlipViewProps } from './types.ts';

	let {
		index = $bindable(0),
		orientation = 'horizontal',
		previousLabel = 'Previous',
		nextLabel = 'Next',
		onIndexChange,
		ref = $bindable(null),
		viewportRef = $bindable(null),
		children,
		class: classes,
		...attributes
	}: FlipViewProps = $props();

	/** Each direct child of the viewport is an item. */
	let count = $state(0);
	let childrenVersion = $state(0);
	const vertical = $derived(orientation === 'vertical');

	const reducedMotion = () => matchMedia('(prefers-reduced-motion: reduce)').matches;

	/** Snapped item from the scroll offset (negative in RTL). */
	const snapped = (viewport: HTMLElement) => {
		const size = vertical ? viewport.clientHeight : viewport.clientWidth;
		const offset = Math.abs(vertical ? viewport.scrollTop : viewport.scrollLeft);
		return size ? Math.round(offset / size) : 0;
	};

	const scrollTo = (viewport: HTMLElement, target: number, behavior: ScrollBehavior) => {
		const rtl = getComputedStyle(viewport).direction === 'rtl';
		viewport.scrollTo(
			vertical
				? { top: target * viewport.clientHeight, behavior }
				: { left: target * viewport.clientWidth * (rtl ? -1 : 1), behavior }
		);
	};

	const select = (target: number) => {
		const next = Math.max(0, Math.min(count - 1, target));
		if (next === index) return;
		index = next;
		onIndexChange?.(next);
	};

	// Settle the index when a scroll ends (swipe, wheel, buttons).
	$effect(() => {
		const viewport = viewportRef;
		if (!viewport) return;
		count = viewport.children.length;
		const observer = new MutationObserver(() => {
			count = viewport.children.length;
			childrenVersion += 1;
		});
		observer.observe(viewport, { childList: true });

		let timer: ReturnType<typeof setTimeout> | undefined;
		const settle = () => select(snapped(viewport));
		const onScroll = () => {
			clearTimeout(timer);
			timer = setTimeout(settle, 150);
		};
		const off = 'onscrollend' in window ? on(viewport, 'scrollend', settle) : on(viewport, 'scroll', onScroll);
		return () => {
			observer.disconnect();
			clearTimeout(timer);
			off();
		};
	});

	// Scroll to `index` when it changes; hidden items are inert to keep Tab on the visible one.
	let first = true;
	$effect(() => {
		const viewport = viewportRef;
		const target = index;
		void vertical;
		void childrenVersion;
		if (!viewport || !count) return;
		if (target < 0 || target >= count) {
			select(target);
			return;
		}
		[...viewport.children].forEach((item, i) => item.toggleAttribute('inert', i !== target));
		if (snapped(viewport) !== target) scrollTo(viewport, target, first || reducedMotion() ? 'instant' : 'smooth');
		first = false;
	});

	const onkeydown = (event: KeyboardEvent) => {
		if (event.target !== viewportRef) return;
		const rtl = getComputedStyle(event.currentTarget as HTMLElement).direction === 'rtl';
		const keys: Record<string, number> = vertical
			? { ArrowUp: index - 1, ArrowDown: index + 1 }
			: { ArrowLeft: index + (rtl ? 1 : -1), ArrowRight: index + (rtl ? -1 : 1) };
		keys.Home = 0;
		keys.End = count - 1;
		if (!(event.key in keys)) return;
		event.preventDefault();
		select(keys[event.key]);
	};
</script>

<div
	{...attributes}
	bind:this={ref}
	class={['fs-flip-view', orientation, classes]}
	role={attributes.role ?? 'region'}
	aria-roledescription={attributes['aria-roledescription'] ?? 'carousel'}
>
	<!-- Focusable for arrow, Home and End navigation. -->
	<!-- svelte-ignore a11y_no_noninteractive_tabindex, a11y_no_noninteractive_element_interactions -->
	<div class="viewport" role="group" tabindex="0" bind:this={viewportRef} {onkeydown} aria-live="polite">
		{@render children?.()}
	</div>
	{#if index > 0}
		<button type="button" class="nav previous" aria-label={previousLabel} onclick={() => select(index - 1)}>
			<CaretGlyph direction={vertical ? 'up' : 'left'} />
		</button>
	{/if}
	{#if index < count - 1}
		<button type="button" class="nav next" aria-label={nextLabel} onclick={() => select(index + 1)}>
			<CaretGlyph direction={vertical ? 'down' : 'right'} />
		</button>
	{/if}
</div>

<style>
	.fs-flip-view {
		position: relative;
		display: flex;
		inline-size: 100%;
		overflow: hidden;
		border-radius: var(--fs-control-overlay-border-radius);
		color: var(--fs-text-primary);

		& .viewport {
			display: flex;
			flex: 1;
			min-inline-size: 0;
			border-radius: inherit;
			overflow: auto hidden;
			overscroll-behavior: contain;
			scroll-snap-type: x mandatory;
			scrollbar-width: none;
			outline: none;
			&::-webkit-scrollbar {
				display: none;
			}
			& > :global(*) {
				flex: 0 0 100%;
				min-inline-size: 0;
				min-block-size: 0;
				scroll-snap-align: start;
				scroll-snap-stop: always;
			}
			& > :global(img),
			& > :global(video) {
				display: block;
				inline-size: 100%;
				block-size: 100%;
				object-fit: cover;
			}
			&:focus-visible {
				outline: 2px solid var(--fs-focus-stroke-outer);
				outline-offset: -2px;
			}
		}

		/* 16 × 38px edge tabs, shown on hover or keyboard focus. */
		& .nav {
			position: absolute;
			z-index: 1;
			display: flex;
			align-items: center;
			justify-content: center;
			margin: 0;
			padding: 0;
			border: 1px solid var(--fs-control-stroke-default);
			border-radius: var(--fs-control-border-radius);
			background: var(--fs-acrylic-background-default);
			color: var(--fs-text-secondary);
			cursor: default;
			opacity: 0;
			transition: opacity 0.167s;
			@media (prefers-reduced-motion: reduce) {
				transition: none;
			}
			inline-size: 16px;
			block-size: 38px;
			inset-block: 0;
			margin-block: auto;
			&.previous {
				inset-inline-start: 0;
			}
			&.next {
				inset-inline-end: 0;
			}
			&:hover {
				background:
					linear-gradient(var(--fs-subtle-fill-secondary), var(--fs-subtle-fill-secondary)),
					var(--fs-acrylic-background-default);
			}
			&:active {
				background:
					linear-gradient(var(--fs-subtle-fill-tertiary), var(--fs-subtle-fill-tertiary)),
					var(--fs-acrylic-background-default);
				color: var(--fs-text-tertiary);
			}
			@media (hover: none) {
				display: none;
			}
		}

		& .nav:focus-visible,
		&:hover .nav,
		&:has(.viewport:focus-visible) .nav {
			opacity: 1;
		}

		/* RTL: previous sits on the right; flip the carets. */
		&.horizontal:dir(rtl) .nav :global(svg) {
			scale: -1 1;
		}

		&.vertical {
			& .viewport {
				flex-direction: column;
				overflow: hidden auto;
				scroll-snap-type: y mandatory;
			}
			& .nav {
				inline-size: 38px;
				block-size: 16px;
				inset-block: auto;
				inset-inline: 0;
				margin: 0 auto;
				&.previous {
					inset-block-start: 0;
				}
				&.next {
					inset-block-end: 0;
				}
			}
		}
	}
</style>
