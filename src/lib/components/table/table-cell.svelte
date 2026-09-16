<script lang="ts" generics="Tag extends 'td' | 'div' = 'td'">
	import { colIndex, focusGroup, getTag, requireTableContext } from './table.svelte.ts';
	import type { TableCellProps, TableDOM } from './types.ts';

	let {
		as,
		ref = $bindable(),
		focusMode = 'cell',
		class: classes,
		children,
		...attributes
	}: TableCellProps<Tag> = $props();

	const context = requireTableContext();

	const noNativeElements = $derived(context.config.noNativeElements);

	const _as = $derived(getTag(as, 'td', noNativeElements));

	/** A `grid` has no `cell`, only `gridcell`, so arrow navigation renames what the cell reports. */
	const enableTabspot = $derived(context.config.enableTabspot);

	const resizableColumns = $derived(context.config.resizableColumns);

	/** Set by the attachment, because only the DOM knows which column a cell ended up in. */
	let index = $state(-1);

	/**
	 * A fixed layout takes its columns from the header row alone, so a native cell needs no width of
	 * its own. A flex row has no columns to speak of, so every cell there carries one.
	 */
	const width = $derived(
		!resizableColumns || _as !== 'div' || index < 0 ? undefined : context.methods.getColumnWidth(index)
	);
</script>

<svelte:element
	this={_as}
	bind:this={ref as TableDOM[Tag]}
	role={enableTabspot ? 'gridcell' : _as === 'div' ? 'cell' : undefined}
	data-fs-focus-mode={enableTabspot ? focusMode : undefined}
	class={['fs-table-cell', { flex: _as === 'div', sized: width !== undefined }, classes]}
	style:width={width === undefined ? undefined : `${width}px`}
	{@attach enableTabspot || resizableColumns ? colIndex((i) => (index = i)) : undefined}
	{@attach enableTabspot && focusMode === 'group' ? focusGroup : undefined}
	{...attributes}
>
	{@render children?.()}
</svelte:element>

<style>
	.fs-table-cell {
		height: var(--fs-table-row-height);
		padding: 0 var(--fs-table-cell-padding);
		vertical-align: middle;
		/* The anchor `TableCellActions` pins itself to. */
		position: relative;
		&:focus-visible {
			outline: 0.125rem solid var(--fs-focus-stroke-outer);
			outline-offset: -0.125rem;
		}
		&.flex {
			display: flex;
			align-items: center;
			flex: 1 1 0;
			min-width: 0;
		}
		/* A resized column states its width, so it must not also stretch to fill the row. */
		&.sized {
			flex: 0 0 auto;
			overflow: hidden;
		}
	}
</style>
