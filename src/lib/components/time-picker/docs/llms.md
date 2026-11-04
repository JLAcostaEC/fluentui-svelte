# Time Picker

> Part of fluentui-svelte. Read the global guide first (setup, rules and pitfalls): https://fluentui-svelte.dev/docs/llms.md, also shipped as node_modules/fluentui-svelte/skills/fluentui-svelte/SKILL.md

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

HTML attributes, including class, id and ARIA attributes, apply to the control element. Bind ref to access that control. Use wrapperAttributes and wrapperRef for the outer container.

## Component Props

<!-- DO NOT EDIT THIS SECTION (propsmith generated) -->
<!-- props:TimePickerProps -->

| Name                                         | Type                                   | Default                                                                   | Description                                                                                                                                |
| -------------------------------------------- | -------------------------------------- | ------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------ |
| `value` _bindable_                           | `string`                               | `''`                                                                      | Selected time as 24h `HH:mm` or `HH:mm:ss` (matches `<input type="time">`).                                                                |
| `format`                                     | `12` &#124; `24`                       | `24`                                                                      | Clock format: `24` (00-23) or `12` (01-12 with an AM/PM column).                                                                           |
| `open` _bindable_                            | `boolean`                              | `false`                                                                   | Controls the open state of the picker.                                                                                                     |
| `hideHours`                                  | `boolean`                              | `false`                                                                   | Removes the hour column.                                                                                                                   |
| `hideMinutes`                                | `boolean`                              | `false`                                                                   | Removes the minute column.                                                                                                                 |
| `hideSeconds`                                | `boolean`                              | `false`                                                                   | Removes the second column.                                                                                                                 |
| `ref` _bindable_                             | `HTMLInputElement` &#124; `null`       |                                                                           | The DOM reference of the native time input that holds the value. The other attributes of the picker are applied to it.                     |
| `buttonRef` _bindable_                       | `HTMLButtonElement` &#124; `null`      |                                                                           | The DOM reference of the button that opens the picker.                                                                                     |
| `buttonAttributes`                           | `HTMLButtonAttributes`                 |                                                                           | The attributes to spread on the button that opens the picker.                                                                              |
| `wrapperRef` _bindable_                      | `HTMLDivElement` &#124; `null`         |                                                                           | The DOM reference of the element wrapping the button and the native input.                                                                 |
| `wrapperAttributes`                          | `HTMLAttributes`                       |                                                                           | The attributes to spread on the wrapper element.                                                                                           |
| `popupLabel`                                 | `string`                               | `'Choose a time'`                                                         | The accessible name of the popup, which is announced as a dialog.                                                                          |
| `columnLabels`                               | `{ hour, minute, second, … (4 keys) }` | `{ hour: 'Hour', minute: 'Minute', second: 'Second', meridiem: 'AM/PM' }` | The names of the hour, minute, second and AM/PM columns: shown on the trigger while there is no time, and given to the lists of the popup. |
| `NativeFieldAttributes<HTMLInputAttributes>` |                                        |                                                                           |                                                                                                                                            |

<!-- /props:TimePickerProps -->
