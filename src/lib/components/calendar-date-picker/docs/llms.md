# Calendar Date Picker

A button trigger paired with a CalendarView popup for selecting a single date.

## Usage

```svelte
<script>
	import { CalendarDatePicker } from 'fluentui-svelte';

	let value = $state(null);
</script>

<CalendarDatePicker bind:value />
```

## Component API

The `CalendarDatePicker` combines a button trigger with a `CalendarView` popup. Clicking the trigger opens the calendar, and selecting a day updates the bound `value` and closes the popup. Because it builds on `CalendarView`, calendar props such as `blackoutDates`, `minDate`, `maxDate`, `weekStart` and `headers` are forwarded straight to the popup calendar.

## Component Props

<!-- DO NOT EDIT THIS SECTION (propsmith generated) -->
<!-- props:CalendarDatePickerProps -->

| Name                                                                                             | Type                                                | Default                                                 | Description                                                                                   |
| ------------------------------------------------------------------------------------------------ | --------------------------------------------------- | ------------------------------------------------------- | --------------------------------------------------------------------------------------------- |
| `ref` _bindable_                                                                                 | `HTMLDivElement`                                    |                                                         | The DOM reference of the picker element.                                                      |
| `value` _bindable_                                                                               | `Date` &#124; `null`                                | `null`                                                  | The selected date.                                                                            |
| `format`                                                                                         | `Intl.DateTimeFormatOptions`                        | `{ year: 'numeric', month: 'numeric', day: 'numeric' }` | The options used to format the date rendered on the trigger.                                  |
| `calendarPosition`                                                                               | `Partial<ComputePositionConfig>`                    |                                                         | The floating UI configuration object of the calendar popup. Keys left out keep their default. |
| `onChange`                                                                                       | `(event: Event, value: Date` &#124; `null) => void` |                                                         | Called whenever the selected date changes.                                                    |
| `popupLabel`                                                                                     | `string`                                            | `'Choose a date'`                                       | The accessible name of the calendar popup, which is announced as a dialog.                    |
| `triggerRef` _bindable_                                                                          | `HTMLButtonElement`                                 |                                                         | The DOM reference of the trigger button.                                                      |
| `popupRef` _bindable_                                                                            | `HTMLDivElement`                                    |                                                         | The DOM reference of the calendar popup.                                                      |
| `locale`, `blackoutDates`, `headers`, `minDate`, `maxDate`, `weekStart` from `CalendarViewProps` |                                                     |                                                         |                                                                                               |
| Element Attributes (`div`)                                                                       |                                                     |                                                         |                                                                                               |

<!-- /props:CalendarDatePickerProps -->

`locale`, `blackoutDates`, `headers`, `minDate`, `maxDate` and `weekStart` are forwarded
straight to the underlying `CalendarView`. All `div` HTML attributes are forwarded to the
root element.
