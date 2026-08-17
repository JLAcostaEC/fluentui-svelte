<script lang="ts">
	import { ListView, ListViewItem } from '$lib/index.js';
	import type { ListViewProps } from '$lib/components/list-view/types.js';
	import type { ListViewItemProps } from '$lib/components/list-view/types.js';
	import type { Snippet } from 'svelte';

	let {
		listProps = {},
		itemProps = {},
		items = [{ value: 'item-1' }],
		children
	}: {
		listProps?: Partial<ListViewProps<'ul'>>;
		itemProps?: Partial<ListViewItemProps>;
		items?: { value: string; disabled?: boolean }[];
		children?: Snippet;
	} = $props();
</script>

<ListView {...listProps}>
	{#each items as item (item.value)}
		<ListViewItem value={item.value} disabled={item.disabled} {...itemProps}>
			{#if children}
				{@render children()}
			{:else}
				<span>{item.value}</span>
			{/if}
		</ListViewItem>
	{/each}
</ListView>
