# Toggle Switch

A toggle switch represents a physical switch that allows someone to choose between two mutually exclusive options. For example, 'On/Off' and 'Show/Hide'. Choosing an option should produce an immediate result.

## Usage

```svelte
<script>
	import { ToggleSwitch } from 'fluentui-svelte';
</script>

<ToggleSwitch />
<ToggleSwitch label="Toggle me" />
<ToggleSwitch label="I'm disabled" disabled />
```

## Examples

### States

A toggle switch can be labeled, checked, or disabled.

```svelte
<ToggleSwitch label="Off" />
<ToggleSwitch label="On" checked />
<ToggleSwitch label="Disabled" disabled />
```

## Component Props

| Name               | Type                  | Description                                                  |
| ------------------ | --------------------- | ------------------------------------------------------------ |
| `ref`              | `HTMLInputElement`    | Get the DOM reference of the input element.                  |
| `label`            | `string`              | The label for the toggle switch.                             |
| `labelAttributes`  | `HTMLLabelAttributes` | Attributes to be spread on the label wrapper element.        |
| `labelElement`     | `HTMLLabelElement`    | Get the DOM reference of the label element.                  |
| `disabled`         | `boolean`             | Whether the toggle switch is disabled.                       |
| `checked`          | `boolean`             | Whether the toggle switch is checked (on).                   |
| Element Attributes | `object`              | Additional attributes to apply to the toggle switch element. |
