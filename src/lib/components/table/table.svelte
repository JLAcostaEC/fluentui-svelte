<script lang="ts" generics="Tag extends 'table' | 'div' = 'table'">
	import { onMount, tick } from 'svelte';
	import { getTabspotAttributes, tabspotVirtual } from 'tabspot';
	import { getTag, setTableContext, TABSPOT_ITEMS, TABSPOT_SKIP } from './table.svelte.ts';
	import type { TableContext, TableDOM, TableProps } from './types.ts';

	let {
		as,
		ref = $bindable(),
		size = 'medium',
		noNativeElements = false,
		sortable = false,
		noRowBorders = false,
		enableTabspot = false,
		virtualizer,
		resizableColumns = false,
		columnWidths = $bindable([]),
		columnSizing,
		onColumnResize,
		class: classes,
		children,
		...attributes
	}: TableProps<Tag> = $props();

	/** Narrow enough that a column never collapses to nothing, wide enough to stay grabbable. */
	const MIN_COLUMN_WIDTH = 40;

	const context: TableContext = $state({
		config: {
			get size() {
				return size;
			},
			get noNativeElements() {
				return noNativeElements;
			},
			get sortable() {
				return sortable;
			},
			get enableTabspot() {
				return enableTabspot;
			},
			get resizableColumns() {
				return resizableColumns;
			}
		},
		state: {
			get columnWidths() {
				return columnWidths;
			},
			set columnWidths(v) {
				columnWidths = v;
			}
		},
		events: null,
		methods: {
			getColumnWidth: (index: number) => context.state.columnWidths[index] ?? columnSizing?.[index]?.defaultWidth,
			resizeColumn: (e: Event, index: number, width: number) => {
				const { state } = context;
				const min = columnSizing?.[index]?.minWidth ?? MIN_COLUMN_WIDTH;
				const next = Math.round(Math.max(min, width));
				if (state.columnWidths[index] === next) return;

				// A fresh array, so a consumer binding to it sees the change however they store it.
				const widths = [...state.columnWidths];
				widths[index] = next;
				state.columnWidths = widths;
				onColumnResize?.(e, { index, width: next });
			}
		}
	});

	setTableContext(context);

	/**
	 * The tag the invariant rules over. The markup renders it through here, so it is checked during
	 * SSR and on every prop update rather than only once on mount.
	 */
	const _as = $derived(getTag(as, 'table', noNativeElements));

	/**
	 * A grid mover: the arrows walk the cells, rows are read off the DOM parent of each cell, and
	 * the whole table takes a single tab stop. `Escape` is left alone, a grid has nothing to exit to.
	 */
	const tabspotAttributes = $derived(
		enableTabspot &&
			getTabspotAttributes({
				root: { manageSpecialKeys: { Home: true, End: true, PageUp: true, PageDown: true } },
				mover: { layout: 'grid', rows: { by: 'parent' }, items: TABSPOT_ITEMS, skip: TABSPOT_SKIP }
			})
	);

	/**
	 * Tabspot navigates the DOM, and a windowed list only renders a slice of it. The adapter is what
	 * lets a move aim at a row that is not there yet: it scrolls the row in, then waits for Svelte to
	 * flush before looking for it.
	 */
	onMount(() => {
		if (!enableTabspot || !virtualizer || !ref) return;
		return tabspotVirtual(ref as HTMLElement, {
			scrollToIndex: (index) => virtualizer.scrollToIndex?.(index),
			count: () => virtualizer.size,
			tick
		});
	});
</script>

<!--
	@component
	A table displays sets of two dimensional data. Every part is a primitive, so sorting and
	selection stay the responsibility of the consumer.

	- Usage:
	```tsx
	<script>
		import { Table, TableHeader, TableHeaderCell, TableBody, TableRow, TableCell } from 'fluentui-svelte';
	</script>

	<Table aria-label="Files">
		<TableHeader>
			<TableRow>
				<TableHeaderCell>File</TableHeaderCell>
			</TableRow>
		</TableHeader>
		<TableBody>
			<TableRow>
				<TableCell>Meeting notes</TableCell>
			</TableRow>
		</TableBody>
	</Table>
	```
-->
<svelte:element
	this={_as}
	bind:this={ref as TableDOM[Tag]}
	role={enableTabspot ? 'grid' : _as === 'div' ? 'table' : undefined}
	class={[
		'fs-table',
		size,
		{ flex: _as === 'div', 'no-row-borders': noRowBorders, resizable: resizableColumns },
		classes
	]}
	{...tabspotAttributes}
	{...attributes}
>
	{@render children?.()}
</svelte:element>

<style>
	.fs-table {
		width: 100%;
		border-collapse: collapse;
		text-align: left;
		color: var(--fs-text-primary);
		font-family: var(--fs-font-family-base);
		font-size: var(--fs-body2-font-size);
		line-height: var(--fs-body2-line-height);
		/* Every part reads these, so a size change ripples out of the root alone. */
		--fs-table-row-height: 2.75rem;
		--fs-table-cell-padding: 0.5rem;
		--fs-table-row-border: 1px solid var(--fs-divider-stroke-default);
		&.no-row-borders {
			--fs-table-row-border: none;
		}
		/*
		 * The auto algorithm re-measures every column from its content, which undoes a drag. A fixed
		 * table also has to size to the sum of its columns: a percentage width inside a shrink-to-fit
		 * container is circular, and the browser resolves that circle into a runaway width.
		 */
		&.resizable {
			table-layout: fixed;
			width: max-content;
			max-width: 100%;
		}
		&.small {
			--fs-table-row-height: 2.125rem;
		}
		&.extra-small {
			--fs-table-row-height: 1.5rem;
			--fs-table-cell-padding: 0.375rem;
			font-size: var(--fs-caption-font-size);
			line-height: var(--fs-caption-line-height);
		}
		/* A `div` table has no table layout to lean on, so the rows stack and the cells flex. */
		&.flex {
			display: flex;
			flex-direction: column;
		}
	}
</style>
