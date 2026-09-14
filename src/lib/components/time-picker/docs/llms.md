# Time Picker

An input for selecting a time from carousel-style hour, minute, and second columns, in 12- or 24-hour format.

## Usage

```svelte
<script>
	import { TimePicker } from 'fluentui-svelte';

	let value = $state('');
</script>

<TimePicker bind:value format={12} />
```

## Examples

### Clock Format

Use the `format` prop to choose between a 24-hour clock (`24`) and a 12-hour clock with an AM/PM column (`12`).

```svelte
<TimePicker format={24} />
<TimePicker format={12} />
```

### Hiding Columns

Use `hideHours`, `hideMinutes`, or `hideSeconds` to hide individual columns. By default the seconds column is shown.

```svelte
<TimePicker format={24} hideSeconds />
```

## Component Props

<!-- DO NOT EDIT THIS SECTION (propsmith generated) -->
<!-- props:TimePickerProps -->

| Name                          | Type                  | Default           | Description                                                                                         |
| ----------------------------- | --------------------- | ----------------- | --------------------------------------------------------------------------------------------------- |
| `value` _bindable_            | `string`              | `''`              | Selected time as 24h `HH:mm` or `HH:mm:ss` (matches `<input type="time">`).                         |
| `format`                      | `12` &#124; `24`      | `24`              | Clock format: `24` (00-23) or `12` (01-12 with an AM/PM column).                                    |
| `open` _bindable_             | `boolean`             | `false`           | Controls the open state of the picker.                                                              |
| `hideHours`                   | `boolean`             | `false`           | Removes the hour column.                                                                            |
| `hideMinutes`                 | `boolean`             | `false`           | Removes the minute column.                                                                          |
| `hideSeconds`                 | `boolean`             | `false`           | Removes the second column.                                                                          |
| `element` _bindable_          | `HTMLButtonElement`   |                   | The DOM reference of the trigger button.                                                            |
| `wrapperRef` _bindable_       | `HTMLDivElement`      |                   | The DOM reference of the element wrapping the trigger and its input.                                |
| `wrapperAttributes`           | `HTMLAttributes`      |                   | The attributes to spread on the wrapper element.                                                    |
| `inputElement` _bindable_     | `HTMLInputElement`    |                   | The DOM reference of the underlying input element.                                                  |
| `inputProps`                  | `HTMLInputAttributes` |                   | HTML attributes for the underlying input element. Give it a `name` to submit the value with a form. |
| `popupLabel`                  | `string`              | `'Choose a time'` | The accessible name of the popup, which is announced as a dialog.                                   |
| Element Attributes (`button`) |                       |                   |                                                                                                     |

<!-- /props:TimePickerProps -->
