<script lang="ts" generics="Tag extends 'td' | 'div' = 'td'">
	import Checkbox from '../checkbox/checkbox.svelte';
	import RadioButton from '../radio-button/radio-button.svelte';
	import { colIndex, getTag, requireTableContext, selectOnSpace } from './table.svelte.ts';
	import type { TableDOM, TableSelectionCellProps } from './types.ts';

	let {
		as,
		ref = $bindable(),
		type = 'checkbox',
		checked = false,
		subtle = false,
		invisible = false,
		checkboxIndicator,
		radioIndicator,
		class: classes,
		onclick,
		...attributes
	}: TableSelectionCellProps<Tag> = $props();

	const context = requireTableContext();

	const noNativeElements = $derived(context.config.noNativeElements);

	const _as = $derived(getTag(as, 'td', noNativeElements));

	/** A `grid` has no `cell`, only `gridcell`, so arrow navigation renames what the cell reports. */
	const enableTabspot = $derived(context.config.enableTabspot);
</script>

<svelte:element
	this={_as}
	bind:this={ref as TableDOM[Tag]}
	role={enableTabspot ? 'gridcell' : _as === 'div' ? 'cell' : undefined}
	class={['fs-table-selection-cell', { flex: _as === 'div', subtle, invisible, checked: !!checked }, classes]}
	{@attach enableTabspot ? colIndex() : undefined}
	{@attach onclick ? selectOnSpace : undefined}
	{onclick}
	{...attributes}
>
	<!--
		The indicator answers the pointer itself, and the click still reaches the row underneath, so
		hitting it selects the row rather than only ticking a box the consumer never hears about.
	-->
	{#if type === 'radio'}
		<RadioButton checked={checked === true} {...radioIndicator} />
	{:else}
		<Checkbox wrapperAs="div" checked={checked === true} indeterminate={checked === 'mixed'} {...checkboxIndicator} />
	{/if}
</svelte:element>

<style>
	.fs-table-selection-cell {
		height: var(--fs-table-row-height);
		padding: 0 var(--fs-table-cell-padding);
		vertical-align: middle;
		/* Shrink to the indicator: a native table hands the leftover width to the data columns. */
		width: 1%;
		white-space: nowrap;
		& :global(.fs-checkbox),
		& :global(.fs-radio-button) {
			display: flex;
			align-items: center;
		}
		&.subtle :global(.fs-checkbox),
		&.subtle :global(.fs-radio-button) {
			/* Set by the row, so the indicator surfaces on hover and while the focus is inside. */
			opacity: var(--fs-table-row-active, 0);
			transition: opacity var(--fs-fast-duration) var(--fs-point-to-point);
			@media (prefers-reduced-motion: reduce) {
				transition: none;
			}
		}
		&.subtle.checked :global(.fs-checkbox),
		&.subtle.checked :global(.fs-radio-button) {
			opacity: 1;
		}
		&.invisible :global(.fs-checkbox),
		&.invisible :global(.fs-radio-button) {
			visibility: hidden;
		}
		&.flex {
			display: flex;
			align-items: center;
			flex: 0 0 auto;
			width: auto;
		}
	}
</style>
