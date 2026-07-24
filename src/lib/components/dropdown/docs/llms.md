# Dropdown

The Dropdown component allows users to select an option from a list. It supports various sizes, disabled states, and customizable options for better user interaction.

## Usage

```svelte
<script>
	import { Dropdown, DropdownOption } from 'fluentui-svelte';
</script>

<Dropdown>
	<DropdownOption value="A" text="Option A">Option A</DropdownOption>
	<DropdownOption value="B" text="Option B">Option B</DropdownOption>
</Dropdown>
```

## Examples

### Custom Option Content

Options can render any content, such as a `Persona`. Pass a `text` prop so the closed dropdown can still display the selection.

```svelte
<Dropdown>
	<DropdownOption value="John Doe" text="John Doe">
		<Persona name="John Doe" primaryText="Software Engineer" presence={{ status: 'available' }} avatar={{ color: 'colorful', idForColor: '' }} />
	</DropdownOption>
	<DropdownOption value="B" text="Option B">Option B</DropdownOption>
	<DropdownOption value="C" text="Option C">Option C</DropdownOption>
</Dropdown>
```

### Multiple Selection

Set the `multiple` prop to allow selecting more than one option.

```svelte
<Dropdown multiple>
	<DropdownOption value="A" text="Option A">Option A</DropdownOption>
	<DropdownOption value="B" text="Option B">Option B</DropdownOption>
	<DropdownOption value="C" text="Option C">Option C</DropdownOption>
</Dropdown>
```

## Component Props

| Name | Type | Description |
| --- | --- | --- |
| `value` | bindable `string \| string[]` | The selected value, or an array of values when `multiple` is set. |
| `multiple` | `boolean` | Allow selecting more than one option. |
| `placeholder` | `string` | Text shown when no option is selected. Default: `'Select an option'`. |
| `disabled` | `boolean` | Disables user interaction. |
| `flyoutMaxHeight` | `number` | Maximum height of the options flyout before it scrolls. |
| `name` | `string` | Name of the underlying form control. |
| `ref` | bindable `HTMLElement` | The DOM reference of the dropdown element. |
| `children` | `Snippet` | The `DropdownOption` items to render. |

## DropdownOption Props

| Name | Type | Description |
| --- | --- | --- |
| `value` | `string` | The value of the option, used for selection. |
| `text` | `string` | Plain-text label used to display the selection when the flyout is closed. |
| `children` | `Snippet` | The content rendered for the option (can be rich content such as a `Persona`). |
