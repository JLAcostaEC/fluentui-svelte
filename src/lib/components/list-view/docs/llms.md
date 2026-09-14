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
		<Button
			onclick={(e) => {
				e.stopPropagation();
				alert('Installing');
			}}>Install</Button
		>
	</div>
</ListViewItem>
```

## ListView Props

<!-- DO NOT EDIT THIS SECTION (propsmith generated) -->
<!-- props:ListViewProps -->

| Name                       | Type                                                                  | Default     | Description                                                                   |
| -------------------------- | --------------------------------------------------------------------- | ----------- | ----------------------------------------------------------------------------- |
| `selectionMode`            | `'none'` &#124; `'single'` &#124; `'multiselect'` &#124; `'extended'` | `'none'`    | How many items can be selected, and how the selection is made.                |
| `navigationMode`           | `'items'` &#124; `'composite'`                                        | `'items'`   | Whether the list itself takes a single tab stop, or every item takes its own. |
| `selectedItems` _bindable_ | `string[]`                                                            |             | The values of the selected items.                                             |
| `shape`                    | `'circular'` &#124; `'rounded'` &#124; `'square'`                     | `'rounded'` | The items can have a circular, rounded or square shape.                       |
| `onSelectionChange`        | `(e: Event, selectedItems: string[]` &#124; `[]) => void`             |             | Called whenever the selection changes.                                        |
| `as`                       | `'ul'` &#124; `'ol'` &#124; `'div'`                                   | `'ul'`      | The HTML element to render the list as.                                       |
| `ref` _bindable_           | `HTMLUListElement` &#124; `HTMLOListElement` &#124; `HTMLDivElement`  |             | The DOM reference of the list element.                                        |
| `disableTabspot`           | `boolean`                                                             | `false`     | Opts the list out of the tabspot focus management, to wire your own.          |
| HTML Attributes            |                                                                       |             |                                                                               |

<!-- /props:ListViewProps -->

## ListViewItem Props

<!-- DO NOT EDIT THIS SECTION (propsmith generated) -->
<!-- props:ListViewItemProps -->

| Name             | Type                                                               | Default | Description                                                                                |
| ---------------- | ------------------------------------------------------------------ | ------- | ------------------------------------------------------------------------------------------ |
| `as`             | `'li'` &#124; `'a'` &#124; `'div'`                                 | `'li'`  | The HTML element to render the item as.                                                    |
| `shape`          | `'circular'` &#124; `'rounded'` &#124; `'square'`                  |         | The item can have a circular, rounded or square shape. Inherited from the list by default. |
| `value`          | `string`                                                           |         | The value reported to the list when the item is selected. Falls back to a generated id.    |
| `active`         | `boolean`                                                          |         | Renders the item in its pressed state.                                                     |
| `role`           | `'treeitem'` &#124; `'menuitem'` &#124; `'option'` &#124; `'row'`  |         | The ARIA role of the item. Derived from the list by default.                               |
| `disabled`       | `boolean`                                                          |         | Disables the user interaction.                                                             |
| `checkmark`      | `CheckboxProps`                                                    |         | The props to spread on the checkbox rendered when the list is multiselect.                 |
| `onAction`       | `(e: MouseEvent, value: string) => void`                           |         | Called when the item is clicked or activated with the keyboard.                            |
| `onfocus`        | `(e: Event, value: string) => void`                                |         | Called when the item receives the focus.                                                   |
| `ref` _bindable_ | `HTMLLIElement` &#124; `HTMLAnchorElement` &#124; `HTMLDivElement` |         | The DOM reference of the item element.                                                     |
| HTML Attributes  |                                                                    |         |                                                                                            |

<!-- /props:ListViewItemProps -->
