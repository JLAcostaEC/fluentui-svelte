# Checkbox

Represents a control that a user can select (check) or clear (uncheck). A CheckBox can also report its value as indeterminate.

## Usage

```svelte
<script>
	import { Checkbox } from 'fluentui-svelte';
</script>

<Checkbox wrapperAs="label">Default</Checkbox>
```

## Component API

A brief explanation of the props that really need explaining. You can see the rest of the props in the Checkbox Props table below.

## Examples

### Label

To display a visible label, set `wrapperAs="label"` and pass the label text as children. The wrapper then renders as a `<label>` element that wraps the input.

```svelte
<Checkbox />
<Checkbox wrapperAs="label">FluentUI Checkbox</Checkbox>
<Checkbox wrapperAs="label">Another Checkbox</Checkbox>
```

### Checked

The `checked` prop determines whether the checkbox is checked or not. It accepts a boolean value.

```svelte
<Checkbox wrapperAs="label">Unchecked</Checkbox>
<Checkbox wrapperAs="label" checked>Checked</Checkbox>
```

### Indeterminate

The `indeterminate` prop sets the checkbox to an indeterminate state, which is useful for representing a mixed selection.

```svelte
<Checkbox wrapperAs="label" indeterminate>Indeterminate</Checkbox>
```

### Disabled

The `disabled` prop disables the checkbox, preventing user interaction. It accepts a boolean value.

```svelte
<Checkbox wrapperAs="label" disabled>Disabled</Checkbox>
<Checkbox wrapperAs="label" checked disabled>Checked & Disabled</Checkbox>
```

### Value

The `value` prop sets the value of the checkbox input. It is useful when the checkbox is part of a form submission.

```svelte
<Checkbox wrapperAs="label" value="checkbox-value">Checkbox with Value</Checkbox>
```

## Checkbox Props

<!-- DO NOT EDIT THIS SECTION (propsmith generated) -->
<!-- props:CheckboxProps -->

| Name                                            | Type                                       | Default   | Description                                                                                                                                                     |
| ----------------------------------------------- | ------------------------------------------ | --------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `ref` _bindable_                                | `HTMLInputElement`                         |           | The DOM reference of the checkbox element.                                                                                                                      |
| `wrapperAs`                                     | `'div'` &#124; `'label'`                   | `'label'` | The DOM element used to wrap the checkbox. `label` associates the children with the input; switch to `div` when the field is wrapped in a `<Label>` of its own. |
| `wrapperRef` _bindable_                         | `HTMLDivElement` &#124; `HTMLLabelElement` |           | The DOM reference of the checkbox wrapper element.                                                                                                              |
| `wrapperAttributes`                             | `PolymorphicProps`                         |           | The attributes to spread on the wrapper element.                                                                                                                |
| `indeterminate` _bindable_                      | `boolean`                                  |           | Renders the checkbox in its mixed state, neither checked nor unchecked.                                                                                         |
| `name`                                          | `string` &#124; `null`                     | `id`      | The name submitted with the form. Falls back to the id of the checkbox.                                                                                         |
| `group`                                         | `string` &#124; `null`                     |           | The value of the group of checkboxes this input belongs to.                                                                                                     |
| `checked` _bindable_                            | `boolean`                                  |           | Whether the checkbox is checked.                                                                                                                                |
| `disabled`                                      | `boolean`                                  |           | Disables the user interaction.                                                                                                                                  |
| `children`                                      | `Snippet`                                  |           | The content of the label. Only rendered when wrapperAs is set to label.                                                                                         |
| `HTMLInputAttributes` without `on:`, `children` |                                            |           |                                                                                                                                                                 |

<!-- /props:CheckboxProps -->
