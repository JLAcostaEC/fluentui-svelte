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

<!-- DO NOT EDIT THIS SECTION (propsmith generated) -->
<!-- props:ToggleSwitchProps -->

| Name                          | Type                  | Default | Description                                                |
| ----------------------------- | --------------------- | ------- | ---------------------------------------------------------- |
| `checked` _bindable_          | `boolean`             |         | Whether the switch is on.                                  |
| `ref` _bindable_              | `HTMLInputElement`    |         | The DOM reference of the input element.                    |
| `label`                       | `string`              |         | The label displayed next to the input element.             |
| `labelAttributes`             | `HTMLLabelAttributes` |         | The attributes to spread on the label wrapping the switch. |
| `labelElement`                | `HTMLLabelElement`    |         | The DOM reference of the label element.                    |
| `SvelteHTMLElements['input']` |                       |         |                                                            |

<!-- /props:ToggleSwitchProps -->
