<script lang="ts" generics="Tag extends 'thead' | 'div' = 'thead'">
	import { getTag, requireTableContext } from './table.svelte.ts';
	import type { TableDOM, TableHeaderProps } from './types.ts';

	let { as, ref = $bindable(), class: classes, children, ...attributes }: TableHeaderProps<Tag> = $props();

	const context = requireTableContext();

	const noNativeElements = $derived(context.config.noNativeElements);

	const _as = $derived(getTag(as, 'thead', noNativeElements));
</script>

<svelte:element
	this={_as}
	bind:this={ref as TableDOM[Tag]}
	role={_as === 'div' ? 'rowgroup' : undefined}
	class={['fs-table-header', classes]}
	{...attributes}
>
	{@render children?.()}
</svelte:element>

<style>
	.fs-table-header {
		color: var(--fs-text-primary);
	}
</style>
