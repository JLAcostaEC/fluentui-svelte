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

| Name              | Type                          | Description                                                                 |
| ----------------- | ----------------------------- | --------------------------------------------------------------------------- |
| `value`           | bindable `string \| string[]` | The selected value, or an array of values when `multiple` is set.           |
| `multiple`        | `boolean`                     | Allow selecting more than one option.                                       |
| `placeholder`     | `string`                      | Text shown when no option is selected. Default: `'Native Select Dropdown'`. |
| `hidePlaceholder` | `boolean`                     | Hides the placeholder option.                                               |
| `ref`             | bindable `HTMLSelectElement`  | The DOM reference of the underlying `<select>` element.                     |
| `wrapperRef`      | bindable `HTMLDivElement`     | The DOM reference of the wrapper element.                                   |
| `children`        | `Snippet`                     | The `DropdownSelectOption` items to render.                                 |

## DropdownSelectOption Props

| Name       | Type      | Description                                                             |
| ---------- | --------- | ----------------------------------------------------------------------- |
| `value`    | `string`  | The value of the option, used for selection.                            |
| `text`     | `string`  | Plain-text label used to display the selection when the list is closed. |
| `children` | `Snippet` | The content rendered for the option.                                    |
