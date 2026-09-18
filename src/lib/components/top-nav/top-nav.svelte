<script lang="ts">
	import { getTabspotAttributes } from 'tabspot';
	import { setTopNavContext, TABSPOT_ITEMS, TABSPOT_SKIP } from './top-nav.svelte.ts';
	import type { TopNavContext, TopNavProps } from './types.ts';

	let {
		ref = $bindable(),
		selectedValue = $bindable(''),
		onTabSelect,
		appearance = 'transparent',
		size = 'medium',
		vertical = false,
		disabled = false,
		selectTabOnFocus = false,
		reserveSelectedTabSpace = true,
		disableTabspot = false,
		class: classes,
		children,
		...attributes
	}: TopNavProps = $props();

	const context: TopNavContext = $state({
		config: {
			get appearance() {
				return appearance;
			},
			get size() {
				return size;
			},
			get vertical() {
				return vertical;
			},
			get disabled() {
				return disabled;
			},
			get selectTabOnFocus() {
				return selectTabOnFocus;
			},
			get reserveSelectedTabSpace() {
				return reserveSelectedTabSpace;
			}
		},
		state: {
			get selectedValue() {
				return selectedValue;
			},
			set selectedValue(value: string) {
				selectedValue = value;
			}
		},
		events: null,
		methods: {
			selectTab: (event: Event, value: string) => {
				if (selectedValue === value) return;
				selectedValue = value;
				onTabSelect?.(event, value);
			}
		}
	});

	setTopNavContext(context);

	/**
	 * A single tab stop for the whole strip: the arrows walk the items along the axis they are laid
	 * out on, and `Home`/`End` jump to the ends.
	 */
	const tabspotAttributes = $derived(
		!disableTabspot &&
			getTabspotAttributes({
				root: { manageSpecialKeys: { Home: true, End: true } },
				mover: {
					axis: vertical ? 'vertical' : 'horizontal',
					items: TABSPOT_ITEMS,
					skip: TABSPOT_SKIP
				}
			})
	);

	/** The circular appearances fill the selected item instead of underlining it. */
	const hasIndicator = $derived(appearance === 'transparent' || appearance === 'subtle');

	/** Where the bar sits along the axis, and how far it reaches. Both are read off the DOM. */
	let offset = $state(0);
	let extent = $state(0);
	let measured = $state(false);

	/**
	 * The bar belongs to the strip rather than to the selected item, which is what lets it travel:
	 * one element that stays mounted and moves, instead of one per item appearing and disappearing.
	 * That costs a measurement, since only the DOM knows where an item ended up.
	 *
	 * It spans the content of the item rather than its whole box, so the padding is taken off both
	 * ends — the same padding the item lays its own hover bar within.
	 */
	const measure = () => {
		const root = ref;
		if (!root) return;

		const item = [...root.querySelectorAll<HTMLElement>(TABSPOT_ITEMS)].find(
			(el) => el.dataset.value === selectedValue
		);
		if (!item) {
			measured = false;
			return;
		}

		const style = getComputedStyle(item);
		const before = parseFloat(vertical ? style.paddingTop : style.paddingLeft) || 0;
		const after = parseFloat(vertical ? style.paddingBottom : style.paddingRight) || 0;

		offset = (vertical ? item.offsetTop : item.offsetLeft) + before;
		extent = Math.max(0, (vertical ? item.offsetHeight : item.offsetWidth) - before - after);
		measured = true;
	};

	// The selection and the axis are what move the bar; both are read through `measure`.
	$effect(() => {
		measure();
	});

	/**
	 * Everything else that moves it does so through the layout: a label that rewrapped, a font that
	 * finished loading, an item that was added or removed. The observers are what catch those, since
	 * none of them is a change to a prop.
	 */
	$effect(() => {
		const root = ref;
		if (!root || !hasIndicator) return;

		const resize = new ResizeObserver(measure);
		const watch = () => {
			resize.disconnect();
			resize.observe(root);
			for (const item of root.querySelectorAll(TABSPOT_ITEMS)) resize.observe(item);
		};
		const mutations = new MutationObserver(() => {
			watch();
			measure();
		});

		watch();
		mutations.observe(root, { childList: true, subtree: true });

		return () => {
			resize.disconnect();
			mutations.disconnect();
		};
	});
</script>

<!--
	@component
	A top nav gives a single selection from a row of items, with a bar that travels to whichever one
	is selected. It owns the selection alone: what an item opens is rendered by the consumer.

	- Usage:
	```tsx
	<script>
		import { TopNav, TopNavItem } from 'fluentui-svelte';

		let selectedValue = $state('arrivals');
	</script>

	<TopNav bind:selectedValue aria-label="Flights">
		<TopNavItem value="arrivals">Arrivals</TopNavItem>
		<TopNavItem value="departures">Departures</TopNavItem>
	</TopNav>

	{#if selectedValue === 'arrivals'}
		<p>Arrivals</p>
	{/if}
	```
-->
<div
	bind:this={ref}
	role="tablist"
	aria-orientation={vertical ? 'vertical' : undefined}
	class={['fs-top-nav', appearance, size, { vertical }, classes]}
	{...tabspotAttributes}
	{...attributes}
>
	{@render children?.()}
	{#if hasIndicator && measured}
		<span
			class="fs-top-nav-indicator"
			aria-hidden="true"
			style:--fs-top-nav-indicator-offset="{offset}px"
			style:--fs-top-nav-indicator-extent="{extent}px"
		></span>
	{/if}
</div>

<style>
	.fs-top-nav {
		position: relative;
		display: flex;
		align-items: stretch;
		font-family: var(--fs-font-family-base);
		color: var(--fs-text-primary);
		/* Read by every item, so a size change ripples out of the strip alone. */
		--fs-top-nav-item-padding-inline: 0.625rem;
		--fs-top-nav-item-padding-block: 0.375rem;
		--fs-top-nav-item-font-size: var(--fs-body2-font-size);
		--fs-top-nav-item-line-height: var(--fs-body2-line-height);
		--fs-top-nav-item-gap: 0.5rem;
		--fs-top-nav-item-icon-size: 1.25rem;
		--fs-top-nav-bar-thickness: 0.1875rem;
		&.small {
			--fs-top-nav-item-padding-inline: 0.5rem;
			--fs-top-nav-item-padding-block: 0.375rem;
			--fs-top-nav-item-font-size: var(--fs-caption-font-size);
			--fs-top-nav-item-line-height: var(--fs-caption-line-height);
			--fs-top-nav-item-gap: 0.375rem;
			--fs-top-nav-item-icon-size: 1rem;
			--fs-top-nav-bar-thickness: 0.125rem;
		}
		&.large {
			--fs-top-nav-item-padding-block: 0.875rem;
			--fs-top-nav-item-font-size: var(--fs-body-font-size);
			--fs-top-nav-item-line-height: var(--fs-body-line-height);
		}
		&.vertical {
			flex-direction: column;
			align-items: stretch;
		}
	}

	/*
	 * The bar. It is placed from the measurement rather than laid out, so moving it is a transform
	 * the compositor can carry — and a transform is what keeps it on screen the whole way across,
	 * instead of leaving one item and arriving at the next.
	 */
	.fs-top-nav-indicator {
		position: absolute;
		left: 0;
		bottom: 0;
		width: var(--fs-top-nav-indicator-extent, 0);
		height: var(--fs-top-nav-bar-thickness);
		border-radius: var(--fs-top-nav-bar-thickness);
		background: var(--fs-accent-fill-default);
		/* `offsetLeft` is measured from the left whichever way the strip is written. */
		transform: translateX(var(--fs-top-nav-indicator-offset, 0));
		transition:
			transform var(--fs-normal-duration) var(--fs-point-to-point),
			width var(--fs-normal-duration) var(--fs-point-to-point),
			height var(--fs-normal-duration) var(--fs-point-to-point);
		pointer-events: none;
	}
	.fs-top-nav.vertical .fs-top-nav-indicator {
		top: 0;
		bottom: auto;
		/* The leading edge, so a strip written right to left grows its bar on the right. */
		left: auto;
		inset-inline-start: 0;
		width: var(--fs-top-nav-bar-thickness);
		height: var(--fs-top-nav-indicator-extent, 0);
		transform: translateY(var(--fs-top-nav-indicator-offset, 0));
	}
</style>
