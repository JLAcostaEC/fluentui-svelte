<script lang="ts" generics="Tag extends ScrollBarGenerics = 'div'">
	import { mount, unmount, untrack } from 'svelte';
	import { on } from 'svelte/events';
	import { useOverlayScrollbars } from 'overlayscrollbars-svelte';
	import type { EventListeners, OverlayScrollbars, PartialOptions } from 'overlayscrollbars';
	import 'overlayscrollbars/styles/overlayscrollbars.css';
	import ScrollBarArrow from './scroll-bar-arrow.svelte';
	import type { ScrollBarProps, ScrollBarGenerics } from './types.ts';

	let {
		as = 'div' as Tag,
		ref = $bindable(null),
		scrollRef,
		viewportRef = $bindable(null),
		viewportAttributes,
		// eslint-disable-next-line no-useless-assignment -- written from OverlayScrollbars events, read by the parent
		instance = $bindable(null),
		expanded = false,
		collapseDelay = 2000,
		overflow = 'auto',
		autoHide = 'move',
		autoHideDelay = 1000,
		hideArrows = false,
		showFocusOutline = false,
		hideTrack = false,
		size = 'medium',
		arrowStep = 48,
		options,
		events,
		defer,
		children,
		class: classes,
		...attributes
	}: ScrollBarProps<Tag> = $props();

	/** Shared by the rendered element and `scrollRef`. */
	const modifiers = $derived({
		'fs-scroll-bar-arrows': !hideArrows,
		'fs-scroll-bar-expanded': expanded,
		'fs-scroll-bar-focus-outline': showFocusOutline,
		'fs-scroll-bar-no-track': hideTrack,
		'fs-scroll-bar-thin': size === 'thin',
		'fs-scroll-bar-large': size === 'large'
	});

	/** `scrollRef` passed (even `null`): render nothing and paint on it. */
	const external = $derived(scrollRef !== undefined);

	const axis = (enabled: boolean): 'scroll' | 'hidden' => (enabled ? 'scroll' : 'hidden');
	const mergedOptions = $derived<PartialOptions>({
		...options,
		overflow:
			overflow === 'auto'
				? options?.overflow
				: { x: axis(overflow !== 'y'), y: axis(overflow !== 'x'), ...options?.overflow },
		scrollbars: {
			theme: 'os-theme-fluent',
			clickScroll: true,
			autoHide: expanded ? 'never' : autoHide,
			autoHideDelay,
			...options?.scrollbars
		}
	});

	let current: OverlayScrollbars | null = null;
	let arrowComponents: Record<string, unknown>[] = [];
	let cleanups: (() => void)[] = [];

	/** A class instead of `:hover`: a CSS delay would freeze a half-finished expansion. */
	const trackHover = (scrollbar: HTMLElement) => {
		let timer: ReturnType<typeof setTimeout> | undefined;
		const enter = () => {
			clearTimeout(timer);
			scrollbar.classList.add('fs-scroll-bar-hover');
		};
		const leave = () => {
			clearTimeout(timer);
			timer = setTimeout(() => scrollbar.classList.remove('fs-scroll-bar-hover'), collapseDelay);
		};
		const offEnter = on(scrollbar, 'pointerenter', enter);
		const offLeave = on(scrollbar, 'pointerleave', leave);
		return () => {
			clearTimeout(timer);
			offEnter();
			offLeave();
			scrollbar.classList.remove('fs-scroll-bar-hover');
		};
	};

	const mountArrows = (osInstance: OverlayScrollbars) => {
		const { scrollbarHorizontal, scrollbarVertical, scrollOffsetElement } = osInstance.elements();
		const viewport = () => scrollOffsetElement;
		const step = () => arrowStep;
		for (const [target, directions] of [
			[scrollbarVertical.scrollbar, ['up', 'down']],
			[scrollbarHorizontal.scrollbar, ['left', 'right']]
		] as const) {
			cleanups.push(trackHover(target));
			for (const direction of directions) {
				arrowComponents.push(mount(ScrollBarArrow, { target, props: { direction, viewport, step } }));
			}
		}
	};
	const unmountArrows = () => {
		for (const cleanup of cleanups) cleanup();
		for (const component of arrowComponents) unmount(component);
		cleanups = [];
		arrowComponents = [];
	};

	/** OverlayScrollbars generates this viewport; the attributes are applied here. */
	const decorateViewport = (viewport: HTMLElement) => {
		if (!viewport.hasAttribute('tabindex')) viewport.setAttribute('tabindex', '0');
		for (const [name, value] of Object.entries(viewportAttributes ?? {})) {
			if (typeof value === 'string' || typeof value === 'number') viewport.setAttribute(name, String(value));
			else if (value === true) viewport.setAttribute(name, '');
		}
	};

	const [initialize] = useOverlayScrollbars({
		options: () => mergedOptions,
		events: (): EventListeners => {
			const extra = (name: 'initialized' | 'destroyed') => [events?.[name]].flat().filter(Boolean);
			return {
				...events,
				initialized: [
					(osInstance: OverlayScrollbars) => {
						current = instance = osInstance;
						if (external) {
							viewportRef = osInstance.elements().viewport;
							decorateViewport(viewportRef);
						}
						mountArrows(osInstance);
					},
					...extra('initialized')
				] as EventListeners['initialized'],
				destroyed: [
					() => {
						unmountArrows();
						current = instance = null;
					},
					...extra('destroyed')
				] as EventListeners['destroyed']
			};
		},
		defer: () => defer
	});

	$effect(() => {
		if (external) {
			const target = scrollRef;
			if (!target) return;
			target.classList.add('fs-scroll-bar');
			untrack(() => initialize(target));
			return () => {
				current?.destroy();
				target.classList.remove('fs-scroll-bar');
			};
		}
		const host = ref;
		const viewport = viewportRef;
		if (host && viewport) untrack(() => initialize({ target: host, elements: { viewport, content: viewport } }));
	});

	$effect(() => {
		const target = external ? scrollRef : null;
		if (!target) return;
		for (const [name, on] of Object.entries(modifiers)) target.classList.toggle(name, on);
		return () => target.classList.remove(...Object.keys(modifiers));
	});
</script>

{#if !external}
	<svelte:element
		this={as}
		{...attributes}
		bind:this={ref}
		data-overlayscrollbars-initialize=""
		class={['fs-scroll-bar', modifiers, classes]}
	>
		<!-- Focusable for keyboard scrolling. -->
		<!-- svelte-ignore a11y_no_noninteractive_tabindex -->
		<div tabindex="0" {...viewportAttributes} data-overlayscrollbars-contents="" bind:this={viewportRef}>
			{@render children?.()}
		</div>
	</svelte:element>
{/if}

<style>
	/* Global: `scrollRef` elements are not scoped. */
	:global {
		.fs-scroll-bar {
			/* Expanded geometry per size. */
			--fs-scroll-bar-track: 12px;
			--fs-scroll-bar-thumb: 6px;
			--fs-scroll-bar-glyph: 8px;
			--fs-scroll-bar-glyph-offset: 4px;
			--fs-scroll-bar-cap: 12px;
			position: relative;
			min-width: 0;
			min-height: 0;
			&.fs-scroll-bar-thin {
				--fs-scroll-bar-track: 8px;
				--fs-scroll-bar-thumb: 4px;
				--fs-scroll-bar-glyph: 6px;
				--fs-scroll-bar-glyph-offset: 3px;
				--fs-scroll-bar-cap: 9px;
			}
			&.fs-scroll-bar-large {
				--fs-scroll-bar-track: 16px;
				--fs-scroll-bar-thumb: 8px;
				--fs-scroll-bar-glyph: 10px;
				--fs-scroll-bar-glyph-offset: 5px;
				--fs-scroll-bar-cap: 15px;
			}
			& > [data-overlayscrollbars-viewport]:focus-visible {
				outline: none;
			}
			&.fs-scroll-bar-focus-outline > [data-overlayscrollbars-viewport]:focus-visible {
				outline: 2px solid var(--fs-focus-stroke-outer);
				outline-offset: -2px;
			}
			&:not(.fs-scroll-bar-arrows) .fs-scroll-bar-arrow {
				display: none;
			}

			/* Thumb: 2px at rest, 1px from the edge; centered when expanded. */
			& > .os-scrollbar {
				--os-size: var(--fs-scroll-bar-track);
				--os-padding-perpendicular: 0px;
				--os-padding-axis: 0px;
				--os-handle-min-size: 24px;
				--os-handle-max-size: none;
				--thumb: 2px;
				--inset: 1px;
				border-radius: calc(var(--os-size) / 2);
				background: transparent;
				transition:
					opacity 0.15s,
					visibility 0.15s,
					background-color 0.15s,
					padding 0.15s;
				& .os-scrollbar-track,
				& .os-scrollbar-track:hover,
				& .os-scrollbar-track:active {
					background: transparent;
					border-radius: inherit;
				}
				& .os-scrollbar-handle,
				& .os-scrollbar-handle:hover,
				& .os-scrollbar-handle:active {
					border: none;
					border-radius: calc(var(--fs-scroll-bar-thumb) / 2);
					background: var(--fs-control-strong-default);
					transition-property: width, height, right, left, bottom;
					transition-duration: 0.15s;
				}
				&.os-scrollbar-vertical .os-scrollbar-handle {
					width: var(--thumb);
					right: var(--inset);
				}
				&.os-scrollbar-vertical.os-scrollbar-rtl .os-scrollbar-handle {
					right: auto;
					left: var(--inset);
				}
				&.os-scrollbar-horizontal .os-scrollbar-handle {
					height: var(--thumb);
					bottom: var(--inset);
				}
			}
			/* .fs-scroll-bar-hover: added on pointer enter, removed `collapseDelay` after leave. */
			& > .os-scrollbar:is(.fs-scroll-bar-hover, :has(:active)),
			&.fs-scroll-bar-expanded > .os-scrollbar {
				--thumb: var(--fs-scroll-bar-thumb);
				--inset: calc((var(--fs-scroll-bar-track) - var(--fs-scroll-bar-thumb)) / 2);
				--os-padding-axis: var(--inset);
				background: var(--fs-acrylic-background-default);
			}
			&.fs-scroll-bar-no-track > .os-scrollbar.os-scrollbar {
				background: transparent;
			}
			&.fs-scroll-bar-arrows > .os-scrollbar:is(.fs-scroll-bar-hover, :has(:active)),
			&.fs-scroll-bar-arrows.fs-scroll-bar-expanded > .os-scrollbar {
				--os-padding-axis: var(--fs-scroll-bar-cap);
				& .fs-scroll-bar-arrow {
					opacity: 1;
					visibility: visible;
					transition:
						opacity 0.15s,
						visibility 0s;
				}
			}
		}
	}
</style>
