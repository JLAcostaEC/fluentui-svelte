<script lang="ts" generics="T extends 'li' | 'a' | 'button' | 'div' = 'a'">
	import ListViewItem from '../list-view/list-view-item.svelte';
	import { RenderSoC } from '#internal';
	import { getSideNavContext } from './side-nav.ts';
	import type { SideNavItemProps } from './types.ts';
	import type { ListViewItemProps } from '../list-view/types.ts';

	let {
		as = 'a' as T,
		ref = $bindable(null),
		label,
		icon,
		children,
		onAction,
		...attributes
	}: SideNavItemProps<T> = $props();

	// Outside a SideNav the item is a plain, expanded one: it has no rail to fit and no panel to close.
	const context = getSideNavContext();
	const Item = ListViewItem<T>;
	const compact = $derived(context?.state.compact ?? false);

	function handleAction(event: MouseEvent, value: string) {
		onAction?.(event, value);
		context?.methods.activate(event);
	}
</script>

<Item
	{as}
	bind:ref
	aria-label={label}
	title={compact ? label : undefined}
	{...attributes as unknown as ListViewItemProps<T>}
	onAction={as === 'a' || as === 'button' || onAction ? handleAction : undefined}
>
	{#if icon}
		<span class="fs-side-nav-item-icon" aria-hidden="true">
			<RenderSoC SoC={icon} />
		</span>
	{:else if compact}
		<span class="fs-side-nav-item-icon" aria-hidden="true">
			{label.slice(0, 1)}
		</span>
	{/if}
	<span class="fs-side-nav-item-label" hidden={compact}>
		{#if children}
			{@render children()}
		{:else}
			{label}
		{/if}
	</span>
</Item>

<style>
	.fs-side-nav-item-icon {
		display: inline-flex;
		align-items: center;
		justify-content: center;
		flex: none;
		inline-size: 1rem;
		/* As tall as a line of text, so an item is as tall with its label as without it. */
		block-size: 1lh;
		& :global(svg) {
			inline-size: 1rem;
			block-size: 1rem;
		}
	}
	.fs-side-nav-item-label {
		min-inline-size: 0;
		overflow: hidden;
		text-overflow: ellipsis;
		white-space: nowrap;
	}
</style>
