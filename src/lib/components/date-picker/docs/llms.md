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

HTML attributes, including class, id and ARIA attributes, apply to the control element. Bind ref to access that control. Use wrapperAttributes and wrapperRef for the outer container.

## Component Props

<!-- DO NOT EDIT THIS SECTION (propsmith generated) -->
<!-- props:DatePickerProps -->

| Name                                         | Type                                              | Default                                        | Description                                                                                                                     |
| -------------------------------------------- | ------------------------------------------------- | ---------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------- |
| `value` _bindable_                           | `string`                                          | `''`                                           | Selected date as `YYYY-MM-DD` (matches the underlying `<input type="date">`).                                                   |
| `format`                                     | `'MM/dd/yyyy'` &#124; `'dd/MM/yyyy'`              | `'dd/MM/yyyy'`                                 | The order the three columns are laid out in.                                                                                    |
| `open` _bindable_                            | `boolean`                                         | `false`                                        | Controls the open state of the picker.                                                                                          |
| `hideYears`                                  | `boolean`                                         | `false`                                        | Removes the year column.                                                                                                        |
| `hideMonths`                                 | `boolean`                                         | `false`                                        | Removes the month column.                                                                                                       |
| `hideDays`                                   | `boolean`                                         | `false`                                        | Removes the day column.                                                                                                         |
| `minYear`                                    | `number`                                          | `Current - 100`                                | The first year offered by the year column. Unless `min` is given, the native input accepts no earlier date.                     |
| `maxYear`                                    | `number`                                          | `Current + 100`                                | The last year offered by the year column. Unless `max` is given, the native input accepts no later date.                        |
| `disabledDates`                              | `Date[]`                                          | `[]`                                           | Specific days (year-month-day) that cannot be selected.                                                                         |
| `disabledMonths`                             | `Date[]`                                          | `[]`                                           | Specific months (by month + year) that cannot be selected.                                                                      |
| `disabledYears`                              | `Date[]`                                          | `[]`                                           | Specific years (by year) that cannot be selected.                                                                               |
| `ref` _bindable_                             | `HTMLInputElement` &#124; `null`                  |                                                | The DOM reference of the native date input that holds the value. The other attributes of the picker are applied to it.          |
| `buttonRef` _bindable_                       | `HTMLButtonElement` &#124; `null`                 |                                                | The DOM reference of the button that opens the picker.                                                                          |
| `buttonAttributes`                           | `HTMLButtonAttributes`                            |                                                | The attributes to spread on the button that opens the picker.                                                                   |
| `wrapperRef` _bindable_                      | `HTMLDivElement` &#124; `null`                    |                                                | The DOM reference of the element wrapping the button and the native input.                                                      |
| `wrapperAttributes`                          | `HTMLAttributes`                                  |                                                | The attributes to spread on the wrapper element.                                                                                |
| `popupLabel`                                 | `string`                                          | `'Choose a date'`                              | The accessible name of the popup, which is announced as a dialog.                                                               |
| `columnLabels`                               | `{ month?: string; day?: string; year?: string }` | `{ month: 'Month', day: 'Day', year: 'Year' }` | The names of the month, day and year columns: shown on the trigger while there is no date, and given to the lists of the popup. |
| `NativeFieldAttributes<HTMLInputAttributes>` |                                                   |                                                |                                                                                                                                 |

<!-- /props:DatePickerProps -->
