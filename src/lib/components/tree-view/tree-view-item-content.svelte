<script lang="ts">
	import { Checkbox } from '$lib/index.js';
	import { RenderSoC } from '$internal';
	import ChevronRightRegular from 'fluentui-icons-svelte/ChevronRightRegular.svelte';
	import { getTreeViewContext, getTreeViewItemContext } from './tree-view.svelte.ts';
	import type { TreeViewItemLayoutProps } from './types.ts';

	let { actions, aside, expandIcon, iconBefore, iconAfter, ref, children, ...attributes }: TreeViewItemLayoutProps =
		$props();

	const TREE_VIEW_CONTEXT = getTreeViewContext();
	const ITEM_CONTEXT = getTreeViewItemContext();

	if (!TREE_VIEW_CONTEXT) throw new Error('TreeViewItemLayout must be used within a TreeView');
	if (!ITEM_CONTEXT) throw new Error('TreeViewItemContent must be used within a TreeViewItem');

	const { config, methods } = TREE_VIEW_CONTEXT;

	const { size } = config;

	const { handleCheck } = methods;
</script>

<!-- Presentational row. The interactive element is the parent treeitem (`<li>`); this
	div is plain markup so it is not exposed as a separate control. -->
<div
	class={['fs-tree-view-item-content', `size-${size}`, ITEM_CONTEXT.disabled && 'disabled']}
	style="--depth: {ITEM_CONTEXT.depth}"
	bind:this={ref}
	{...attributes}
>
	{#if expandIcon}
		<span class="fs-tree-view-item-expand-icon">
			<RenderSoC SoC={expandIcon} />
		</span>
	{/if}

	{#if ITEM_CONTEXT.type === 'branch'}
		<ChevronRightRegular width="1.2rem" class="branch-indicator" />
	{/if}

	<Checkbox
		hidden
		checked={ITEM_CONTEXT.checked}
		indeterminate={ITEM_CONTEXT.indeterminate}
		disabled={ITEM_CONTEXT.disabled}
		wrapperAttributes={{
			onclick: (e) => {
				e.stopPropagation();
				if (ITEM_CONTEXT.disabled) {
					e.preventDefault();
					return;
				}
				handleCheck(e, ITEM_CONTEXT.id, !ITEM_CONTEXT.checked);
			}
		}}
	/>

	{#if iconBefore}
		<span class="fs-tree-view-item-icon-before">
			<RenderSoC SoC={iconBefore} />
		</span>
	{/if}

	<span class="fs-tree-view-item-label" id="{ITEM_CONTEXT.id}-label">
		{@render children?.()}
	</span>

	{#if iconAfter}
		<span class="fs-tree-view-item-icon-after">
			<RenderSoC SoC={iconAfter} />
		</span>
	{/if}

	{#if aside}
		<span class="fs-tree-view-item-aside">
			<RenderSoC SoC={aside} />
		</span>
	{/if}

	{#if actions}
		<span class="fs-tree-view-item-actions">
			<RenderSoC SoC={actions} />
		</span>
	{/if}
</div>

<style>
	.fs-tree-view-item-content {
		display: flex;
		align-items: center;
		gap: 0.75rem;
		position: relative;
		border-radius: var(--fs-control-border-radius);
		font-size: var(--fs-body-font-size);
		cursor: pointer;
		outline: none;
		background: none;
		border: none;
		width: 100%;
		text-align: left;
		user-select: none;
		&.size-small {
			font-size: var(--fs-body2-font-size);
			padding: 0.125rem 0.5rem;
			padding-left: calc(0.5rem + 1.5rem * var(--depth, 0));
		}
		&.size-medium {
			font-size: var(--fs-body-font-size);
			padding: 0.25rem 0.625rem;
			padding-left: calc(0.625rem + 1.5rem * var(--depth, 0));
		}
		&.size-large {
			font-size: var(--fs-subtitle2-font-size);
			padding: 0.375rem 0.75rem;
			padding-left: calc(0.75rem + 1.5rem * var(--depth, 0));
		}

		&::after {
			content: '';
			display: block;
			width: 0.188rem;
			height: 0;
			background-color: var(--fs-accent-fill-default);
			position: absolute;
			left: 0;
			top: 50%;
			transform: translateY(-50%);
			border-radius: 1rem;
			transition: height 0.2s ease-in-out;
		}

		&:hover {
			background-color: var(--fs-subtle-fill-secondary);
		}

		&.selected {
			background-color: var(--fs-subtle-fill-secondary);

			&::after {
				height: 50%;
			}
		}

		&.disabled {
			opacity: 0.4;
			cursor: not-allowed;
			pointer-events: none;
		}

		:global(.tree-view-item-icon) {
			width: 1.25rem;
			height: 1.25rem;
			flex-shrink: 0;
			fill: currentColor;
		}
	}
</style>
