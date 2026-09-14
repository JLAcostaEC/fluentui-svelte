# Dropdown Select

The Dropdown Select is a dropdown built on the native `<select>` element. It lets users choose one option, or several with the `multiple` prop, from a list of `DropdownSelectOption` children.

> **Early access:** The API, features, and behavior of the component are subject to significant changes. This component will be rebuilt using the FloatingUI Svelte package, which is still under active development. We strongly advise against using this component in production environments at this time.

## Usage

```svelte
<script>
	import { DropdownSelect, DropdownSelectOption } from 'fluentui-svelte';
</script>

<DropdownSelect>
	<DropdownSelectOption value="A">Option A</DropdownSelectOption>
	<DropdownSelectOption value="B">Option B</DropdownSelectOption>
	<DropdownSelectOption value="C">Option C</DropdownSelectOption>
</DropdownSelect>
```

## Examples

### Custom Option Content

Options can render rich content such as a `Persona`. Provide a `text` prop for the plain-text selection label.

```svelte
<DropdownSelect>
	<DropdownSelectOption value="John Doe" text="John Doe">
		<Persona
			name="John Doe"
			primaryText="Software Engineer"
			presence={{ status: 'available' }}
			avatar={{ color: 'colorful', idForColor: '' }}
		/>
	</DropdownSelectOption>
	<DropdownSelectOption value="B">Option B</DropdownSelectOption>
	<DropdownSelectOption value="C">Option C</DropdownSelectOption>
</DropdownSelect>
```

### Multiple Selection

Set the `multiple` prop to allow selecting more than one option.

```svelte
<DropdownSelect multiple>
	<DropdownSelectOption value="A">Option A</DropdownSelectOption>
	<DropdownSelectOption value="B">Option B</DropdownSelectOption>
	<DropdownSelectOption value="C">Option C</DropdownSelectOption>
</DropdownSelect>
```

## Component Props

<!-- DO NOT EDIT THIS SECTION (propsmith generated) -->
<!-- props:DropdownSelectProps -->

| Name                          | Type                       | Default                    | Description                                                            |
| ----------------------------- | -------------------------- | -------------------------- | ---------------------------------------------------------------------- |
| `value` _bindable_            | `string` &#124; `string[]` | `multiple ? [] : ''`       | The selected value. An array of values when `multiple` is set.         |
| `multiple`                    | `boolean`                  |                            | Allows more than one option to be selected at a time.                  |
| `placeholder`                 | `string`                   | `'Native Select Dropdown'` | The text shown while no option is selected.                            |
| `hidePlaceholder`             | `boolean`                  |                            | Keeps the placeholder out of the option list once a value is selected. |
| `ref` _bindable_              | `HTMLSelectElement`        |                            | The DOM reference of the select element.                               |
| `wrapperRef` _bindable_       | `HTMLDivElement`           |                            | The DOM reference of the wrapper element.                              |
| `wrapperProps`                | `HTMLAttributes`           |                            | The attributes to spread on the wrapper element.                       |
| Element Attributes (`select`) |                            |                            |                                                                        |

<!-- /props:DropdownSelectProps -->

## DropdownSelectOption Props

<!-- DO NOT EDIT THIS SECTION (propsmith generated) -->
<!-- props:DropdownSelectOptionProps -->

| Name                          | Type          | Default | Description                                                   |
| ----------------------------- | ------------- | ------- | ------------------------------------------------------------- |
| `value`                       | `string`      |         | The value reported to the select when the option is picked.   |
| `text`                        | `string`      |         | The label of the option. Falls back to the rendered children. |
| `disabled`                    | `boolean`     |         | Disables the user interaction.                                |
| `ref` _bindable_              | `HTMLElement` |         | The DOM reference of the option element.                      |
| `children`                    | `Snippet`     |         | The content of the option, used when no `text` is given.      |
| Element Attributes (`option`) |               |         |                                                               |

<!-- /props:DropdownSelectOptionProps -->
