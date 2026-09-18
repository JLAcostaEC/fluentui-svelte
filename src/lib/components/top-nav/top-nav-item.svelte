<script lang="ts" generics="T extends TopNavItemGenerics = 'button'">
	import { invokeHandlers, RenderSoC } from '$internal';
	import { COMPONENT_NAME, requireTopNavContext } from './top-nav.svelte.ts';
	import type { TopNavItemElementDOMType, TopNavItemGenerics, TopNavItemProps } from './types.ts';

	const ID = $props.id();

	let {
		as = 'button' as T,
		ref = $bindable(),
		value = `${COMPONENT_NAME}-${ID}`,
		icon,
		disabled,
		onclick,
		onfocus,
		class: classes,
		children,
		...attributes
	}: TopNavItemProps<T> = $props();

	const context = requireTopNavContext();

	const selected = $derived(context.state.selectedValue === value);

	/** The item can be disabled on its own, and the strip can disable every one of them at once. */
	const _disabled = $derived(disabled || context.config.disabled);

	/**
	 * The tag the invariant rules over. The markup renders it through here, so it is checked during
	 * SSR and on every prop update rather than only once on mount.
	 */
	const _as = $derived.by(() => {
		if (as !== 'button' && as !== 'a') throw new Error(`Invalid tag: ${as}. Must be one of button, a`);
		return as;
	});
</script>

<!--
	@component
	A single item of a `TopNav`. It reports its own selection and can carry an icon.

	- Usage:
	```tsx
	<script>
		import { TopNav, TopNavItem } from 'fluentui-svelte';
		import { AirplaneRegular } from 'fluentui-icons-svelte';
	</script>

	<TopNav selectedValue="arrivals" aria-label="Flights">
		<TopNavItem value="arrivals" icon={AirplaneRegular}>Arrivals</TopNavItem>
		<TopNavItem as="a" href="/departures" value="departures">Departures</TopNavItem>
	</TopNav>
	```
-->
<svelte:element
	this={_as}
	bind:this={ref as TopNavItemElementDOMType[T]}
	type={_as === 'button' ? 'button' : undefined}
	role="tab"
	data-value={value}
	aria-selected={selected}
	disabled={_as === 'button' ? _disabled : undefined}
	aria-disabled={_as === 'a' && _disabled ? true : undefined}
	class={[
		'fs-top-nav-item',
		context.config.appearance,
		{ selected, vertical: context.config.vertical, disabled: _disabled },
		classes
	]}
	onclick={(e: MouseEvent) => invokeHandlers(e, _disabled, [() => context.methods.selectTab(e, value), onclick])}
	onfocus={(e: FocusEvent) =>
		invokeHandlers(e, _disabled, [
			() => context.config.selectTabOnFocus && context.methods.selectTab(e, value),
			onfocus
		])}
	{...attributes}
>
	{#if icon}
		<span class="fs-top-nav-item-icon">
			<RenderSoC SoC={icon} />
		</span>
	{/if}
	<span class="fs-top-nav-item-content">
		{@render children?.()}
		{#if context.config.reserveSelectedTabSpace}
			<!--
				The label again, in the weight it takes once selected, laid out but never shown. The item
				is then already as wide as its widest state, so selecting it cannot shove its neighbours
				along. It is held out of the accessibility tree, where it would read as a second label.
			-->
			<span class="fs-top-nav-item-reserve" aria-hidden="true">{@render children?.()}</span>
		{/if}
	</span>
</svelte:element>

<style>
	.fs-top-nav-item {
		position: relative;
		display: flex;
		flex: 0 0 auto;
		align-items: center;
		justify-content: center;
		gap: var(--fs-top-nav-item-gap, 0.5rem);
		padding: var(--fs-top-nav-item-padding-block, 0.375rem) var(--fs-top-nav-item-padding-inline, 0.375rem);
		border: none;
		border-radius: var(--fs-control-border-radius);
		background: transparent;
		color: var(--fs-text-secondary);
		font-family: inherit;
		font-size: var(--fs-top-nav-item-font-size, var(--fs-body2-font-size));
		line-height: var(--fs-top-nav-item-line-height, var(--fs-body2-line-height));
		white-space: nowrap;
		/* An anchor arrives underlined and in the colour of a link; an item is neither. */
		text-decoration: none;
		cursor: pointer;
		user-select: none;
		outline: none;
		transition:
			color var(--fs-fast-duration) var(--fs-point-to-point),
			background var(--fs-fast-duration) var(--fs-point-to-point);
		&:hover {
			color: var(--fs-text-primary);
		}
		&:active {
			color: var(--fs-text-secondary);
		}
		&:focus-visible {
			outline: 0.125rem var(--fs-focus-stroke-outer) solid;
			outline-offset: 0.125rem;
		}
		&.selected {
			color: var(--fs-text-primary);
			font-weight: 600;
		}
		/* An anchor has no `:disabled` of its own, so the class is what both tags answer to. */
		&.disabled {
			color: var(--fs-text-disabled);
			cursor: not-allowed;
		}
		/*
		 * The line an item shows under itself while the pointer is on it. It is the item's own, not
		 * the bar of the strip: the bar belongs to whatever is selected and never leaves it.
		 */
		&::after {
			content: '';
			position: absolute;
			left: var(--fs-top-nav-item-padding-inline, 0.375rem);
			right: var(--fs-top-nav-item-padding-inline, 0.375rem);
			bottom: 0;
			height: var(--fs-top-nav-bar-thickness, 0.1875rem);
			border-radius: var(--fs-top-nav-bar-thickness, 0.1875rem);
			background: var(--fs-control-strong-stroke-disabled);
			opacity: 0;
			transition: opacity var(--fs-fast-duration) var(--fs-point-to-point);
			pointer-events: none;
		}
		&:hover:not(.selected):not(.disabled)::after {
			opacity: 1;
		}
		&.vertical::after {
			left: auto;
			right: auto;
			inset-inline-start: 0;
			top: var(--fs-top-nav-item-padding-block, 0.375rem);
			bottom: var(--fs-top-nav-item-padding-block, 0.375rem);
			width: var(--fs-top-nav-bar-thickness, 0.1875rem);
			height: auto;
		}
		&.subtle {
			&:hover:not(.disabled) {
				background: var(--fs-subtle-fill-secondary);
			}
			&:active:not(.disabled) {
				background: var(--fs-subtle-fill-tertiary);
			}
		}
		/* A pill takes the place of the bar, so the hover line steps aside for it. */
		&.subtle-circular,
		&.filled-circular {
			border-radius: 999rem;
			&::after {
				content: none;
			}
			&:hover:not(.disabled) {
				background: var(--fs-subtle-fill-secondary);
			}
			&:active:not(.disabled) {
				background: var(--fs-subtle-fill-tertiary);
			}
		}
		&.filled-circular {
			background: var(--fs-subtle-fill-secondary);
		}
		&.subtle-circular.selected {
			background: var(--fs-system-attention-bg);
			box-shadow: inset 0 0 0 1px color-mix(in srgb, var(--fs-system-attention-text), transparent 50%);
			color: var(--fs-system-attention-text);
		}
		&.filled-circular.selected {
			background: var(--fs-accent-fill-default);
			color: var(--fs-text-on-accent-primary);
			&:hover:not(.disabled) {
				background: var(--fs-accent-fill-secondary);
			}
			&:active:not(.disabled) {
				background: var(--fs-accent-fill-tertiary);
			}
			&.disabled {
				background: var(--fs-accent-fill-disabled);
				color: var(--fs-text-on-accent-disabled);
			}
		}
		& .fs-top-nav-item-icon {
			display: flex;
			flex: 0 0 auto;
			align-items: center;
			justify-content: center;
			& :global(svg) {
				width: var(--fs-top-nav-item-icon-size, 1.25rem);
				height: var(--fs-top-nav-item-icon-size, 1.25rem);
			}
		}
		& .fs-top-nav-item-content {
			display: block;
		}
		& .fs-top-nav-item-reserve {
			display: block;
			height: 0;
			overflow: hidden;
			visibility: hidden;
			font-weight: 600;
		}
	}
</style>
