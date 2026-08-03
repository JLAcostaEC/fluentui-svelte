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

| Name          | Type                    | Description                                                   |
| ------------- | ----------------------- | ------------------------------------------------------------- |
| `value`       | `number`                | The current value of the NumberBox.                           |
| `variant`     | `'inline' \| 'compact'` | The visual style of the NumberBox, e.g., 'inline', 'compact'. |
| `ref`         | `HTMLInputElement`      | The DOM reference to the input element.                       |
| TextBox Props |                         | Additional props inherited from the TextBox component.        |
