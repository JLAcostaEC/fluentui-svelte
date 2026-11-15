<script lang="ts">
	import { on } from 'svelte/events';
	import type { Attachment } from 'svelte/attachments';

	import CaretUpFilled from 'fluentui-icons-svelte/CaretUpFilled.svelte';
	import CaretDownFilled from 'fluentui-icons-svelte/CaretDownFilled.svelte';

	import Tooltip from '../tooltip/tooltip.svelte';
	import { claimLabel } from '../label/label-context.ts';
	import { findAt, fromAnchor, layoutLabels, readLabels, readsContent, toAnchor, type Category } from './utils.ts';
	import type { AnnotatedScrollBarProps } from './types.ts';

	type Kind = Parameters<NonNullable<AnnotatedScrollBarProps['onScrolling']>>[1];

	const ID = $props.id();
	const INDICATOR_HEIGHT = 3;
	const labelContext = claimLabel(() => undefined);

	let {
		scrollRef,
		labels,
		selector = '[data-scroll-label]',
		position = 'right',
		arrowStep = 48,
		labelSpacing = 4,
		hideArrows = false,
		hideSubgroups = false,
		disabled = false,
		detail,
		onScrolling,
		ref = $bindable(null),
		class: classes,
		onkeydown,
		onpointerenter,
		onfocusin,
		onfocusout,
		...attributes
	}: AnnotatedScrollBarProps = $props();

	let scroll = $state({ offset: 0, maximum: 0, viewport: 0 });
	let categories = $state.raw<Category[]>([]);
	let rail = $state<HTMLDivElement>();
	let railHeight = $state(0);
	let labelHeight = $state(20);
	let anchor = $state<HTMLSpanElement>();

	// The content offset under the pointer, shown by the preview line and the detail.
	let hover = $state<{ offset: number; touch: boolean } | null>(null);
	let drag = $state<{ pointer: number; y: number; anchor: number } | null>(null);
	let focused = $state(false);
	let dismissed = $state(false);
	let overDetail = false;
	let repeatTimer: ReturnType<typeof setTimeout> | undefined;
	let closeTimer: ReturnType<typeof setTimeout> | undefined;

	const inert = $derived(disabled || !scrollRef || scroll.maximum <= 0);
	const extent = $derived(scroll.maximum + scroll.viewport);
	const scale = $derived(extent > 0 ? Math.max(0, railHeight - INDICATOR_HEIGHT) / extent : 0);
	const current = $derived(toAnchor(scroll.offset, scroll.maximum, scroll.viewport));
	const status = $derived(findAt(categories, current));

	const entries = $derived(
		categories
			.flatMap((category) => [category, ...(hideSubgroups ? [] : category.subgroups)])
			.sort((a, b) => a.offset - b.offset)
	);
	const tops = $derived(
		layoutLabels(
			entries.map((entry) => entry.offset * scale),
			labelHeight,
			railHeight,
			labelSpacing
		)
	);

	const previewOffset = $derived(hover?.offset ?? current);
	const preview = $derived({ offset: previewOffset, ...findAt(categories, previewOffset) });
	const describing = $derived(!!detail && focused && !dismissed && !inert);
	const showDetail = $derived(!inert && (!!hover || describing) && (!!detail || !!preview.label));

	/** The label and subgroups at a position, Ex: "2024: June, July". */
	const describe = ({ label, subgroups }: { label?: string; subgroups: string[] }) =>
		[label, subgroups.join(', ')].filter(Boolean).join(': ');

	function read(target: HTMLElement) {
		const maximum = Math.max(0, target.scrollHeight - target.clientHeight);
		return { offset: Math.min(maximum, Math.max(0, target.scrollTop)), maximum, viewport: target.clientHeight };
	}

	/** Reads the scroll range again before the bar is used: content can grow without resizing what the bar observes. */
	function sync() {
		if (scrollRef) scroll = read(scrollRef);
	}

	/** Follows the scroll position, the size of the content and, when the labels come from it, its changes. */
	const connect: Attachment = () => {
		const target = scrollRef;
		const source = labels ?? selector;
		if (!target) {
			scroll = { offset: 0, maximum: 0, viewport: 0 };
			categories = [];
			return;
		}

		const measure = () => {
			scroll = read(target);
			categories = readLabels(target, source);
		};

		// The size of the viewport and of its children gives the scroll height without watching every element.
		let observed = new Set<Element>();
		const observe = () => {
			const next = new Set([target, ...target.children]);
			for (const element of observed) if (!next.has(element)) resize.unobserve(element);
			for (const element of next) if (!observed.has(element)) resize.observe(element);
			observed = next;
		};

		let frame = 0;
		const schedule = () => {
			frame ||= requestAnimationFrame(() => {
				frame = 0;
				observe();
				measure();
			});
		};
		const resize = new ResizeObserver(schedule);
		const mutations = new MutationObserver(schedule);
		const dom = readsContent(source);
		mutations.observe(target, { childList: true, subtree: dom, attributes: dom, characterData: dom });
		observe();
		measure();

		const offs = [
			on(target, 'scroll', () => (scroll = read(target))),
			// Images and frames in the content change its height once they load; `load` does not bubble.
			on(target, 'load', schedule, { capture: true })
		];
		return () => {
			offs.forEach((off) => off());
			resize.disconnect();
			mutations.disconnect();
			cancelAnimationFrame(frame);
		};
	};

	const listenWheel: Attachment<HTMLDivElement> = (element) =>
		on(
			element,
			'wheel',
			(event) => {
				if (event.ctrlKey || !event.deltaY) return;
				const unit = event.deltaMode === 1 ? arrowStep : event.deltaMode === 2 ? scroll.viewport : 1;
				// The page keeps the wheel when the content cannot move.
				if (scrollTo(scroll.offset + event.deltaY * unit, 'wheel')) event.preventDefault();
			},
			{ passive: false }
		);

	function scrollTo(offset: number, kind: Kind) {
		sync();
		if (inert || !scrollRef) return false;

		const next = Math.min(scroll.maximum, Math.max(0, offset));
		if (next === scroll.offset || onScrolling?.(next, kind) === false) return false;

		scrollRef.scrollTo({ top: next, behavior: 'instant' });
		scroll = read(scrollRef);
		return true;
	}

	/** The content offset at the pointer. Pointer coordinates include CSS transforms; the rail height does not. */
	function pointerOffset(event: PointerEvent, from = 0) {
		const height = rail?.getBoundingClientRect().height;
		return height && scale ? ((event.clientY - from) * railHeight) / height / scale : 0;
	}

	function press(event: PointerEvent, offset?: number) {
		if (inert || event.button !== 0 || !event.isPrimary || !rail) return;

		event.preventDefault();
		event.stopPropagation();
		ref?.focus({ preventScroll: true });
		dismissed = false;

		const at = offset ?? pointerOffset(event, rail.getBoundingClientRect().top);
		hover = { offset: at, touch: event.pointerType === 'touch' };
		// A label scrolls its start to the top; the rail puts the indicator under the pointer.
		scrollTo(offset ?? fromAnchor(at, scroll.maximum, scroll.viewport), 'click');

		rail.setPointerCapture(event.pointerId);
		drag = { pointer: event.pointerId, y: event.clientY, anchor: current };
	}

	function move(event: PointerEvent, offset?: number) {
		const touch = event.pointerType === 'touch';
		if (drag) {
			if (event.pointerId !== drag.pointer) return;
			const anchor = drag.anchor + pointerOffset(event, drag.y);
			scrollTo(fromAnchor(anchor, scroll.maximum, scroll.viewport), 'drag');
			hover = { offset: current, touch };
		} else if (!inert && !dismissed && rail) {
			event.stopPropagation();
			hover = { offset: offset ?? pointerOffset(event, rail.getBoundingClientRect().top), touch };
		}
	}

	function release(event: PointerEvent) {
		if (drag?.pointer !== event.pointerId) return;
		drag = null;
		if (event.pointerType === 'touch' || event.type !== 'pointerup') hover = null;
	}

	function leave() {
		if (drag) return;
		dismissed = false;
		clearTimeout(closeTimer);
		// The detail stays while the pointer moves onto it.
		closeTimer = setTimeout(() => {
			if (!overDetail && !drag) hover = null;
		}, 300);
	}

	function pressArrow(event: PointerEvent, direction: 1 | -1) {
		if (event.button !== 0 || inert) return;

		event.preventDefault();
		ref?.focus({ preventScroll: true });
		(event.currentTarget as HTMLElement).setPointerCapture(event.pointerId);

		const step = () => scrollTo(scroll.offset + direction * arrowStep, 'arrow');
		const repeat = () => {
			if (step()) repeatTimer = setTimeout(repeat, 75);
		};
		clearTimeout(repeatTimer);
		if (step()) repeatTimer = setTimeout(repeat, 400);
	}

	function stopArrow() {
		clearTimeout(repeatTimer);
	}

	function keydown(event: KeyboardEvent & { currentTarget: EventTarget & HTMLDivElement }) {
		onkeydown?.(event);
		if (event.defaultPrevented) return;

		if (event.key === 'Escape') {
			dismissed = true;
			hover = null;
			return;
		}

		const { offset, maximum, viewport } = scroll;
		const keys: Record<string, number> = {
			ArrowUp: offset - arrowStep,
			ArrowDown: offset + arrowStep,
			PageUp: offset - viewport,
			PageDown: offset + viewport,
			Home: 0,
			End: maximum
		};
		if (inert || !(event.key in keys)) return;

		event.preventDefault();
		hover = null;
		dismissed = false;
		scrollTo(keys[event.key], 'keyboard');
	}

	$effect(() => () => {
		clearTimeout(repeatTimer);
		clearTimeout(closeTimer);
	});
</script>

<!-- @component
	A vertical scroll bar with labels for the content of an existing scrolling element.
	<AnnotatedScrollBar scrollRef={gallery} aria-label="Photo timeline" />
-->
<div
	{...attributes}
	bind:this={ref}
	{@attach connect}
	{@attach listenWheel}
	class={[
		'fs-annotated-scroll-bar',
		{
			'fs-annotated-scroll-bar-left': position === 'left',
			'fs-annotated-scroll-bar-dragging': drag,
			'fs-annotated-scroll-bar-disabled': inert
		},
		classes
	]}
	role="scrollbar"
	tabindex={inert ? -1 : 0}
	aria-labelledby={attributes['aria-labelledby'] ?? (attributes['aria-label'] ? undefined : labelContext?.labelId)}
	aria-controls={scrollRef?.id || undefined}
	aria-describedby={[attributes['aria-describedby'], describing && `fs-annotated-scroll-bar-detail-${ID}`]
		.filter(Boolean)
		.join(' ') || undefined}
	aria-orientation="vertical"
	aria-valuemin={0}
	aria-valuemax={scroll.maximum}
	aria-valuenow={Math.round(scroll.offset)}
	aria-valuetext={attributes['aria-valuetext'] ?? (describe(status) || undefined)}
	aria-disabled={inert || undefined}
	onkeydown={keydown}
	onpointerenter={(event) => {
		onpointerenter?.(event);
		sync();
	}}
	onfocusin={(event) => {
		onfocusin?.(event);
		sync();
		focused = true;
		dismissed = false;
	}}
	onfocusout={(event) => {
		onfocusout?.(event);
		focused = false;
		hover = null;
		stopArrow();
	}}
>
	{#if !hideArrows}{@render arrow(-1)}{/if}
	<!-- The scrollbar owns focus and the keyboard; the rail only takes the pointer. -->
	<div
		class="fs-annotated-scroll-bar-rail"
		aria-hidden="true"
		bind:this={rail}
		bind:clientHeight={railHeight}
		onpointerdown={(event) => press(event)}
		onpointermove={(event) => move(event)}
		onpointerenter={() => {
			overDetail = false;
			clearTimeout(closeTimer);
		}}
		onpointerleave={leave}
		onpointerup={release}
		onpointercancel={release}
		onlostpointercapture={release}
	>
		<span class="fs-annotated-scroll-bar-label fs-annotated-scroll-bar-strut" bind:offsetHeight={labelHeight}
			>&nbsp;</span
		>
		{#each entries as entry, index (index)}
			{@const top = tops[index]}
			<span
				role="presentation"
				class="fs-annotated-scroll-bar-label"
				style:translate="0 {top ?? 0}px"
				style:visibility={top === null ? 'hidden' : undefined}
				onpointerdown={(event) => press(event, entry.offset)}
				onpointermove={(event) => move(event, entry.offset)}>{entry.label}</span
			>
		{/each}
		<span class="fs-annotated-scroll-bar-indicator" style:top="{current * scale}px"></span>
		<span
			class={['fs-annotated-scroll-bar-preview', { 'fs-annotated-scroll-bar-touch': hover?.touch }]}
			style:visibility={hover ? undefined : 'hidden'}
			style:top="{Math.min(railHeight - INDICATOR_HEIGHT, previewOffset * scale)}px"
			><span class="fs-annotated-scroll-bar-anchor" bind:this={anchor}></span></span
		>
	</div>
	{#if !hideArrows}{@render arrow(1)}{/if}
</div>

{#snippet arrow(direction: 1 | -1)}
	<button
		type="button"
		class="fs-annotated-scroll-bar-arrow"
		tabindex="-1"
		aria-hidden="true"
		disabled={inert || (direction < 0 ? scroll.offset <= 0 : scroll.offset >= scroll.maximum)}
		onpointerdown={(event) => pressArrow(event, direction)}
		onpointerup={stopArrow}
		onpointercancel={stopArrow}
		onlostpointercapture={stopArrow}
	>
		{#if direction < 0}<CaretUpFilled />{:else}<CaretDownFilled />{/if}
	</button>
{/snippet}

{#snippet content()}
	{#if detail}{@render detail(preview)}{:else}{describe(preview)}{/if}
{/snippet}

{#if showDetail && anchor}
	<Tooltip
		id="fs-annotated-scroll-bar-detail-{ID}"
		target={anchor}
		open
		preventClose
		{content}
		placement={position === 'left' ? 'top-start' : 'top-end'}
		relationship={describing ? 'description' : 'inaccessible'}
		animationFrame
		class="fs-annotated-scroll-bar-detail"
		onpointerenter={() => {
			overDetail = true;
			clearTimeout(closeTimer);
		}}
		onpointerleave={() => {
			overDetail = false;
			hover = null;
		}}
		onVisibleChange={(visible) => {
			if (!visible) {
				dismissed = true;
				hover = null;
			}
		}}
	/>
{/if}

<style>
	.fs-annotated-scroll-bar {
		display: flex;
		flex-direction: column;
		box-sizing: border-box;
		min-width: 2.75rem;
		max-width: 12rem;
		min-height: 6rem;
		font-family: var(--fs-font-family-base);
		font-size: var(--fs-body-font-size);
		line-height: var(--fs-body-line-height);
		color: var(--fs-text-primary);
		user-select: none;
		border-radius: var(--fs-control-border-radius);

		&:focus-visible {
			outline: 2px solid var(--fs-focus-stroke-outer);
			outline-offset: 2px;
		}
		&.fs-annotated-scroll-bar-left {
			& .fs-annotated-scroll-bar-label {
				justify-self: start;
			}
			& .fs-annotated-scroll-bar-indicator,
			& .fs-annotated-scroll-bar-preview {
				right: auto;
				left: 0;
			}
			& .fs-annotated-scroll-bar-arrow {
				align-self: flex-start;
			}
		}
		&.fs-annotated-scroll-bar-dragging .fs-annotated-scroll-bar-preview {
			background: var(--fs-accent-fill-default);
		}
		&.fs-annotated-scroll-bar-disabled {
			color: var(--fs-text-disabled);

			& .fs-annotated-scroll-bar-indicator {
				background: var(--fs-accent-fill-disabled);
			}
			& .fs-annotated-scroll-bar-preview {
				visibility: hidden;
			}
		}
	}
	.fs-annotated-scroll-bar-rail {
		flex: 1;
		min-height: 0;
		position: relative;
		/* Labels share one cell: the widest one sets the width of the bar. */
		display: grid;
		grid-template-columns: minmax(0, 1fr);
		align-content: start;
		touch-action: none;
	}
	.fs-annotated-scroll-bar-label {
		grid-area: 1 / 1;
		justify-self: end;
		max-width: 100%;
		overflow: hidden;
		white-space: nowrap;
		text-overflow: ellipsis;
		cursor: pointer;

		&.fs-annotated-scroll-bar-strut {
			visibility: hidden;
			pointer-events: none;
		}
	}
	.fs-annotated-scroll-bar-indicator,
	.fs-annotated-scroll-bar-preview {
		position: absolute;
		right: 0;
		width: 1.875rem;
		height: 3px;
		border-radius: 1.5px;
		pointer-events: none;
	}
	.fs-annotated-scroll-bar-indicator {
		background: var(--fs-accent-fill-default);
	}
	.fs-annotated-scroll-bar-preview {
		background: var(--fs-control-strong-default);

		/* Keeps the detail above the finger. */
		&.fs-annotated-scroll-bar-touch .fs-annotated-scroll-bar-anchor {
			translate: 0 -2rem;
		}
	}
	.fs-annotated-scroll-bar-anchor {
		position: absolute;
		inset: 0;
	}
	.fs-annotated-scroll-bar-arrow {
		display: flex;
		align-items: center;
		justify-content: center;
		align-self: flex-end;
		flex: none;
		width: 1.875rem;
		height: 1.5rem;
		padding: 0;
		border: 0;
		border-radius: var(--fs-control-border-radius);
		background: transparent;
		color: var(--fs-text-secondary);
		cursor: pointer;
		transition: color var(--fs-fast-duration) var(--fs-point-to-point);

		& :global(svg) {
			width: 1rem;
			height: 1rem;
		}
		&:hover:not(:disabled) {
			color: var(--fs-text-primary);
		}
		&:active:not(:disabled) {
			color: var(--fs-text-tertiary);
		}
		&:disabled {
			color: var(--fs-text-disabled);
			cursor: default;
		}
	}
	:global(.fs-annotated-scroll-bar-detail) {
		max-width: 22.5rem;
		overflow-wrap: anywhere;
	}
	@media (prefers-reduced-motion: reduce) {
		.fs-annotated-scroll-bar-arrow {
			transition: none;
		}
	}
	@media (forced-colors: active) {
		.fs-annotated-scroll-bar-indicator,
		.fs-annotated-scroll-bar-dragging .fs-annotated-scroll-bar-preview {
			background: Highlight;
			forced-color-adjust: none;
		}
		.fs-annotated-scroll-bar-preview {
			background: CanvasText;
		}
	}
</style>
