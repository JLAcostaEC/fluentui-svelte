# Label

A Label provides an accessible caption for a form control. It supports different sizes and weights, can be marked as required or disabled, and can be positioned relative to the control it wraps.

## Usage

```svelte
<script>
	import { Label, TextBox } from 'fluentui-svelte';
</script>

<Label label="Email"><TextBox /></Label>
```

The root is a `div` by default; `as="span"` selects a span. The text label and the field are siblings. Label is for the first field inside it, which takes the id of the label when it has none of its own; pass `for` to point the label at another field. Inside a Label, the own text of a Checkbox, RadioButton or ToggleSwitch is not rendered: the Label names the control. `size` and `weight` style only the label text. `class`, other label attributes and `ref` apply to the label; use `wrapperAttributes` and `wrapperRef` for the root.

## Examples

### Size

Use the `size` prop to control the label text size.

```svelte
<Label size="small" label="Small"><TextBox /></Label>
<Label size="medium" label="Medium"><TextBox /></Label>
<Label size="large" label="Large"><TextBox /></Label>
```

### Weight

Use the `weight` prop to switch between a regular and a semibold label.

```svelte
<Label weight="regular" label="Regular"><TextBox /></Label>
<Label weight="semibold" label="Semibold"><TextBox /></Label>
```

### Label Position

Use the `labelPosition` prop to place the label text relative to the wrapped control.

```svelte
<Label labelPosition="before" label="Before"><TextBox /></Label>
<Label labelPosition="after" label="After"><TextBox /></Label>
<Label labelPosition="above" label="Above"><TextBox /></Label>
<Label labelPosition="below" label="Below"><TextBox /></Label>
```

### Required

Pass a `required` object to mark the label as required and render a required indicator.

```svelte
<Label label="Email" required={{ message: 'Required field' }}><TextBox required /></Label>
```

### Tooltip

Pass `tooltipContent`, as text, a snippet or a component, to show more about the field in a tooltip from a badge after the label text. The badge is a button named after the label; `tooltipBadge` replaces its info icon, and `tooltipButtonAttributes` its `aria-label`. Keep links and buttons out of the tooltip.

```svelte
<Label
	label="Bank"
	labelPosition="above"
	required={{ message: 'Required field' }}
	tooltipContent="The bank that holds the account the payments come from."
>
	<Dropdown placeholder="Bank Name">
		<DropdownOption value="pichincha">Banco Pichincha</DropdownOption>
		<DropdownOption value="guayaquil">Banco Guayaquil</DropdownOption>
	</Dropdown>
</Label>
<Label
	label="IBAN"
	labelPosition="above"
	tooltipBadge={QuestionCircleRegular}
	tooltipContent="The international number of the account, as your bank prints it."
>
	<TextBox placeholder="EC00 0000 0000 0000" />
</Label>
```

### Other form controls

```svelte
<Label label="Accept terms"><Checkbox /></Label>
<Label label="Email updates"><ToggleSwitch /></Label>
<Label label="Standard plan"><RadioButton name="plan" value="standard" /></Label>
<Label label="Country">
	<Dropdown><DropdownOption value="bo">Bolivia</DropdownOption></Dropdown>
</Label>
```

Label renders its text and field as siblings, and is for the first field inside it, which takes the id of the label when it has none of its own. Pass for to point the label at another field. HTML attributes, class and ref apply to the label text element; wrapperAttributes and wrapperRef apply to the container. Size and weight affect only the label text.

## Component Props

<!-- DO NOT EDIT THIS SECTION (propsmith generated) -->
<!-- props:LabelProps -->

| Name                                | Type                                                          | Default            | Description                                                                                                                                                                                                                                                                                         |
| ----------------------------------- | ------------------------------------------------------------- | ------------------ | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `as`                                | `'div'` &#124; `'span'`                                       | `'div'`            | The element used to wrap the label and its field.                                                                                                                                                                                                                                                   |
| `children`                          | `Snippet`                                                     |                    | The field described by the label, rendered beside the label text.                                                                                                                                                                                                                                   |
| `wrapperRef` _bindable_             | `HTMLDivElement` &#124; `HTMLSpanElement`                     |                    | The DOM reference of the wrapper element.                                                                                                                                                                                                                                                           |
| `wrapperAttributes`                 | `HTMLAttributes`                                              |                    | The attributes to spread on the wrapper element.                                                                                                                                                                                                                                                    |
| `label`                             | `string`                                                      | `'Label Element'`  | The text of the label.                                                                                                                                                                                                                                                                              |
| `size`                              | `'small'` &#124; `'medium'` &#124; `'large'`                  | `'medium'`         | The size of the label text.                                                                                                                                                                                                                                                                         |
| `weight`                            | `'regular'` &#124; `'semibold'`                               | `'regular'`        | The weight of the label text.                                                                                                                                                                                                                                                                       |
| `labelPosition`                     | `'before'` &#124; `'after'` &#124; `'above'` &#124; `'below'` | `'after'`          | Where the label sits relative to the field it describes.                                                                                                                                                                                                                                            |
| `required`                          | `{ abbr?: string; message: string; }`                         |                    | Marks the field as required, and describes why through the given message.                                                                                                                                                                                                                           |
| `disabled`                          | `boolean`                                                     |                    | Renders the label as disabled, to match the field it describes.                                                                                                                                                                                                                                     |
| `ref` _bindable_                    | `HTMLLabelElement` &#124; `null`                              |                    | The DOM reference of the label element.                                                                                                                                                                                                                                                             |
| `id`                                | `string`                                                      | `Generated`        | The id of the label element. A control inside the label is named after it, including a picker whose visible control stands in for its native field.                                                                                                                                                 |
| `for`                               | `string`                                                      | `The field inside` | The id of the field the label is for. Without it, the label is for the first field inside it, which takes a generated id when it has none of its own. With `labelPosition` `before` or `above` and a field that has an id of its own, pass that id here, so the server renders the association too. |
| `tooltipContent`                    | `string` &#124; `Snippet` &#124; `Component`                  |                    | More about the field, in a tooltip shown from a badge after the label text, on hover and on focus. People cannot move into a tooltip, so keep links and buttons out of it.                                                                                                                          |
| `tooltipBadge`                      | `Snippet` &#124; `Component`                                  | `InfoRegular`      | What the badge that shows the tooltip displays. Only rendered with `tooltipContent`.                                                                                                                                                                                                                |
| `tooltipProps`                      | `TooltipProps`                                                |                    | The props to spread on the tooltip.                                                                                                                                                                                                                                                                 |
| `tooltipButtonAttributes`           | `HTMLButtonAttributes`                                        |                    | The attributes to spread on the button of the badge. Its name is the label text followed by its `aria-label`.                                                                                                                                                                                       |
| `HTMLLabelAttributes` without `for` |                                                               |                    |                                                                                                                                                                                                                                                                                                     |

<!-- /props:LabelProps -->
