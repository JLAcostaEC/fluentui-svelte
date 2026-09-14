# Date Picker

An input for selecting a date from carousel-style day, month, and year columns. The value uses the `YYYY-MM-DD` format.

## Usage

```svelte
<script>
	import { DatePicker } from 'fluentui-svelte';

	let value = $state('');
</script>

<DatePicker bind:value />
```

## Examples

### Date Format

Use the `format` prop to switch between `dd/MM/yyyy` and `MM/dd/yyyy`.

```svelte
<DatePicker format="dd/MM/yyyy" />
<DatePicker format="MM/dd/yyyy" />
```

### Hiding Columns

Use `hideDays`, `hideMonths`, or `hideYears` to hide individual selector columns (for example, a month/year-only picker).

```svelte
<DatePicker hideDays />
```

## Component Props

<!-- DO NOT EDIT THIS SECTION (propsmith generated) -->
<!-- props:DatePickerProps -->

| Name                          | Type                                 | Default           | Description                                                                                         |
| ----------------------------- | ------------------------------------ | ----------------- | --------------------------------------------------------------------------------------------------- |
| `value` _bindable_            | `string`                             | `''`              | Selected date as `YYYY-MM-DD` (matches the underlying `<input type="date">`).                       |
| `format`                      | `'MM/dd/yyyy'` &#124; `'dd/MM/yyyy'` | `'dd/MM/yyyy'`    | The order the three columns are laid out in.                                                        |
| `open` _bindable_             | `boolean`                            | `false`           | Controls the open state of the picker.                                                              |
| `hideYears`                   | `boolean`                            | `false`           | Removes the year column.                                                                            |
| `hideMonths`                  | `boolean`                            | `false`           | Removes the month column.                                                                           |
| `hideDays`                    | `boolean`                            | `false`           | Removes the day column.                                                                             |
| `minYear`                     | `number`                             | `Current - 100`   | The first year offered by the year column.                                                          |
| `maxYear`                     | `number`                             | `Current + 100`   | The last year offered by the year column.                                                           |
| `disabledDates`               | `Date[]`                             | `[]`              | Specific days (year-month-day) that cannot be selected.                                             |
| `disabledMonths`              | `Date[]`                             | `[]`              | Specific months (by month + year) that cannot be selected.                                          |
| `disabledYears`               | `Date[]`                             | `[]`              | Specific years (by year) that cannot be selected.                                                   |
| `ref` _bindable_              | `HTMLButtonElement`                  |                   | The DOM reference of the trigger button.                                                            |
| `wrapperRef` _bindable_       | `HTMLDivElement`                     |                   | The DOM reference of the element wrapping the trigger and its input.                                |
| `wrapperAttributes`           | `HTMLAttributes`                     |                   | The attributes to spread on the wrapper element.                                                    |
| `inputElement` _bindable_     | `HTMLInputElement`                   |                   | The DOM reference of the underlying input element.                                                  |
| `inputProps`                  | `HTMLInputAttributes`                |                   | HTML attributes for the underlying input element. Give it a `name` to submit the value with a form. |
| `popupLabel`                  | `string`                             | `'Choose a date'` | The accessible name of the popup, which is announced as a dialog.                                   |
| Element Attributes (`button`) |                                      |                   |                                                                                                     |

<!-- /props:DatePickerProps -->
