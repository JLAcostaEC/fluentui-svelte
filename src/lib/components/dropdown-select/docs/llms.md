# Dropdown Select

> Part of fluentui-svelte. Read the global guide first (setup, rules and pitfalls): https://fluentui-svelte.dev/docs/llms.md, also shipped as node_modules/fluentui-svelte/skills/fluentui-svelte/SKILL.md

The Dropdown Select is a dropdown built on the native `<select>` element. It lets users choose one option, or several with the `multiple` prop, from a list of `DropdownSelectOption` children.

> **Browser compatibility:** Custom styling uses `appearance: base-select`, `::picker(select)` and `<selectedcontent>`. Single-select styling requires Chrome or Edge 135+, or Safari / iOS Safari 27+. Firefox (including 158) does not yet support the complete feature by default. Earlier Chrome / Edge and Safari versions use the native select appearance; rich option content and custom picker styling are unavailable.
>
> Custom styling for `multiple` requires Chrome or Edge 145+. Safari / iOS Safari 27 and Firefox 158 do not support customizable listboxes and use the native listbox. Browser compatibility verified on October 16, 2026.

## Usage

```svelte
<script>
	import { DropdownSelect, DropdownSelectOption } from 'fluentui-svelte';
</script>

<DropdownSelect aria-label="Choose an option">
	<DropdownSelectOption value="A">Option A</DropdownSelectOption>
	<DropdownSelectOption value="B">Option B</DropdownSelectOption>
	<DropdownSelectOption value="C">Option C</DropdownSelectOption>
</DropdownSelect>
```

## Examples

### Custom Option Content

Options can render rich content such as a `Persona`. Provide a `text` prop for the plain-text selection label.

```svelte
<DropdownSelect aria-label="Choose an option">
	<DropdownSelectOption value="John Doe" text="John Doe">
		<Persona
			name="John Doe"
			primaryText="Software Engineer"
			presence={{ status: 'available' }}
			avatarProps={{ color: 'colorful', idForColor: '' }}
		/>
	</DropdownSelectOption>
	<DropdownSelectOption value="B">Option B</DropdownSelectOption>
	<DropdownSelectOption value="C">Option C</DropdownSelectOption>
</DropdownSelect>
```

### Multiple Selection

Set the `multiple` prop to allow selecting more than one option.

```svelte
<DropdownSelect multiple aria-label="Choose options">
	<DropdownSelectOption value="A">Option A</DropdownSelectOption>
	<DropdownSelectOption value="B">Option B</DropdownSelectOption>
	<DropdownSelectOption value="C">Option C</DropdownSelectOption>
</DropdownSelect>
```

HTML attributes, including class, id and ARIA attributes, apply to the control element. Bind ref to access that control. Use wrapperAttributes and wrapperRef for the outer container.

## Component Props

<!-- DO NOT EDIT THIS SECTION (propsmith generated) -->
<!-- props:DropdownSelectProps -->

| Name                          | Type                                              | Default                    | Description                                                            |
| ----------------------------- | ------------------------------------------------- | -------------------------- | ---------------------------------------------------------------------- |
| `shape`                       | `'circular'` &#124; `'rounded'` &#124; `'square'` | `'rounded'`                | Shape of the input surface, including its border and focus indicator.  |
| `value` _bindable_            | `string` &#124; `string[]`                        | `multiple ? [] : ''`       | The selected value. An array of values when `multiple` is set.         |
| `multiple`                    | `boolean`                                         |                            | Allows more than one option to be selected at a time.                  |
| `placeholder`                 | `string`                                          | `'Native Select Dropdown'` | The text shown while no option is selected.                            |
| `hidePlaceholder`             | `boolean`                                         |                            | Keeps the placeholder out of the option list once a value is selected. |
| `ref` _bindable_              | `HTMLSelectElement` &#124; `null`                 |                            | The DOM reference of the select element.                               |
| `wrapperRef` _bindable_       | `HTMLDivElement` &#124; `null`                    |                            | The DOM reference of the wrapper element.                              |
| `wrapperAttributes`           | `HTMLAttributes`                                  |                            | The attributes to spread on the wrapper element.                       |
| Element Attributes (`select`) |                                                   |                            |                                                                        |

<!-- /props:DropdownSelectProps -->

## DropdownSelectOption Props

<!-- DO NOT EDIT THIS SECTION (propsmith generated) -->
<!-- props:DropdownSelectOptionProps -->

| Name                          | Type                        | Default | Description                                                   |
| ----------------------------- | --------------------------- | ------- | ------------------------------------------------------------- |
| `value`                       | `string`                    |         | The value reported to the select when the option is picked.   |
| `text`                        | `string`                    |         | The label of the option. Falls back to the rendered children. |
| `disabled`                    | `boolean`                   |         | Disables the user interaction.                                |
| `ref` _bindable_              | `HTMLElement` &#124; `null` |         | The DOM reference of the option element.                      |
| `children`                    | `Snippet`                   |         | The content of the option, used when no `text` is given.      |
| Element Attributes (`option`) |                             |         |                                                               |

<!-- /props:DropdownSelectOptionProps -->
