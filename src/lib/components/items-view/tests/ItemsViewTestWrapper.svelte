<script lang="ts">
	import FluentUISvelte from '#lib/providers/fluentui-svelte/fluentui-svelte.svelte';
	import ItemsView from '../items-view.svelte';
	import ItemsViewItem from '../items-view-item.svelte';
	import type { ItemsViewProps } from '../types.ts';

	let {
		viewProps = {},
		items = [{ value: 'one' }, { value: 'two' }, { value: 'three' }],
		selectedItems = $bindable([])
	}: {
		viewProps?: Partial<ItemsViewProps>;
		items?: { value: string; disabled?: boolean; tabindex?: number }[];
		selectedItems?: string[];
	} = $props();
</script>

<FluentUISvelte>
	<form data-testid="form">
		<ItemsView aria-label="Items" {...viewProps} bind:selectedItems>
			{#each items as item (item.value)}
				<ItemsViewItem value={item.value} disabled={item.disabled} tabindex={item.tabindex}>{item.value}</ItemsViewItem>
			{/each}
		</ItemsView>
	</form>
	<p data-testid="selected">{selectedItems.join(',')}</p>
</FluentUISvelte>
