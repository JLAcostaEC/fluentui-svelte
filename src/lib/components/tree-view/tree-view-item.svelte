<script lang="ts">
	import { onMount, tick } from 'svelte';
	import { PREFIX } from '$constants';
	import { defineProperty, defineState } from '$internal';
	import {
		getTreeViewDepth,
		getTreeViewContext,
		setTreeViewItemContext,
		getTreeViewItemContext
	} from './tree-view.svelte.ts';
	import type { TreeViewItemContext, TreeViewItemProps } from './types.ts';

	const COMPONENT_NAME = 'TreeViewItem';
	const FALLBACK_ID = $props.id();
	const ID = `${PREFIX}-${COMPONENT_NAME}-${FALLBACK_ID}`;

	const context = getTreeViewContext();

	const itemContext = getTreeViewItemContext();

	if (!context) throw new Error('TreeViewItem must be used within a TreeView');

	// Honor the `checked` and `open` props if provided, otherwise derive them from the parent tree's state.
	const { checkedItems, openItems } = context.state;

	let {
		ref,
		index,
		id = ID,
		disabled,
		value = id,
		indeterminate,
		type = 'item',
		open = (openItems instanceof Set ? openItems.has(id) : openItems.includes(id)) || undefined,
		checked = (checkedItems instanceof Set ? checkedItems.has(id) : checkedItems.includes(id)) || undefined,
		children,
		...attributes
	}: TreeViewItemProps = $props();

	const depth = getTreeViewDepth() ?? 0;

	const { config, methods } = context;

	const { size } = config;

	const itemState = defineState<TreeViewItemContext>([
		(o) => defineProperty(o, 'disabled', () => itemContext?.disabled ?? disabled),
		(o) => defineProperty(o, 'depth', () => depth),
		(o) => defineProperty(o, 'value', () => value),
		(o) => defineProperty(o, 'id', () => id),
		(o) => defineProperty(o, 'type', () => type),
		(o) => defineProperty(o, 'parentId', () => itemContext?.id),
		(o) =>
			defineProperty(
				o,
				'open',
				() => open,
				(v) => (open = v)
			),
		(o) =>
			defineProperty(
				o,
				'checked',
				() => checked,
				(v) => (checked = v)
			),
		(o) =>
			defineProperty(
				o,
				'indeterminate',
				() => indeterminate,
				(v) => (indeterminate = v)
			)
	]);

	setTreeViewItemContext(itemState);

	// Virtualized tree: the windowing library mounts/unmounts (and may reuse) rows as it
	// scrolls, so register via an effect that re-runs when the identity changes and cleans
	// up the previous id.
	if (config.virtualized && !itemContext) {
		$effect(() => {
			const _id: string = id;

			methods.registerItem(itemState);
			return () => methods.unregisterItem(_id);
		});
	} else {
		// Static tree: register this node once so a branch's tri-state can be derived from its
		// descendants.
		onMount(() => {
			methods.registerItem(itemState);
			return () => methods.unregisterItem(id);
		});
	}

	const isBranch = $derived(type === 'branch');
	const isVirtualRoot = $derived(config.virtualized && !itemContext);

	const handleClick = (e: MouseEvent) => {
		if (itemState.disabled) return;
		// Ignore clicks bubbling up from a descendant treeitem's own row.
		if ((e.target as HTMLElement).closest('.fs-tree-view-item') !== e.currentTarget) return;
		if (isBranch) {
			if (open) methods.closeItem(e, id);
			else methods.openItem(e, id);
		} else {
			methods.handleCheck(e, id, !checked);
		}
	};

	const handleKeydown = async (e: KeyboardEvent) => {
		if (e.target !== e.currentTarget || itemState.disabled) return;

		switch (e.key) {
			case 'Enter':
			case ' ':
				e.preventDefault();
				methods.handleCheck(e, id, !checked);
				break;
			case 'ArrowRight':
				if (isBranch && !open) {
					methods.openItem(e, id);

					// NOTE: This apparently works, maybe the problem is that TabSpot is losing the order of the items...
					// TODO: investigate further.
					if (config.virtualized) {
						await tick();

						const firstChildElement = ref?.querySelector(
							`:scope .fs-tree-view-item:not([aria-disabled="true"])[aria-level="${depth + 2}"]`
						) as HTMLElement;

						firstChildElement?.focus();
						return;
					}
				}
				break;
			case 'ArrowLeft':
				if (itemContext?.id) {
					methods.closeItem(e, itemContext?.id);
				}
				break;
		}
	};
</script>

<li
	{id}
	class={['fs-tree-view-item', `fs-tree-item-size-${size}`, { open }]}
	style="--depth: {depth}"
	role="treeitem"
	aria-expanded={type === 'branch' ? open : undefined}
	aria-checked={indeterminate ? 'mixed' : checked}
	aria-level={depth + 1}
	aria-labelledby="{id}-label"
	data-index={isVirtualRoot ? index : undefined}
	data-value={value}
	aria-disabled={itemState.disabled ? 'true' : undefined}
	onclick={handleClick}
	onkeydown={handleKeydown}
	bind:this={ref}
	{...attributes}
>
	{@render children?.()}
</li>

<style>
	.fs-tree-view-item {
		list-style: none;
		display: flex;
		flex-direction: column;
		/* The treeitem itself is the focus target; suppress its outline and show the
		   focus ring on its row instead. */
		outline: none;
		&:not(.open) :global(.fs-tree-view) {
			height: 0;
			overflow: hidden;
			opacity: 0;
		}
		&:focus-visible > :global(.fs-tree-view-item-content) {
			outline: 2px solid var(--fs-focus-stroke-outer);
			outline-offset: 2px;
		}
		&.open :global(.branch-indicator) {
			rotate: 90deg;
		}
	}
</style>
