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

<!-- DO NOT EDIT THIS SECTION (propsmith generated) -->
<!-- props:TreeViewProps -->

| Name                                                | Type                                         | Default      | Description                                                                          |
| --------------------------------------------------- | -------------------------------------------- | ------------ | ------------------------------------------------------------------------------------ |
| `ref` _bindable_                                    | `HTMLUListElement`                           |              | The DOM reference of the tree element.                                               |
| `size`                                              | `'small'` &#124; `'medium'` &#124; `'large'` | `'medium'`   | The size of every item in the tree.                                                  |
| `navigationMode`                                    | `'tree'` &#124; `'treegrid'`                 | `'tree'`     | Whether the tree takes a single tab stop, or every row is reachable on its own.      |
| `onOpenChange`                                      | `(e: Event, openItems: string[]) => void`    |              | Called whenever a branch opens or closes.                                            |
| `selectionMode`                                     | `'single'` &#124; `'multiple'`               | `'multiple'` | How many items can be checked at a time.                                             |
| `onCheckedChange`                                   | `(e: Event, checkedItems: string[]) => void` |              | Called whenever an item is checked or unchecked.                                     |
| `virtualizer`                                       | `TreeViewVirtualizer`                        |              | Bridge to a windowing library. Only the rendered slice of items lives in the DOM.    |
| `openItems` _bindable_                              | `string[]` &#124; `SvelteSet<string>`        |              | The ids of the open branches. A `SvelteSet` is required when a `virtualizer` is set. |
| `checkedItems` _bindable_                           | `string[]` &#124; `SvelteSet<string>`        |              | The ids of the checked items. A `SvelteSet` is required when a `virtualizer` is set. |
| `children`                                          | `Snippet`                                    |              | The items of the tree.                                                               |
| `TreeViewVirtualProps` &#124; `TreeViewStaticProps` |                                              |              |                                                                                      |
| Element Attributes (`ul`)                           |                                              |              |                                                                                      |

<!-- /props:TreeViewProps -->

## Component Props (TreeViewItem)

<!-- DO NOT EDIT THIS SECTION (propsmith generated) -->
<!-- props:TreeViewItemProps -->

| Name                      | Type                                                         | Default  | Description                                                                            |
| ------------------------- | ------------------------------------------------------------ | -------- | -------------------------------------------------------------------------------------- |
| `id`                      | `string`                                                     |          | The id of the item, used by the tree to track its state. Falls back to a generated id. |
| `type`                    | `'item'` &#124; `'branch'`                                   | `'item'` | Whether the item holds children, and can therefore be opened.                          |
| `ref`                     | `HTMLLIElement`                                              |          | The DOM reference of the item element.                                                 |
| `value`                   | `string` &#124; `number`                                     | `id`     | The value reported by the tree events. Falls back to the id of the item.               |
| `text`                    | `string`                                                     |          | The label of the item, used by the type-ahead navigation.                              |
| `open`                    | `boolean`                                                    |          | Whether the branch is open.                                                            |
| `checked`                 | `boolean`                                                    |          | Whether the item is checked.                                                           |
| `indeterminate`           | `boolean`                                                    |          | Renders the checkbox in its mixed state, when only some children are checked.          |
| `disabled`                | `boolean`                                                    |          | Disables the user interaction.                                                         |
| `index`                   | `number`                                                     |          | The real index of the item in the data set. Required when the tree is virtualized.     |
| `onOpenChange`            | `(e: Event, data: { id: string; open: boolean }) => void`    |          | Called when this branch opens or closes.                                               |
| `onCheckedChange`         | `(e: Event, data: { id: string; checked: boolean }) => void` |          | Called when this item is checked or unchecked.                                         |
| Element Attributes (`li`) |                                                              |          |                                                                                        |

<!-- /props:TreeViewItemProps -->

## Component Props (TreeViewItemContent)

<!-- DO NOT EDIT THIS SECTION (propsmith generated) -->
<!-- props:TreeViewItemLayoutProps -->

| Name                       | Type                         | Default | Description                                                           |
| -------------------------- | ---------------------------- | ------- | --------------------------------------------------------------------- |
| `ref`                      | `HTMLDivElement`             |         | The DOM reference of the layout element.                              |
| `expandIcon`               | `Snippet` &#124; `Component` |         | Custom icon for the control that opens a branch.                      |
| `iconBefore`               | `Snippet` &#124; `Component` |         | Content rendered before the label.                                    |
| `iconAfter`                | `Snippet` &#124; `Component` |         | Content rendered after the label.                                     |
| `aside`                    | `Snippet` &#124; `Component` |         | Content pinned to the end of the row.                                 |
| `actions`                  | `Snippet` &#124; `Component` |         | Content pinned to the end of the row, revealed on hover and on focus. |
| Element Attributes (`div`) |                              |         |                                                                       |

<!-- /props:TreeViewItemLayoutProps -->
