<script lang="ts">
	import { TreeView, TreeViewItem, TreeViewItemContent } from '$lib/index.js';
</script>

{#snippet icon()}
	<svg width="16" height="16" aria-hidden="true"></svg>
{/snippet}
{#snippet aside()}
	<span>2 KB</span>
{/snippet}
{#snippet actions()}
	<button type="button">More</button>
{/snippet}

<TreeView selectionMode="multiple" style="width: 500px;">
	<TreeViewItem id="fruits" type="branch" open>
		<TreeViewItemContent iconBefore={icon} {aside} {actions}>Fruits</TreeViewItemContent>
		<TreeView>
			<TreeViewItem id="apple">
				<TreeViewItemContent iconBefore={icon} {aside} {actions}>Apple</TreeViewItemContent>
			</TreeViewItem>
			<TreeViewItem id="citrus" type="branch">
				<TreeViewItemContent iconBefore={icon} {aside} {actions}>Citrus</TreeViewItemContent>
				<TreeView>
					<TreeViewItem id="lemon">
						<TreeViewItemContent iconBefore={icon} {aside} {actions}>Lemon</TreeViewItemContent>
					</TreeViewItem>
				</TreeView>
			</TreeViewItem>
		</TreeView>
	</TreeViewItem>
	<TreeViewItem id="vegetables">
		<TreeViewItemContent iconBefore={icon} {aside} {actions}>Vegetables and a longer label</TreeViewItemContent>
	</TreeViewItem>
</TreeView>
