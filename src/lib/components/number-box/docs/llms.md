# Number Box

The NumberBox component allows users to input numeric values with specified constraints such as minimum, maximum, and step values.

## Usage

```svelte
<script>
	import { NumberBox } from 'fluentui-svelte';
</script>

<NumberBox value={0} min={0} max={100} step={1} />
```

## Component API

A brief explanation of the props that really need explaining. You can see the rest of the props in the Component Props table below.

## Examples

### Variant

The variant prop determines the visual style of the NumberBox.

```svelte
<NumberBox hideActionButtons min={0} max={100} step={1} />
<NumberBox hideActionButtons min={0} max={100} step={1} variant="compact" />
```

## Component Props

<!-- DO NOT EDIT THIS SECTION (propsmith generated) -->
<!-- props:NumberBoxProps -->

| Name                          | Type                          | Default    | Description                                           |
| ----------------------------- | ----------------------------- | ---------- | ----------------------------------------------------- |
| `value` _bindable_            | `number`                      |            | The current value of the input.                       |
| `variant`                     | `'inline'` &#124; `'compact'` | `'inline'` | How the increment and decrement buttons are laid out. |
| `TextBoxProps` without `type` |                               |            |                                                       |

<!-- /props:NumberBoxProps -->
