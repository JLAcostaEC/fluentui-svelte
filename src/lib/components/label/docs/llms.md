# Label

A Label provides an accessible caption for a form control. It supports different sizes and weights, can be marked as required or disabled, and can be positioned relative to the control it wraps.

## Usage

```svelte
<script>
	import { Label } from 'fluentui-svelte';
</script>

<Label label="Email" />
```

## Examples

### Size

Use the `size` prop to control the label text size.

```svelte
<Label size="small" label="Small" />
<Label size="medium" label="Medium" />
<Label size="large" label="Large" />
```

### Weight

Use the `weight` prop to switch between a regular and a semibold label.

```svelte
<Label weight="regular" label="Regular" />
<Label weight="semibold" label="Semibold" />
```

### Label Position

Use the `labelPosition` prop to place the label text relative to the wrapped control.

```svelte
<Label labelPosition="before" label="Before" />
<Label labelPosition="after" label="After" />
<Label labelPosition="above" label="Above" />
<Label labelPosition="below" label="Below" />
```

### Required

Pass a `required` object to mark the label as required and render a required indicator.

```svelte
<Label label="Email" required={{ message: 'Required field' }} />
```

## Component Props

| Name            | Type                                        | Description                                                                     |
| --------------- | ------------------------------------------- | ------------------------------------------------------------------------------- |
| `label`         | `string`                                    | The text content of the label. Default: `'Label Element'`.                      |
| `size`          | `'small' \| 'medium' \| 'large'`            | The size of the label text. Default: `'medium'`.                                |
| `weight`        | `'regular' \| 'semibold'`                   | The font weight of the label. Default: `'regular'`.                             |
| `labelPosition` | `'before' \| 'after' \| 'above' \| 'below'` | Position of the label text relative to the wrapped content. Default: `'after'`. |
| `required`      | `{ message?: string; abbr?: string }`       | Marks the label as required and renders a required indicator (default `*`).     |
| `disabled`      | `boolean`                                   | Renders the label in a disabled style and disables pointer events.              |
| `class`         | `string`                                    | Additional classes applied to the label element.                                |
| `ref`           | bindable `HTMLLabelElement`                 | The DOM reference of the label element.                                         |
| `children`      | `Snippet`                                   | The content wrapped by the label (typically a form control).                    |
