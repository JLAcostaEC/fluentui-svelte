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

| Name                | Type                                          | Description                                                                                    |
| ------------------- | --------------------------------------------- | ---------------------------------------------------------------------------------------------- |
| `wrapperAs`         | `'div' \| 'label'`                            | The element the wrapper renders as. Set to `label` to show a visible label. Defaults to `div`. |
| `children`          | `Snippet`                                     | Label content rendered next to the input. Only allowed when `wrapperAs="label"`.               |
| `checked`           | `boolean`                                     | Determines if the checkbox is checked.                                                         |
| `indeterminate`     | `boolean`                                     | Sets the checkbox to an indeterminate state.                                                   |
| `disabled`          | `boolean`                                     | Disables the checkbox, preventing user interaction.                                            |
| `value`             | `string`                                      | The value of the checkbox input, useful for form submissions.                                  |
| `wrapperAttributes` | `object`                                      | Additional attributes for the wrapper element.                                                 |
| `ref`               | bindable `HTMLInputElement`                   | The DOM reference of the checkbox input element.                                               |
| `wrapperRef`        | bindable `HTMLDivElement \| HTMLLabelElement` | The DOM reference of the checkbox wrapper element.                                             |
| Input Attributes    |                                               | Additional attributes for the checkbox input element.                                          |
