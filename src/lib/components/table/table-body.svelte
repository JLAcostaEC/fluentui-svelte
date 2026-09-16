<script lang="ts" generics="Tag extends 'tbody' | 'div' = 'tbody'">
	import { getTag, requireTableContext } from './table.svelte.ts';
	import type { TableBodyProps, TableDOM } from './types.ts';

	let { as, ref = $bindable(), class: classes, children, ...attributes }: TableBodyProps<Tag> = $props();

	const context = requireTableContext();

	const noNativeElements = $derived(context.config.noNativeElements);

	const _as = $derived(getTag(as, 'tbody', noNativeElements));
</script>

<svelte:element
	this={_as}
	bind:this={ref as TableDOM[Tag]}
	role={_as === 'div' ? 'rowgroup' : undefined}
	class={['fs-table-body', { flex: _as === 'div' }, classes]}
	{...attributes}
>
	{@render children?.()}
</svelte:element>

<style>
	.fs-table-body {
		&.flex {
			display: flex;
			flex-direction: column;
		}
	}
</style>
