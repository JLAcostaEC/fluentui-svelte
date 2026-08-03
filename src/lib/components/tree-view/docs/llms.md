# Tree View

The Tree View displays hierarchical data in a nested list where each item can be expanded, checked or selected. Items are composed with the TreeViewItem and TreeViewItemContent components — the tree does not accept a data prop.

> **Early access:** The API, features, and behavior of the component are subject to significant changes. We strongly advise against using this component in production environments at this time.

## Usage

```svelte
<script>
	import { TreeView, TreeViewItem, TreeViewItemContent } from 'fluentui-svelte';
</script>

<TreeView selectionMode="multiple">
	<TreeViewItem id="fruits" type="branch">
		<TreeViewItemContent>Fruits</TreeViewItemContent>
		<TreeView>
			<TreeViewItem id="apple">
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
```

Nesting a TreeView inside a TreeViewItem of type='branch' creates a subtree. Use openItems / checkedItems on the root TreeView (bindable) to control open and checked state programmatically.

## Examples

### Checkable Items

Set `selectionMode="multiple"` to render checkboxes on selectable items.

```svelte
<TreeView selectionMode="multiple">
	<TreeViewItem id="fruits" type="branch">
		<TreeViewItemContent>Fruits</TreeViewItemContent>
		<TreeView>
			<TreeViewItem id="apple">
				<TreeViewItemContent>Apple</TreeViewItemContent>
			</TreeViewItem>
		</TreeView>
	</TreeViewItem>
</TreeView>
```

### Controlling Open and Checked State

Use the bindable `openItems` and `checkedItems` props on the root `TreeView` to control state programmatically.

```svelte
<script>
	let openItems = $state(['fruits']);
	let checkedItems = $state([]);
</script>

<TreeView bind:openItems bind:checkedItems selectionMode="multiple">
	<TreeViewItem id="fruits" type="branch">
		<TreeViewItemContent>Fruits</TreeViewItemContent>
		<TreeView>
			<TreeViewItem id="apple">
				<TreeViewItemContent>Apple</TreeViewItemContent>
			</TreeViewItem>
		</TreeView>
	</TreeViewItem>
</TreeView>
```

## Component Props (TreeView)

| Name | Type | Description |
| --- | --- | --- |
| `ref` | `HTMLUListElement` | Bindable DOM reference of the root ul element. |
| `size` | `'small' \| 'medium' \| 'large'` | Visual size of the tree. Default is 'medium'. |
| `navigationMode` | `'tree' \| 'treegrid'` | Keyboard navigation mode. Default is 'tree'. |
| `selectionMode` | `'single' \| 'multiple'` | Selection mode for checkable items. Default is 'multiple'. |
| `openItems` | `string[] \| SvelteSet<string>` | Bindable list or set of open item ids. Uses SvelteSet when a virtualizer is provided. |
| `checkedItems` | `string[] \| SvelteSet<string>` | Bindable list or set of checked item ids. Uses SvelteSet when a virtualizer is provided. |
| `onOpenChange` | `(e: Event, openItems: string[]) => void` | Callback fired when an item is expanded or collapsed. |
| `onCheckedChange` | `(e: Event, checkedItems: string[]) => void` | Callback fired when an item is checked or unchecked. |
| `virtualizer` | `TreeViewVirtualizer` | Optional adapter for windowing or virtual list libraries. When provided, only the rendered slice is in the DOM. |
| `children` | `Snippet` | The TreeViewItem children of the tree. |

## Component Props (TreeViewItem)

| Name | Type | Description |
| --- | --- | --- |
| `id` | `string` | Unique identifier of the item. Required for open and checked state tracking. |
| `type` | `'item' \| 'branch'` | Whether the item is a leaf ('item') or a branch that can contain a nested TreeView. |
| `ref` | `HTMLLIElement` | Bindable DOM reference of the li element. |
| `value` | `string \| number` | Optional value associated with the item. |
| `text` | `string` | Optional accessible text label used by the tree. |
| `open` | `boolean` | Bindable open state for type='branch' items. |
| `checked` | `boolean` | Bindable checked state for selectable items. |
| `indeterminate` | `boolean` | Whether the item is in an indeterminate check state. |
| `disabled` | `boolean` | Disables the item. |
| `index` | `number` | Explicit index — used with a virtualizer to keep keyboard navigation in sync. |
| `onOpenChange` | `(e: Event, data: { id: string; open: boolean }) => void` | Callback fired when this item is expanded or collapsed. |
| `onCheckedChange` | `(e: Event, data: { id: string; checked: boolean }) => void` | Callback fired when this item is checked or unchecked. |

## Component Props (TreeViewItemContent)

| Name | Type | Description |
| --- | --- | --- |
| `ref` | `HTMLDivElement` | Bindable DOM reference of the layout element. |
| `expandIcon` | `Snippet \| Component` | Custom icon rendered for the expand or collapse affordance. |
| `iconBefore` | `Snippet \| Component` | Icon rendered before the item text. |
| `iconAfter` | `Snippet \| Component` | Icon rendered after the item text. |
| `aside` | `Snippet \| Component` | Content rendered on the trailing side of the row. |
| `actions` | `Snippet \| Component` | Interactive actions rendered on hover or focus. |
| `children` | `Snippet` | The item label content. |
