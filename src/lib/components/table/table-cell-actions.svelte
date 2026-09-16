<script lang="ts">
	import { requireTableContext } from './table.svelte.ts';
	import type { TableCellActionsProps } from './types.ts';

	let { ref = $bindable(), visible = false, class: classes, children, ...attributes }: TableCellActionsProps = $props();

	requireTableContext();
</script>

<!--
	@component
	Actions pinned to the end of a cell, revealed while the row is hovered or holds the focus.

	- Usage:
	```tsx
	<TableCell>
		<TableCellLayout>Meeting notes</TableCellLayout>
		<TableCellActions>
			<Button appearance="subtle" icon={EditRegular} aria-label="Edit" />
		</TableCellActions>
	</TableCell>
	```
-->
<div bind:this={ref} class={['fs-table-cell-actions', { visible }, classes]} {...attributes}>
	{@render children?.()}
</div>

<style>
	.fs-table-cell-actions {
		position: absolute;
		top: 0;
		right: 0;
		display: flex;
		align-items: center;
		gap: 0.25rem;
		height: 100%;
		padding-right: var(--fs-table-cell-padding);
		/* Set by the row, so the actions surface on hover and while the focus is inside it. */
		opacity: var(--fs-table-row-active, 0);
		transition: opacity var(--fs-fast-duration) var(--fs-point-to-point);
		@media (prefers-reduced-motion: reduce) {
			transition: none;
		}
		&.visible {
			opacity: 1;
		}
	}
</style>
