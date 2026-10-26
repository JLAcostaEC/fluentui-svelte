# Checkbox

Represents a control that a user can select (check) or clear (uncheck). A CheckBox can also report its value as indeterminate.

## Usage

```svelte
<script>
	import { Checkbox } from 'fluentui-svelte';
</script>

<Checkbox>Default</Checkbox>
```

## Component API

A brief explanation of the props that really need explaining. You can see the rest of the props in the Checkbox Props table below.

## Examples

### Label

Pass the label text as children. The root is a `<div>` and the text renders in a separate `<label>` associated with the checkbox through `for` and `id`. Inside a `Label`, it is not rendered: the Label names the checkbox.

```svelte
<Checkbox />
<Checkbox>FluentUI Checkbox</Checkbox>
<Checkbox>Another Checkbox</Checkbox>
```

### Checked

The `checked` prop determines whether the checkbox is checked or not. It accepts a boolean value.

```svelte
<Checkbox>Unchecked</Checkbox>
<Checkbox checked>Checked</Checkbox>
```

### Indeterminate

The `indeterminate` prop sets the checkbox to an indeterminate state, which is useful for representing a mixed selection.

```svelte
<Checkbox indeterminate>Indeterminate</Checkbox>
```

### Disabled

The `disabled` prop disables the checkbox, preventing user interaction. It accepts a boolean value.

```svelte
<Checkbox disabled>Disabled</Checkbox>
<Checkbox checked disabled>Checked & Disabled</Checkbox>
```

### Value

The `value` prop sets the value of the checkbox input. It is useful when the checkbox is part of a form submission.

```svelte
<Checkbox value="checkbox-value">Checkbox with Value</Checkbox>
```

HTML attributes, including class, id and ARIA attributes, apply to the control element. Bind ref to access that control. Use wrapperAttributes and wrapperRef for the outer container.

## Checkbox Props

<!-- DO NOT EDIT THIS SECTION (propsmith generated) -->
<!-- props:CheckboxProps -->

| Name                                            | Type                   | Default | Description                                                                                 |
| ----------------------------------------------- | ---------------------- | ------- | ------------------------------------------------------------------------------------------- |
| `ref` _bindable_                                | `HTMLInputElement`     |         | The DOM reference of the checkbox element.                                                  |
| `wrapperRef` _bindable_                         | `HTMLDivElement`       |         | The DOM reference of the checkbox wrapper element.                                          |
| `wrapperAttributes`                             | `HTMLAttributes`       |         | The attributes to spread on the wrapper element.                                            |
| `indeterminate` _bindable_                      | `boolean`              |         | Renders the checkbox in its mixed state, neither checked nor unchecked.                     |
| `name`                                          | `string` &#124; `null` | `id`    | The name submitted with the form. Falls back to the id of the checkbox.                     |
| `group`                                         | `string` &#124; `null` |         | The value of the group of checkboxes this input belongs to.                                 |
| `checked` _bindable_                            | `boolean`              |         | Whether the checkbox is checked.                                                            |
| `disabled`                                      | `boolean`              |         | Disables the user interaction.                                                              |
| `children`                                      | `Snippet`              |         | The content of the label associated with the checkbox. Inside a `Label`, it is not rendered |
| `HTMLInputAttributes` without `on:`, `children` |                        |         |                                                                                             |

<!-- /props:CheckboxProps -->
