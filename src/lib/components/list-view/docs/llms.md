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

### Best practices

- Keep lists that only display text out of the Tab sequence. Configure `navigationMode` on the outer ListView: use `items` for native link navigation and `composite` for selectable cards with secondary controls. Let the component manage item and control tabindex unless you opt out with `disableTabspot`.
- With the default grid roles in selectable composite lists, the component wraps each row's content in one `gridcell` and manages navigation to its controls. No manual `gridcell` wrappers are needed.
- Use `onAction` for an item's primary action and native buttons or links with `onclick` for secondary actions. Enter and Space both activate non-native actionable items; links retain native keyboard behavior. In composite selection rows, the checkmark changes selection independently, and secondary buttons and links do not trigger the row's action or selection.
- Keep the default roles for flat selection widgets; they depend on both `selectionMode` and `navigationMode`. Match the HTML tags: `ul`/`ol` with `li` items, or `as="div"` on both a card list and its items.
- Use ListViewItemBranch for expandable sublists. Branches are never selectable and manage their disclosure attributes and focus. Each nested list owns its selection. Set `role="list"` on each selectable list containing branches to preserve native list semantics.
- Give selectable ListView widgets an accessible name with `aria-label` or `aria-labelledby`. Give navigation a named `nav` landmark and mark the current link with `aria-current="page"`. Use meaningful visible text or `aria-label` for controls, a descriptive branch `label`, and stable item `value` strings when using selection.

### As

You can control which tag the ListView component should use: ul, ol, or div. Default: ul.

### Shape

Instead of setting this on every ListViewItem, you can set it here and every item will inherit it. Possible values are rounded, circular, or square. Default: rounded.

### Navigation Mode

`items` keeps each item in the Tab order; `composite` gives the entire list one tab stop and lets Right enter an item's secondary controls. Selection uses listbox/option roles in items mode, or grid/row/gridcell roles in composite mode. Set `role="list"` on each selectable navigation list with sublists to preserve native list semantics; use `aria-current` on links to announce the current page.

### Keyboard navigation

Up/Down move between siblings and Home/End reach the ends of the current level. Right opens a collapsed branch; Right on an expanded branch enters its sublist. Left closes an expanded branch; Left on a collapsed branch or child returns to its parent. Escape closes the nearest branch and restores focus to its button. Right also enters a composite item's controls; Left/Right move between them, and Left from the first control returns to the row. Enter activates links; Enter and Space activate buttons and selectable items. `disableTabspot` opts out of arrow-key focus management. Each nested ListView owns its selection state, so selecting a child does not select its parent.

## Examples

### Simple navigation

Use native anchors inside a named navigation landmark. Under `ul` or `ol`, ListViewItem wraps anchors and buttons in `li` elements.

```svelte
<nav aria-label="Main navigation">
	<ListView>
		<ListViewItem as="a" href="/">Home</ListViewItem>
		<ListViewItem as="a" href="/docs">Documentation</ListViewItem>
		<ListViewItem as="a" href="/docs/components/list-view" aria-current="page">ListView</ListViewItem>
	</ListView>
</nav>
```

### Navigation with sublists

Nest a ListView inside ListViewItemBranch. Branches are focusable disclosure buttons and never participate in selection. The component manages expanded state, aria-expanded, aria-controls, hidden content and focus restoration. Nested lists remain mounted when collapsed, preserving their selection. Hierarchy, indentation and keyboard groups are detected automatically; every nested list owns its selection. Use native list semantics: when selection is enabled, set `role="list"` on lists containing branches. Branches cannot be placed in listbox or grid lists. See the [WAI-ARIA disclosure pattern](https://www.w3.org/WAI/ARIA/apg/patterns/disclosure/).

```svelte
<script lang="ts">
	import { ListView, ListViewItem, ListViewItemBranch } from 'fluentui-svelte';
</script>

<nav aria-label="Component navigation">
	<ListView>
		<ListViewItem as="a" href="/">Home</ListViewItem>
		<ListViewItemBranch label="Components" expanded>
			<ListView>
				<ListViewItem as="a" href="/docs/components/button">Button</ListViewItem>
				<ListViewItem as="a" href="/docs/components/checkbox">Checkbox</ListViewItem>
			</ListView>
		</ListViewItemBranch>
	</ListView>
</nav>
```

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

### Toggle on click

In a multiselect list, a plain click selects only that item and Ctrl/Cmd + click toggles it. Set `toggleOnClick` to make a plain click toggle the item directly.

```svelte
<ListView selectionMode="multiselect" toggleOnClick>
	{#each ['Apple', 'Banana', 'Cherry'] as item (item)}
		<ListViewItem value={item}>{item}</ListViewItem>
	{/each}
</ListView>
```

### Checkmark

Add and configure a checkbox for the element. You can use the same props for the Checkbox component. The checkbox toggles the selection of its item without triggering `onAction`. Bind `selectedItems` to read or control the selection.

```svelte
<script>
	let selected = $state(['Apple']);
</script>

<ListView selectionMode="multiselect" bind:selectedItems={selected}>
	{#each ['Apple', 'Banana', 'Cherry'] as item (item)}
		<ListViewItem value={item} checkmark={{}}>{item}</ListViewItem>
	{/each}
</ListView>

<p>Selected: {selected.join(', ')}</p>
```

### Cards with a primary action

With `navigationMode` set to `composite` and a `selectionMode`, every item is a row. Use `as="div"` for both the list and its card items to keep the HTML structure valid. Clicking a row runs its primary action (`onAction`), the checkbox toggles its selection, and any button inside is a secondary action. Use `checkmark.wrapperAttributes.style` to place the checkbox where you need it, like the top-right corner of the card. Secondary controls run their own actions without selecting the item or triggering its primary action.

```svelte
<script>
	const cards = [
		{ name: 'Fluent', description: 'Design system' },
		{ name: 'Svelte', description: 'UI framework' },
		{ name: 'Vite', description: 'Build tool' }
	];

	let selected = $state([]);
	let lastAction = $state('');
</script>

<ListView as="div" navigationMode="composite" selectionMode="multiselect" bind:selectedItems={selected}>
	{#each cards as card (card.name)}
		{#snippet install()}
			<Button
				onclick={() => {
					lastAction = 'Installed ' + card.name;
				}}>Install</Button
			>
		{/snippet}
		<ListViewItem
			as="div"
			value={card.name}
			checkmark={{ wrapperAttributes: { style: 'position: absolute; top: 0.5rem; right: 0.5rem; z-index: 2;' } }}
			style="padding: 0"
			onAction={() => (lastAction = 'Opened ' + card.name)}
		>
			<Card orientation="vertical" style="width: 100%;">
				<CardHeader title={card.name} description={card.description} />
				<CardFooter action={install} />
			</Card>
		</ListViewItem>
	{/each}
</ListView>

<p>Selected: {selected.join(', ')}</p>
<p>Last action: {lastAction}</p>
```

## ListView Props

<!-- DO NOT EDIT THIS SECTION (propsmith generated) -->
<!-- props:ListViewProps -->

| Name                       | Type                                                                  | Default     | Description                                                                                                                     |
| -------------------------- | --------------------------------------------------------------------- | ----------- | ------------------------------------------------------------------------------------------------------------------------------- |
| `role`                     | `AriaRole`                                                            |             | Overrides the list role and the roles derived for its items. Use `list` for nested navigation with independent selection.       |
| `selectionMode`            | `'none'` &#124; `'single'` &#124; `'multiselect'` &#124; `'extended'` | `'none'`    | How many items can be selected, and how the selection is made.                                                                  |
| `navigationMode`           | `'items'` &#124; `'composite'`                                        | `'items'`   | Whether the list itself takes a single tab stop, or every item takes its own.                                                   |
| `selectedItems` _bindable_ | `string[]`                                                            |             | The values of the selected items.                                                                                               |
| `shape`                    | `'circular'` &#124; `'rounded'` &#124; `'square'`                     | `'rounded'` | The items can have a circular, rounded or square shape.                                                                         |
| `onSelectionChange`        | `(e: Event, selectedItems: string[]` &#124; `[]) => void`             |             | Called whenever the selection changes.                                                                                          |
| `toggleOnClick`            | `boolean`                                                             | `false`     | When `selectionMode` is `'multiselect'`, clicking an item toggles its selection directly instead of requiring Ctrl/Cmd + click. |
| `as`                       | `'ul'` &#124; `'ol'` &#124; `'div'`                                   | `'ul'`      | The HTML element to render the list as.                                                                                         |
| `ref` _bindable_           | `HTMLUListElement` &#124; `HTMLOListElement` &#124; `HTMLDivElement`  |             | The DOM reference of the list element.                                                                                          |
| `disableTabspot`           | `boolean`                                                             | `false`     | Opts the list out of the tabspot focus management, to wire your own.                                                            |
| HTML Attributes            |                                                                       |             |                                                                                                                                 |

<!-- /props:ListViewProps -->

## ListViewItem Props

<!-- DO NOT EDIT THIS SECTION (propsmith generated) -->
<!-- props:ListViewItemProps -->

| Name             | Type                                                                                          | Default | Description                                                                                                                                                                                                                                             |
| ---------------- | --------------------------------------------------------------------------------------------- | ------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `as`             | `'li'` &#124; `'a'` &#124; `'button'` &#124; `'div'`                                          | `'li'`  | The HTML element to render the item as. Links and buttons are wrapped in a list item when the list renders as `ul` or `ol`. Use `li` or `div` for nested lists and content with multiple controls. Buttons cannot contain checkmarks or composite rows. |
| `shape`          | `'circular'` &#124; `'rounded'` &#124; `'square'`                                             |         | The item can have a circular, rounded or square shape. Inherited from the list by default.                                                                                                                                                              |
| `value`          | `string`                                                                                      |         | The value reported to the list when the item is selected. Falls back to a generated id.                                                                                                                                                                 |
| `active`         | `boolean`                                                                                     |         | Renders the item in its pressed state.                                                                                                                                                                                                                  |
| `role`           | `'treeitem'` &#124; `'menuitem'` &#124; `'option'` &#124; `'row'`                             |         | The ARIA role of the item. Derived from the list by default.                                                                                                                                                                                            |
| `disabled`       | `boolean`                                                                                     |         | Disables the user interaction.                                                                                                                                                                                                                          |
| `checkmark`      | `CheckboxProps`                                                                               |         | The props to spread on the checkbox rendered when the list is multiselect.                                                                                                                                                                              |
| `onAction`       | `(e: MouseEvent, value: string) => void`                                                      |         | Called when the item is clicked or activated with the keyboard.                                                                                                                                                                                         |
| `onfocus`        | `(e: Event, value: string) => void`                                                           |         | Called when the item receives the focus.                                                                                                                                                                                                                |
| `ref` _bindable_ | `HTMLLIElement` &#124; `HTMLAnchorElement` &#124; `HTMLButtonElement` &#124; `HTMLDivElement` |         | The DOM reference of the item element.                                                                                                                                                                                                                  |
| HTML Attributes  |                                                                                               |         |                                                                                                                                                                                                                                                         |

<!-- /props:ListViewItemProps -->

## ListViewItemBranch Props

<!-- DO NOT EDIT THIS SECTION (propsmith generated) -->
<!-- props:ListViewItemBranchProps -->

| Name                                                                                                 | Type                                              | Default | Description                                                                                                                     |
| ---------------------------------------------------------------------------------------------------- | ------------------------------------------------- | ------- | ------------------------------------------------------------------------------------------------------------------------------- |
| `label`                                                                                              | `string`                                          |         | The accessible label rendered in the disclosure button.                                                                         |
| `expanded` _bindable_                                                                                | `boolean`                                         | `false` | Whether the nested content is visible. Branches only expand or collapse and are never selectable.                               |
| `onExpandedChange`                                                                                   | `(e: Event, expanded: boolean) => void`           |         | Called when a user expands or collapses the branch.                                                                             |
| `disabled`                                                                                           | `boolean`                                         | `false` | Disables the disclosure button.                                                                                                 |
| `shape`                                                                                              | `'circular'` &#124; `'rounded'` &#124; `'square'` |         | The disclosure button shape. Inherited from the list by default.                                                                |
| `ref` _bindable_                                                                                     | `HTMLButtonElement`                               |         | The DOM reference of the native disclosure button. Additional HTML attributes, including class and id, also target this button. |
| `children`                                                                                           | `Snippet`                                         |         | Nested ListView content, kept mounted while collapsed to preserve its selection.                                                |
| `HTMLButtonAttributes` without `children`, `role`, `type`, `value`, `aria-expanded`, `aria-controls` |                                                   |         |                                                                                                                                 |

<!-- /props:ListViewItemBranchProps -->
