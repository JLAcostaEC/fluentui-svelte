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

	const size = $derived(config.size);

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
				e.preventDefault();
				if (ITEM_CONTEXT.disabled) return;
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
		--chevron-width: 1.2rem;
		--gap: 0.75rem;
		box-sizing: border-box;
		display: flex;
		align-items: center;
		gap: var(--gap);
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
		&:not(:has(:global(.branch-indicator))) {
			--leaf-offset: calc(var(--chevron-width) + var(--gap) + 0rem);
		}
		&.size-small {
			font-size: var(--fs-body2-font-size);
			padding: 0.125rem 0.5rem;
			padding-left: calc(0.5rem + 2rem * var(--depth, 0) + var(--leaf-offset, 0rem));
			min-height: 1.75rem;
		}
		&.size-medium {
			font-size: var(--fs-body-font-size);
			padding: 0.25rem 0.625rem;
			padding-left: calc(0.625rem + 2rem * var(--depth, 0) + var(--leaf-offset, 0rem));
			min-height: 2rem;
		}
		&.size-large {
			font-size: var(--fs-subtitle2-font-size);
			padding: 0.375rem 0.75rem;
			padding-left: calc(0.75rem + 2rem * var(--depth, 0) + var(--leaf-offset, 0rem));
			min-height: 2.25rem;
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
	.fs-tree-view-item-icon-before,
	.fs-tree-view-item-icon-after,
	.fs-tree-view-item-aside,
	.fs-tree-view-item-actions {
		display: inline-flex;
		align-items: center;
		flex-shrink: 0;
	}
	.fs-tree-view-item-aside,
	.fs-tree-view-item-actions {
		margin-left: auto;
	}
	.fs-tree-view-item-aside + .fs-tree-view-item-actions {
		margin-left: 0;
	}
	.fs-tree-view-item-actions {
		opacity: 0;
		@media (hover: none) {
			opacity: 1;
		}
	}
	.fs-tree-view-item-content:hover .fs-tree-view-item-actions,
	.fs-tree-view-item-content:focus-within .fs-tree-view-item-actions,
	:global(.fs-tree-view-item:focus-visible) > .fs-tree-view-item-content .fs-tree-view-item-actions {
		opacity: 1;
	}
</style>
