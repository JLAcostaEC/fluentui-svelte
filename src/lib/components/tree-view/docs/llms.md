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

Set `selectionMode` to `"multiple" | "single"` to render checkboxes on selectable items.

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

### Single selection

Set `selectionMode` to `single` so checking an item unchecks the previous one, and branches no longer cascade to their children.

```svelte
<script>
	let checked = $state([]);
</script>

<TreeView selectionMode="single" bind:checkedItems={checked}>
	<TreeViewItem id="fruits" type="branch" open>
		<TreeViewItemContent>Fruits</TreeViewItemContent>
		<TreeView>
			<TreeViewItem id="apple">
				<TreeViewItemContent>Apple</TreeViewItemContent>
			</TreeViewItem>
			<TreeViewItem id="banana">
				<TreeViewItemContent>Banana</TreeViewItemContent>
			</TreeViewItem>
		</TreeView>
	</TreeViewItem>
	<TreeViewItem id="vegetables">
		<TreeViewItemContent>Vegetables</TreeViewItemContent>
	</TreeViewItem>
</TreeView>

<p>Checked: {checked.join(', ')}</p>
```

### Icons

Use `iconBefore` and `iconAfter` to render icons around the label. Every item reserves the space of the expand chevron, so checkboxes and icons stay aligned between branches and leaves.

```svelte
<script>
	import { TreeView, TreeViewItem, TreeViewItemContent } from 'fluentui-svelte';
	import FolderRegular from 'fluentui-icons-svelte/FolderRegular.svelte';
	import DocumentRegular from 'fluentui-icons-svelte/DocumentRegular.svelte';
	import ImageRegular from 'fluentui-icons-svelte/ImageRegular.svelte';
	import StarRegular from 'fluentui-icons-svelte/StarRegular.svelte';
	import LockClosedRegular from 'fluentui-icons-svelte/LockClosedRegular.svelte';
</script>

{#snippet folder()}<FolderRegular width="1.25rem" />{/snippet}
{#snippet document()}<DocumentRegular width="1.25rem" />{/snippet}
{#snippet image()}<ImageRegular width="1.25rem" />{/snippet}
{#snippet star()}<StarRegular width="1rem" />{/snippet}
{#snippet lock()}<LockClosedRegular width="1rem" />{/snippet}

<TreeView selectionMode="multiple">
	<TreeViewItem id="documents" type="branch" open>
		<TreeViewItemContent iconBefore={folder}>Documents</TreeViewItemContent>
		<TreeView>
			<TreeViewItem id="report">
				<TreeViewItemContent iconBefore={document} iconAfter={star}>Report</TreeViewItemContent>
			</TreeViewItem>
			<TreeViewItem id="photo">
				<TreeViewItemContent iconBefore={image}>Photo</TreeViewItemContent>
			</TreeViewItem>
		</TreeView>
	</TreeViewItem>
	<TreeViewItem id="notes">
		<TreeViewItemContent iconBefore={document} iconAfter={lock}>Notes</TreeViewItemContent>
	</TreeViewItem>
</TreeView>
```

### Aside and actions

`aside` is pinned to the end of the row. `actions` comes after it and is revealed when the row is hovered or focused.

```svelte
<script>
	import { TreeView, TreeViewItem, TreeViewItemContent, Button } from 'fluentui-svelte';
	import DocumentRegular from 'fluentui-icons-svelte/DocumentRegular.svelte';
	import MoreHorizontalRegular from 'fluentui-icons-svelte/MoreHorizontalRegular.svelte';
</script>

{#snippet document()}<DocumentRegular width="1.25rem" />{/snippet}
{#snippet fileSize()}<span>2 KB</span>{/snippet}
{#snippet more()}
	<Button appearance="subtle" onclick={(e) => e.stopPropagation()} aria-label="More actions"><MoreHorizontalRegular width="1rem" /></Button>
{/snippet}

<TreeView>
	<TreeViewItem id="report">
		<TreeViewItemContent iconBefore={document} aside={fileSize} actions={more}>Report</TreeViewItemContent>
	</TreeViewItem>
	<TreeViewItem id="annual-summary">
		<TreeViewItemContent iconBefore={document} aside={fileSize} actions={more}>Annual summary</TreeViewItemContent>
	</TreeViewItem>
</TreeView>
```

### Sizes

Set `size` to `small`, `medium` or `large` on the root `TreeView`.

```svelte
<TreeView size="small">...</TreeView>
<TreeView size="medium">...</TreeView>
<TreeView size="large">...</TreeView>
```

### Disabled items

A disabled item can't be opened or checked, and it is skipped when its parent checks its children, which leaves the parent in its mixed state.

```svelte
<TreeView selectionMode="multiple">
	<TreeViewItem id="fruits" type="branch" open>
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

<p>Open: {openItems.join(', ')}</p>
<p>Checked: {checkedItems.join(', ')}</p>
```

### Events

`onCheckedChange` and `onOpenChange` on the TreeView receive the resulting ids. The same props on a TreeViewItem receive the item and its new state, including the children a branch cascades to.

```svelte
<script>
	let treeEvent = $state('');
	let itemEvent = $state('');
</script>

<TreeView
	selectionMode="multiple"
	onCheckedChange={(e, checkedItems) => (treeEvent = 'Checked: ' + checkedItems.join(', '))}
	onOpenChange={(e, openItems) => (treeEvent = 'Open: ' + openItems.join(', '))}
>
	<TreeViewItem
		id="fruits"
		type="branch"
		onOpenChange={(e, { id, open }) => (itemEvent = id + (open ? ' opened' : ' closed'))}
	>
		<TreeViewItemContent>Fruits</TreeViewItemContent>
		<TreeView>
			<TreeViewItem
				id="apple"
				onCheckedChange={(e, { id, checked }) => (itemEvent = id + (checked ? ' checked' : ' unchecked'))}
			>
				<TreeViewItemContent>Apple</TreeViewItemContent>
			</TreeViewItem>
		</TreeView>
	</TreeViewItem>
</TreeView>

<p>Tree: {treeEvent}</p>
<p>Item: {itemEvent}</p>
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
