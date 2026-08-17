<script lang="ts">
	import { TreeView, TreeViewItem, TreeViewItemContent } from '$lib/index.js';
	import type { TreeViewSelectionMode } from '$lib/components/tree-view/types.js';
	import type { Sizes } from '$types';

	let {
		selectionMode,
		size,
		onCheckedChange,
		onOpenChange,
		branchOpen,
		appleChecked,
		appleIndeterminate
	}: {
		selectionMode?: TreeViewSelectionMode;
		size?: Sizes;
		onCheckedChange?: (e: Event, data: string[]) => void;
		onOpenChange?: (e: Event, data: string[]) => void;
		branchOpen?: boolean;
		appleChecked?: boolean;
		appleIndeterminate?: boolean;
	} = $props();
</script>

<TreeView {selectionMode} {size} {onCheckedChange} {onOpenChange}>
	<TreeViewItem id="fruits" type="branch" open={branchOpen}>
		<TreeViewItemContent>Fruits</TreeViewItemContent>
		<TreeView>
			<TreeViewItem id="apple" checked={appleChecked} indeterminate={appleIndeterminate}>
				<TreeViewItemContent>Apple</TreeViewItemContent>
			</TreeViewItem>
			<TreeViewItem id="banana" disabled>
				<TreeViewItemContent>Banana</TreeViewItemContent>
			</TreeViewItem>
		</TreeView>
	</TreeViewItem>
	<TreeViewItem id="vegetables">
		<TreeViewItemContent>Vegetables</TreeViewItemContent>
	</TreeViewItem>
</TreeView>
