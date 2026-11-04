# Number Box

> Part of fluentui-svelte. Read the global guide first (setup, rules and pitfalls): https://fluentui-svelte.dev/docs/llms.md, also shipped as node_modules/fluentui-svelte/skills/fluentui-svelte/SKILL.md

The NumberBox component allows users to input numeric values with specified constraints such as minimum, maximum, and step values.

## Usage

```svelte
<script>
	import { NumberBox } from 'fluentui-svelte';
</script>

<NumberBox aria-label="Quantity" value={0} min={0} max={100} step={1} />
```

## Component API

A brief explanation of the props that really need explaining. You can see the rest of the props in the Component Props table below.

## Examples

### Variant

The variant prop determines the visual style of the NumberBox.

```svelte
<NumberBox aria-label="Quantity" hideActionButtons min={0} max={100} step={1} />
<NumberBox aria-label="Quantity" hideActionButtons min={0} max={100} step={1} variant="compact" />
```

HTML attributes, including class, id and ARIA attributes, apply to the control element. Bind ref to access that control. Use wrapperAttributes and wrapperRef for the outer container.

## Component Props

<!-- DO NOT EDIT THIS SECTION (propsmith generated) -->
<!-- props:NumberBoxProps -->

| Name                          | Type                          | Default    | Description                                           |
| ----------------------------- | ----------------------------- | ---------- | ----------------------------------------------------- |
| `value` _bindable_            | `number` &#124; `null`        |            | The current value of the input.                       |
| `variant`                     | `'inline'` &#124; `'compact'` | `'inline'` | How the increment and decrement buttons are laid out. |
| `TextBoxProps` without `type` |                               |            |                                                       |

<!-- /props:NumberBoxProps -->
