# Label

A Label provides an accessible caption for a form control. It supports different sizes and weights, can be marked as required or disabled, and can be positioned relative to the control it wraps.

## Usage

```svelte
<script>
	import { Label, TextBox } from 'fluentui-svelte';
</script>

<Label label="Email" for="label-email"><TextBox id="label-email" /></Label>
```

The root is a `div` by default; `as="span"` selects a span. The text label and the field are siblings. Link them explicitly using `for` on Label and the same `id` on the control. `size` and `weight` style only the label text. `class`, other label attributes and `ref` apply to the label; use `wrapperAttributes` and `wrapperRef` for the root.

## Examples

### Size

Use the `size` prop to control the label text size.

```svelte
<Label size="small" label="Small" for="label-small"><TextBox id="label-small" /></Label>
<Label size="medium" label="Medium" for="label-medium"><TextBox id="label-medium" /></Label>
<Label size="large" label="Large" for="label-large"><TextBox id="label-large" /></Label>
```

### Weight

Use the `weight` prop to switch between a regular and a semibold label.

```svelte
<Label weight="regular" label="Regular" for="label-regular"><TextBox id="label-regular" /></Label>
<Label weight="semibold" label="Semibold" for="label-semibold"><TextBox id="label-semibold" /></Label>
```

### Label Position

Use the `labelPosition` prop to place the label text relative to the wrapped control.

```svelte
<Label labelPosition="before" label="Before" for="label-before"><TextBox id="label-before" /></Label>
<Label labelPosition="after" label="After" for="label-after"><TextBox id="label-after" /></Label>
<Label labelPosition="above" label="Above" for="label-above"><TextBox id="label-above" /></Label>
<Label labelPosition="below" label="Below" for="label-below"><TextBox id="label-below" /></Label>
```

### Required

Pass a `required` object to mark the label as required and render a required indicator.

```svelte
<Label label="Email" required={{ message: 'Required field' }} for="label-email-required"
	><TextBox id="label-email-required" required /></Label
>
```

### Other form controls

```svelte
<Label label="Accept terms" for="terms"><Checkbox id="terms" /></Label>
<Label label="Email updates" for="updates"><ToggleSwitch id="updates" /></Label>
<Label label="Standard plan" for="plan"><RadioButton id="plan" name="plan" value="standard" /></Label>
<Label label="Country" for="country">
	<Dropdown id="country"><DropdownOption value="bo">Bolivia</DropdownOption></Dropdown>
</Label>
```

Label renders its text and field as siblings. Link the label to the control with for and id. HTML attributes, class and ref apply to the label text element; wrapperAttributes and wrapperRef apply to the container. Size and weight affect only the label text.

## Component Props

<!-- DO NOT EDIT THIS SECTION (propsmith generated) -->
<!-- props:LabelProps -->

| Name                         | Type                                                          | Default           | Description                                                                                                        |
| ---------------------------- | ------------------------------------------------------------- | ----------------- | ------------------------------------------------------------------------------------------------------------------ |
| `as`                         | `'div'` &#124; `'span'`                                       | `'div'`           | The element used to wrap the label and its field.                                                                  |
| `children`                   | `Snippet`                                                     |                   | The field described by the label, rendered beside the label text.                                                  |
| `wrapperRef` _bindable_      | `HTMLDivElement` &#124; `HTMLSpanElement`                     |                   | The DOM reference of the wrapper element.                                                                          |
| `wrapperAttributes`          | `HTMLAttributes`                                              |                   | The attributes to spread on the wrapper element.                                                                   |
| `label`                      | `string`                                                      | `'Label Element'` | The text of the label.                                                                                             |
| `size`                       | `'small'` &#124; `'medium'` &#124; `'large'`                  | `'medium'`        | The size of the label text.                                                                                        |
| `weight`                     | `'regular'` &#124; `'semibold'`                               | `'regular'`       | The weight of the label text.                                                                                      |
| `labelPosition`              | `'before'` &#124; `'after'` &#124; `'above'` &#124; `'below'` | `'after'`         | Where the label sits relative to the field it describes.                                                           |
| `required`                   | `{ abbr?: string; message: string; }`                         |                   | Marks the field as required, and describes why through the given message.                                          |
| `disabled`                   | `boolean`                                                     |                   | Renders the label as disabled, to match the field it describes.                                                    |
| `ref` _bindable_             | `HTMLLabelElement`                                            |                   | The DOM reference of the label element.                                                                            |
| `id`                         | `string`                                                      | `Generated`       | The id of the label element. Pickers name their visible control after the labels of their native field through it. |
| Element Attributes (`label`) |                                                               |                   |                                                                                                                    |

<!-- /props:LabelProps -->
