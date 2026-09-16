<script lang="ts">
	import SvelteVirtualList from '@humanspeak/svelte-virtual-list';
	import { SvelteSet } from 'svelte/reactivity';
	import {
		FluentUISvelte,
		Table,
		TableHeader,
		TableHeaderCell,
		TableBody,
		TableRow,
		TableCell,
		TableSelectionCell
	} from '$lib/index.js';

	let {
		count = 500,
		enableTabspot = false,
		selected = new SvelteSet<number>()
	}: { count?: number; enableTabspot?: boolean; selected?: SvelteSet<number> } = $props();

	const rows = $derived(Array.from({ length: count }, (_, i) => ({ id: i, file: `Document ${i + 1}` })));

	let listRef = $state<ReturnType<typeof SvelteVirtualList> | null>(null);

	const toggleRow = (id: number) => (selected.has(id) ? selected.delete(id) : selected.add(id));
</script>

<FluentUISvelte>
	<Table
		noNativeElements
		{enableTabspot}
		style="min-width: 520px;"
		aria-label="Virtualized table"
		aria-rowcount={count + 1}
		virtualizer={{
			size: count,
			scrollToIndex: (index: number) => listRef?.scroll({ index, align: 'auto', smoothScroll: false })
		}}
	>
		<TableHeader>
			<TableRow aria-rowindex={1}>
				<TableSelectionCell invisible />
				<TableHeaderCell>File</TableHeaderCell>
			</TableRow>
		</TableHeader>
		<TableBody style="height: 320px;">
			<SvelteVirtualList items={rows} bind:this={listRef as never} defaultEstimatedItemHeight={44}>
				{#snippet renderItem(row: { id: number; file: string }, index: number)}
					{@const isSelected = selected.has(row.id)}
					<TableRow
						aria-rowindex={index + 2}
						aria-selected={isSelected}
						appearance={isSelected ? 'brand' : 'none'}
						onclick={() => toggleRow(row.id)}
					>
						<TableSelectionCell checked={isSelected} checkboxIndicator={{ 'aria-label': `Select ${row.file}` }} />
						<TableCell>{row.file}</TableCell>
					</TableRow>
				{/snippet}
			</SvelteVirtualList>
		</TableBody>
	</Table>
</FluentUISvelte>
