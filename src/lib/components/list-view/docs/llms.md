# ListView

The ListView is a component for rendering a set of vertically stacked items. These items can be focusable, selectable, have one primary action and one or more secondary actions, and support keyboard navigation and accessibility features.

## Usage

```svelte
<script>
	import { ListView, ListViewItem } from 'fluentui-svelte';
	let list = ['A', 'B', 'C'];
	let selected = ['A'];
</script>

<ListView selectedItems={selected}>
	{#each list as item (item)}
		<ListViewItem value={item}>{item}</ListViewItem>
	{/each}
</ListView>
```

## ListView API

> **Best practices:** Please check the Fluent UI React List best practices for guidance.

### As

You can control which tag the ListView component should use: ul, ol, or div. Default: ul.

### Shape

Instead of setting this on every ListViewItem, you can set it here and every item will inherit it. Possible values are rounded, circular, or square. Default: rounded.

### Navigation Mode

This option allows you to set keyboard navigation based on your needs. For view-only data, you do not need to set this unless the items perform some action. If your items have multiple actionable elements within the ListViewItem, like buttons or menus, you can set this to composite.

## Examples

### Value

Sets the value of the current item. You must set this when using the ListView selection system or if items change dynamically.

### On Action

This event is triggered when clicking or tapping the element. It executes the primary action and, if the role is not row, it also executes the selection itself.

### Selection Mode

Use `selectionMode` (`single`, `multiselect`, or `extended`) to control how items are selected.

```svelte
<ListView selectionMode="multiselect" selectedItems={['Apple']}>
	{#each ['Apple', 'Banana', 'Cherry'] as item (item)}
		<ListViewItem value={item}>{item}</ListViewItem>
	{/each}
</ListView>
```

### Checkmark

Add and configure a checkbox for the element. You can use the same props for the Checkbox component. Note: every actionable element inside this ListViewItem must call e.stopPropagation().

```svelte
<ListViewItem
	value="card"
	role="row"
	checkmark={{ style: 'position: absolute; top: 10px; left: 10px; z-index: 10;' }}
	onAction={(e, d) => alert('Triggered Primary Action')}
>
	<div style="...">
		Card Content Inside ListItem
		<Button onclick={(e) => { e.stopPropagation(); alert('Installing'); }}>Install</Button>
	</div>
</ListViewItem>
```

## ListView Props

| Name | Type | Description |
| --- | --- | --- |
| `as` | `string` | The HTML tag to use for the list container. Possible values: ul, ol, div. |
| `selectionMode` | `string` | Selection mode for the list. Possible values: single, multiselect, extended. |
| `navigationMode` | `string` | Navigation mode for keyboard navigation. Possible values: items, composite. |
| `selectedItems` | `string[]` | The currently selected item values. |
| `shape` | `string` | The shape of the list items. Possible values: rounded, circular, square. |
| `onSelectionChange` | `(Event, string[]) => void` | Callback fired when the selection changes. |
| `element` | Dynamic | Reference to the list DOM element. Depends on the selected as value. |
| `children` | Only `ListViewItem` | The ListViewItem children of the list. |
| Element Attributes | Dynamic | Based on the chosen as value, you will have autocomplete for all HTML attributes of that tag. |

## ListViewItem Props

| Name | Type | Description |
| --- | --- | --- |
| `as` | `string` | The HTML tag to use for the item container. Possible values: li, a, div. |
| `active` | `boolean` | Whether the item is currently active or selected. |
| `shape` | `string` | The shape of the item. Possible values: rounded, circular, square. |
| `value` | `string` | The value of the item used for selection. |
| `onAction` | `(MouseEvent, string) => void` | Callback fired when the item is activated. |
| `onFocus` | `(Event, string) => void` | Callback fired when the item receives focus. |
| `role` | `string` | ARIA role for the item. Possible values: treeitem, menuitem, option, row. |
| `disabled` | `boolean` | Whether the item is disabled. |
| `checkmark` | `object` | Props for the checkmark or checkbox. |
| `children` | `Snippet` | The content of the item. |
| Element Attributes | Dynamic | Based on the chosen as value, you will have autocomplete for all HTML attributes of that tag. |
