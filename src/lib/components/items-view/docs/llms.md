# ItemsView

> Part of fluentui-svelte. Read the global guide first (setup, rules and pitfalls): https://fluentui-svelte.dev/docs/llms.md, also shipped as node_modules/fluentui-svelte/skills/fluentui-svelte/SKILL.md

An ItemsView displays a collection of items as a stack, a uniform grid or lines that keep the aspect ratio of each item, and lets users select and invoke them. It replaces a GridView: `layout="grid"` gives the same result.

```svelte
<script>
	import { ItemsView, ItemsViewItem } from 'fluentui-svelte';
	let selectedItems = $state([]);
</script>

<ItemsView aria-label="Photos" layout="grid" minItemWidth={160} selectionMode="single" bind:selectedItems>
	<ItemsViewItem value="one" style="height: 7rem;"><img src="/one.jpg" alt="One" /></ItemsViewItem>
	<ItemsViewItem value="two" style="height: 7rem;"><img src="/two.jpg" alt="Two" /></ItemsViewItem>
</ItemsView>
```

- `layout`: `stack` (default, `orientation` turns it horizontal), `grid` (columns of at least `minItemWidth`) or `flow` (lines `lineHeight` tall; items keep their aspect ratio and grow to fill each line). `spacing` sets the gap. Numbers are pixels.
- Each `ItemsViewItem` holds any content; a direct `img` or `video` fills it. Size the items in `stack` and `grid` (`height`, `width`).
- `selectionMode`: `none` (default), `single`, `multiselect` (a click toggles) or `extended` (Ctrl + click toggles, Shift + click selects a range). `showCheckboxes` adds a checkbox to each selectable item. `bind:selectedItems` holds the selected `value`s; `onSelectionChange` reports changes.
- `onItemInvoke(e, value)` runs on a double-click or Enter; with `selectionMode="none"` a click invokes.

<!-- coderabbit-ai-generated:v1 -->

<!-- coderabbit-ai-generated-section:v1:75a7616deac1253c9db8b256feba41c4a57aed6f8f6d845b9b4df0622aa6aaa5 -->

- A `listbox` when selectable, a `list` otherwise. When keyboard focus is available and Tabspot is enabled, items share one tab stop. Arrow-key navigation requires `FluentUISvelte`: arrows move (across rows in `grid` and `flow`), Home and End jump to the ends. Space selects. Enter invokes only when `onItemInvoke` is provided; otherwise, it selects in single-selection mode. Name it with `aria-label` and describe each image with `alt`.

<!-- /coderabbit-ai-generated:v1 -->

## ItemsView Props

<!-- DO NOT EDIT THIS SECTION (propsmith generated) -->
<!-- props:ItemsViewProps -->

| Name                       | Type                                                                  | Default      | Description                                                                                          |
| -------------------------- | --------------------------------------------------------------------- | ------------ | ---------------------------------------------------------------------------------------------------- |
| `layout`                   | `'stack'` &#124; `'grid'` &#124; `'flow'`                             | `'stack'`    | How the items are arranged: a stack, a uniform grid or lines of items that keep their aspect ratio.  |
| `orientation`              | `'horizontal'` &#124; `'vertical'`                                    | `'vertical'` | The direction of the `stack` layout.                                                                 |
| `spacing`                  | `number` &#124; `string`                                              | `4`          | The space between items. A number is read as pixels.                                                 |
| `minItemWidth`             | `number` &#124; `string`                                              | `160`        | The minimum width of a column in the `grid` layout. A number is read as pixels.                      |
| `lineHeight`               | `number` &#124; `string`                                              | `160`        | The height of a line in the `flow` layout. A number is read as pixels.                               |
| `selectionMode`            | `'none'` &#124; `'single'` &#124; `'multiselect'` &#124; `'extended'` | `'none'`     | How many items can be selected, and how the selection is made.                                       |
| `showCheckboxes`           | `boolean`                                                             | `false`      | Shows a checkbox on each item when items can be selected.                                            |
| `selectedItems` _bindable_ | `string[]`                                                            |              | The values of the selected items.                                                                    |
| `onSelectionChange`        | `(e: Event, selectedItems: string[]) => void`                         |              | Called whenever the selection changes.                                                               |
| `onItemInvoke`             | `(e: Event, value: string) => void`                                   |              | Called when an item is invoked: with a double-click or Enter, or a click when nothing is selectable. |
| `disableTabspot`           | `boolean`                                                             | `false`      | Opts the items view out of the tabspot focus management, to wire your own.                           |
| `ref` _bindable_           | `HTMLDivElement` &#124; `null`                                        |              | The DOM reference of the items view element.                                                         |
| Element Attributes (`div`) |                                                                       |              |                                                                                                      |

<!-- /props:ItemsViewProps -->

## ItemsViewItem Props

<!-- DO NOT EDIT THIS SECTION (propsmith generated) -->
<!-- props:ItemsViewItemProps -->

| Name                       | Type                           | Default | Description                                                                                   |
| -------------------------- | ------------------------------ | ------- | --------------------------------------------------------------------------------------------- |
| `value`                    | `string`                       |         | The value reported to the items view when the item is selected. Falls back to a generated id. |
| `disabled`                 | `boolean`                      |         | Disables the user interaction.                                                                |
| `ref` _bindable_           | `HTMLDivElement` &#124; `null` |         | The DOM reference of the item element.                                                        |
| Element Attributes (`div`) |                                |         |                                                                                               |

<!-- /props:ItemsViewItemProps -->
