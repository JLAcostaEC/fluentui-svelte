# LiteFilter

> Part of fluentui-svelte. Read the global guide first (setup, rules and pitfalls): https://fluentui-svelte.dev/docs/llms.md, also shipped as node_modules/fluentui-svelte/skills/fluentui-svelte/SKILL.md

A LiteFilter is a row of pills (PillButton) that filters content, such as search results. When the pills do not fit, the row scrolls and an arrow shows on each side that hides pills.

```svelte
<script>
	import { LiteFilter, LiteFilterItem } from 'fluentui-svelte';
	let filter = $state('all');
</script>

<LiteFilter aria-label="Search filters" bind:selectedValue={filter}>
	<LiteFilterItem value="all">All</LiteFilterItem>
	<LiteFilterItem value="apps">Apps</LiteFilterItem>
	<LiteFilterItem value="documents">Documents</LiteFilterItem>
</LiteFilter>
```

- One item is selected at a time by default (a radio group with one tab stop and arrow keys): `bind:selectedValue` is a string, and the selected pill stays selected on a second click. A form reset brings back the initial selection.
- `multiple` turns it into a group of checkboxes: `bind:selectedValue` is a string array and can be empty. When `multiple` changes, the selection takes the new shape: an array keeps its first value, a string becomes an array.
- `onSelectionChange(event, value)` reports user changes. `name` and `form` submit the selected values with a form: one value, or one entry per pill with `multiple`.
- Wrap it in a `Label` for a visible name: the Label names the group (no `aria-label` needed).
- `size` and `appearance` style every pill, like on PillButton. `disabled` disables the whole filter; `LiteFilterItem` takes its own `disabled` and an `icon`.
- Give it a width (or put it in a container with one): the arrows appear only when the pills overflow. Tab moves through the pills and scrolls the focused one into view; the arrows stay off the tab order. Localize `previousLabel` and `nextLabel`.

## Props

### LiteFilter

<!-- props:LiteFilterProps -->

| Name                                                | Type                                                                | Default            | Description                                                                                                                                |
| --------------------------------------------------- | ------------------------------------------------------------------- | ------------------ | ------------------------------------------------------------------------------------------------------------------------------------------ |
| `ref` _bindable_                                    | `HTMLDivElement` &#124; `null`                                      |                    | The DOM reference of the root element.                                                                                                     |
| `selectedValue` _bindable_                          | `string` &#124; `string[]`                                          |                    | The value of the selected item, or the values of the selected items when `multiple` is set.                                                |
| `multiple`                                          | `boolean`                                                           |                    | Lets more than one item be selected, and none. A selection kept across a change of mode takes the new shape: the first value, or an array. |
| `name`                                              | `string`                                                            |                    | The field name shared by every item.                                                                                                       |
| `form`                                              | `string`                                                            |                    | The id of the form that owns the items, when outside that form.                                                                            |
| `disabled`                                          | `boolean`                                                           |                    | Disables every item.                                                                                                                       |
| `size`                                              | `'small'` &#124; `'medium'` &#124; `'large'` &#124; `'extra-large'` | `'medium'`         | The height and text size of the pills.                                                                                                     |
| `appearance`                                        | `'filled'` &#124; `'outline'` &#124; `'brand'`                      | `'filled'`         | The appearance of the pills.                                                                                                               |
| `onSelectionChange`                                 | `(event: Event, value: string` &#124; `string[]) => void`           |                    | Fired when user interaction changes the selection.                                                                                         |
| `previousLabel`                                     | `string`                                                            | `'Scroll back'`    | Accessible name of the button that scrolls back.                                                                                           |
| `nextLabel`                                         | `string`                                                            | `'Scroll forward'` | Accessible name of the button that scrolls forward.                                                                                        |
| `disableTabspot`                                    | `boolean`                                                           |                    | Disables tabspot keyboard navigation.                                                                                                      |
| `children`                                          | `Snippet`                                                           |                    | The items of the filter.                                                                                                                   |
| `HTMLAttributes<HTMLDivElement>` without `children` |                                                                     |                    |                                                                                                                                            |

<!-- /props:LiteFilterProps -->

### LiteFilterItem

<!-- props:LiteFilterItemProps -->

| Name             | Type                                                                                 | Default | Description                                             |
| ---------------- | ------------------------------------------------------------------------------------ | ------- | ------------------------------------------------------- |
| `ref` _bindable_ | `HTMLInputElement` &#124; `null`                                                     |         | The DOM reference of the native input.                  |
| `value`          | `string`                                                                             |         | A unique value identifying this item within its filter. |
| `icon`           | `Snippet<[SVGAttributes<SVGElement>]>` &#124; `Component<SVGAttributes<SVGElement>>` |         | An optional decorative Fluent icon before the label.    |
| `disabled`       | `boolean`                                                                            |         | Disables this item.                                     |
| `children`       | `Snippet`                                                                            |         | The label of the item.                                  |

<!-- /props:LiteFilterItemProps -->
