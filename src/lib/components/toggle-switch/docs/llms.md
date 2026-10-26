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

HTML attributes, including class, id and ARIA attributes, apply to the control element. Bind ref to access that control. Use wrapperAttributes and wrapperRef for the outer container.

## Component Props

<!-- DO NOT EDIT THIS SECTION (propsmith generated) -->
<!-- props:ToggleSwitchProps -->

| Name                         | Type               | Default | Description                                                                         |
| ---------------------------- | ------------------ | ------- | ----------------------------------------------------------------------------------- |
| `checked` _bindable_         | `boolean`          |         | Whether the switch is on.                                                           |
| `ref` _bindable_             | `HTMLInputElement` |         | The DOM reference of the input element.                                             |
| `label`                      | `string`           |         | The label displayed next to the input element. Inside a `Label`, it is not rendered |
| `wrapperAttributes`          | `HTMLAttributes`   |         | The attributes to spread on the wrapper element.                                    |
| `wrapperRef` _bindable_      | `HTMLDivElement`   |         | The DOM reference of the wrapper element.                                           |
| Element Attributes (`input`) |                    |         |                                                                                     |

<!-- /props:ToggleSwitchProps -->
