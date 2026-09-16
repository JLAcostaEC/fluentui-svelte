<script lang="ts" generics="Tag extends 'tr' | 'div' = 'tr'">
	import { getTag, requireTableContext, selectOnSpace } from './table.svelte.ts';
	import type { TableDOM, TableRowProps } from './types.ts';

	let {
		as,
		ref = $bindable(),
		appearance = 'none',
		class: classes,
		onclick,
		children,
		...attributes
	}: TableRowProps<Tag> = $props();

	const context = requireTableContext();

	const noNativeElements = $derived(context.config.noNativeElements);

	const _as = $derived(getTag(as, 'tr', noNativeElements));
</script>

<svelte:element
	this={_as}
	bind:this={ref as TableDOM[Tag]}
	role={_as === 'div' ? 'row' : undefined}
	class={['fs-table-row', appearance, { flex: _as === 'div' }, classes]}
	{@attach onclick ? selectOnSpace : undefined}
	{onclick}
	{...attributes}
>
	{@render children?.()}
</svelte:element>

<style>
	.fs-table-row {
		/* Set by the root, so `noRowBorders` reaches every row without a global selector. */
		border-bottom: var(--fs-table-row-border);
		/* Read by the selection cell: a subtle indicator only surfaces while the row is engaged. */
		--fs-table-row-active: 0;
		&:hover,
		&:focus-within {
			background: var(--fs-subtle-fill-secondary);
			--fs-table-row-active: 1;
		}
		&.brand {
			background: color-mix(in srgb, var(--fs-accent-fill-default), transparent 88%);
		}
		&.neutral {
			background: var(--fs-subtle-fill-tertiary);
		}
		&.flex {
			display: flex;
			align-items: center;
			width: 100%;
		}
	}
</style>
