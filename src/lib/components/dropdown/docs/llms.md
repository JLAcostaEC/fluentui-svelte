# Dropdown

The Dropdown lets users select one or more options from a list of `DropdownOption` children. Options can render rich content, such as a `Persona`, and the current selection is exposed through a bindable `value`.

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
		<Persona
			name="John Doe"
			primaryText="Software Engineer"
			presence={{ status: 'available' }}
			avatar={{ color: 'colorful', idForColor: '' }}
		/>
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

<!-- DO NOT EDIT THIS SECTION (propsmith generated) -->
<!-- props:DropdownProps -->

| Name                                                 | Type                       | Default              | Description                                                             |
| ---------------------------------------------------- | -------------------------- | -------------------- | ----------------------------------------------------------------------- |
| `value` _bindable_                                   | `string` &#124; `string[]` | `multiple ? [] : ''` | The selected value. An array of values when `multiple` is set.          |
| `multiple`                                           | `boolean`                  |                      | Allows more than one option to be selected at a time.                   |
| `placeholder`                                        | `string`                   | `'Select an option'` | The text shown by the trigger while no option is selected.              |
| `disabled`                                           | `boolean`                  |                      | Disables the user interaction.                                          |
| `name`                                               | `string` &#124; `null`     | `id`                 | The name submitted with the form. Falls back to the id of the dropdown. |
| `ref` _bindable_                                     | `HTMLDivElement`           |                      | The DOM reference of the dropdown element.                              |
| `onclick`                                            | `(e: MouseEvent) => void`  |                      | Called when the dropdown is clicked.                                    |
| `wrapperProps`                                       | `HTMLAttributes`           |                      | The attributes to spread on the wrapper element.                        |
| `buttonRef` _bindable_                               | `HTMLButtonElement`        |                      | The DOM reference of the button that opens the dropdown.                |
| `buttonProps`                                        | `HTMLButtonAttributes`     |                      | The attributes to spread on the button that opens the dropdown.         |
| `inputRef`                                           | `HTMLInputElement`         |                      | The DOM reference of the hidden input holding the value.                |
| `flyoutRef` _bindable_                               | `HTMLDivElement`           |                      | The DOM reference of the flyout element.                                |
| `flyoutProps`                                        | `FlyoutProps`              |                      | The props to spread on the flyout.                                      |
| `flyoutMaxHeight`                                    | `string`                   |                      | The maximum height of the flyout, as a CSS length.                      |
| `listboxRef` _bindable_                              | `HTMLUListElement`         |                      | The DOM reference of the listbox element.                               |
| `listboxProps`                                       | `ListViewProps`            |                      | The props to spread on the listbox rendered inside the flyout.          |
| `DropdownMultipleValue` &#124; `DropdownSingleValue` |                            |                      |                                                                         |
| `HTMLInputAttributes` without `value`, `onclick`     |                            |                      |                                                                         |

<!-- /props:DropdownProps -->

## DropdownOption Props

<!-- DO NOT EDIT THIS SECTION (propsmith generated) -->
<!-- props:DropdownOptionProps -->

| Name                      | Type     | Default | Description                                                                                      |
| ------------------------- | -------- | ------- | ------------------------------------------------------------------------------------------------ |
| `text`                    | `string` |         | The text shown by the dropdown once the option is selected. Falls back to the rendered children. |
| `ListViewItemProps<'li'>` |          |         |                                                                                                  |

<!-- /props:DropdownOptionProps -->
