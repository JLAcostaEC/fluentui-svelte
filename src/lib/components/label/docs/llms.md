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

<!-- DO NOT EDIT THIS SECTION (propsmith generated) -->
<!-- props:LabelProps -->

| Name                         | Type                                                          | Default           | Description                                                               |
| ---------------------------- | ------------------------------------------------------------- | ----------------- | ------------------------------------------------------------------------- |
| `label`                      | `string`                                                      | `'Label Element'` | The text of the label. Falls back to the rendered children.               |
| `size`                       | `'small'` &#124; `'medium'` &#124; `'large'`                  | `'medium'`        | The size of the label text.                                               |
| `weight`                     | `'regular'` &#124; `'semibold'`                               | `'regular'`       | The weight of the label text.                                             |
| `labelPosition`              | `'before'` &#124; `'after'` &#124; `'above'` &#124; `'below'` | `'after'`         | Where the label sits relative to the field it describes.                  |
| `required`                   | `{ abbr?: string; message: string; }`                         |                   | Marks the field as required, and describes why through the given message. |
| `disabled`                   | `boolean`                                                     |                   | Renders the label as disabled, to match the field it describes.           |
| `ref` _bindable_             | `HTMLLabelElement`                                            |                   | The DOM reference of the label element.                                   |
| Element Attributes (`label`) |                                                               |                   |                                                                           |

<!-- /props:LabelProps -->
