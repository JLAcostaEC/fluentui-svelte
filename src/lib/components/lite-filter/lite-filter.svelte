<script lang="ts">
	import { on } from 'svelte/events';
	import { CaretGlyph } from '#internal';
	import { claimLabel } from '../label/label-context.ts';
	import { setLiteFilterContext } from './lite-filter-context.svelte.ts';
	import type { LiteFilterContext, LiteFilterProps } from './types.ts';

	let {
		ref = $bindable(null),
		selectedValue = $bindable(),
		multiple = false,
		name,
		form,
		disabled = false,
		size = 'medium',
		appearance = 'filled',
		onSelectionChange,
		previousLabel = 'Scroll back',
		nextLabel = 'Scroll forward',
		class: classes,
		children,
		...attributes
	}: LiteFilterProps = $props();

	// A Label around the filter names the group, and none of the pills claims it.
	const labelContext = claimLabel(() => undefined);

	let viewport: HTMLDivElement | null = $state(null);
	let canScrollBack = $state(false);
	let canScrollForward = $state(false);

	const selected = $derived(
		Array.isArray(selectedValue) ? selectedValue : selectedValue == null ? [] : [selectedValue]
	);

	setLiteFilterContext({
		config: {
			get multiple() {
				return multiple;
			},
			get name() {
				return name;
			},
			get form() {
				return form;
			},
			get disabled() {
				return disabled;
			},
			get size() {
				return size;
			},
			get appearance() {
				return appearance;
			}
		},
		state: null,
		events: null,
		methods: {
			isSelected: (value) => selected.includes(value),
			select: (event, value, checked) => {
				if (multiple) {
					selectedValue = checked ? [...selected, value] : selected.filter((v) => v !== value);
				} else if (checked) {
					selectedValue = value;
				} else return;
				onSelectionChange?.(event, selectedValue);
			}
		}
	} satisfies LiteFilterContext);

	// The arrows show only toward the side that hides pills. RTL scrolls with a negative offset.
	$effect(() => {
		const node = viewport;
		if (!node) return;

		const update = () => {
			const offset = Math.abs(node.scrollLeft);
			const max = node.scrollWidth - node.clientWidth;
			canScrollBack = offset > 1;
			canScrollForward = offset < max - 1;
		};

		update();
		const observer = new ResizeObserver(update);
		observer.observe(node);
		for (const child of node.children) observer.observe(child);
		const off = on(node, 'scroll', update, { passive: true });

		return () => {
			observer.disconnect();
			off();
		};
	});

	const scroll = (direction: -1 | 1) => {
		if (!viewport) return;
		const rtl = getComputedStyle(viewport).direction === 'rtl';
		viewport.scrollBy({ left: direction * (rtl ? -1 : 1) * viewport.clientWidth * 0.75, behavior: 'smooth' });
	};
</script>

<div
	{...attributes}
	bind:this={ref}
	class={['fs-lite-filter', classes]}
	role={attributes.role ?? (multiple ? 'group' : 'radiogroup')}
	aria-labelledby={attributes['aria-labelledby'] ?? (attributes['aria-label'] ? undefined : labelContext?.labelId)}
>
	<!-- Off the tab order: Tab moves through the pills, and a focused pill scrolls into view. -->
	{#if canScrollBack}
		<button
			type="button"
			class="fs-lite-filter-scroll"
			tabindex="-1"
			aria-label={previousLabel}
			onclick={() => scroll(-1)}
		>
			<CaretGlyph direction="left" />
		</button>
	{/if}
	<div class="fs-lite-filter-viewport" bind:this={viewport}>
		<div class="fs-lite-filter-items">
			{@render children?.()}
		</div>
	</div>
	{#if canScrollForward}
		<button type="button" class="fs-lite-filter-scroll" tabindex="-1" aria-label={nextLabel} onclick={() => scroll(1)}>
			<CaretGlyph direction="right" />
		</button>
	{/if}
</div>

<style>
	.fs-lite-filter {
		display: flex;
		align-items: center;
		gap: 0.25rem;
		max-inline-size: 100%;
		min-inline-size: 0;

		& .fs-lite-filter-viewport {
			flex: 0 1 auto;
			min-inline-size: 0;
			overflow-x: auto;
			overscroll-behavior-x: contain;
			scrollbar-width: none;
			/* Room for the focus outline of the pills. */
			padding: 0.25rem;
			margin: -0.25rem;
			&::-webkit-scrollbar {
				display: none;
			}
		}

		& .fs-lite-filter-items {
			display: flex;
			gap: 0.25rem;
			inline-size: max-content;
		}

		& .fs-lite-filter-scroll {
			display: flex;
			flex: none;
			align-items: center;
			justify-content: center;
			inline-size: 1.25rem;
			block-size: 1.5rem;
			margin: 0;
			padding: 0;
			border: none;
			border-radius: var(--fs-control-border-radius);
			background: none;
			color: var(--fs-text-primary);
			cursor: default;
			&:hover {
				background: var(--fs-subtle-fill-secondary);
			}
			&:active {
				background: var(--fs-subtle-fill-tertiary);
				color: var(--fs-text-secondary);
			}
			&:dir(rtl) :global(svg) {
				scale: -1 1;
			}
		}
	}
</style>
