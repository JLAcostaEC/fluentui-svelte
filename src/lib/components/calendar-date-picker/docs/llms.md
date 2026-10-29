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

HTML attributes, including class, id and ARIA attributes, apply to the control element. Bind ref to access that control. Use wrapperAttributes and wrapperRef for the outer container.

## Component Props

<!-- DO NOT EDIT THIS SECTION (propsmith generated) -->
<!-- props:CalendarDatePickerProps -->

| Name                                                                                             | Type                                                | Default                                                 | Description                                                                                                                             |
| ------------------------------------------------------------------------------------------------ | --------------------------------------------------- | ------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------- |
| `wrapperRef` _bindable_                                                                          | `HTMLDivElement` &#124; `null`                      |                                                         | The DOM reference of the wrapper element.                                                                                               |
| `value` _bindable_                                                                               | `Date` &#124; `null`                                | `null`                                                  | The selected date.                                                                                                                      |
| `format`                                                                                         | `Intl.DateTimeFormatOptions`                        | `{ year: 'numeric', month: 'numeric', day: 'numeric' }` | The options used to format the date rendered on the trigger.                                                                            |
| `calendarPosition`                                                                               | `Partial<ComputePositionConfig>`                    |                                                         | The floating UI configuration object of the calendar popup. Keys left out keep their default.                                           |
| `onChange`                                                                                       | `(event: Event, value: Date` &#124; `null) => void` |                                                         | Called whenever the selected date changes.                                                                                              |
| `popupLabel`                                                                                     | `string`                                            | `'Choose a date'`                                       | The accessible name of the calendar popup, which is announced as a dialog.                                                              |
| `ref` _bindable_                                                                                 | `HTMLInputElement` &#124; `null`                    |                                                         | The DOM reference of the native date input that holds the value, as `YYYY-MM-DD`. The other attributes of the picker are applied to it. |
| `buttonRef` _bindable_                                                                           | `HTMLButtonElement` &#124; `null`                   |                                                         | The DOM reference of the button that opens the calendar.                                                                                |
| `buttonProps`                                                                                    | `ButtonProps`                                       |                                                         | The props to spread on the `Button` that opens the calendar.                                                                            |
| `wrapperAttributes`                                                                              | `HTMLAttributes`                                    |                                                         | The attributes to spread on the wrapper element.                                                                                        |
| `popupRef` _bindable_                                                                            | `HTMLDivElement` &#124; `null`                      |                                                         | The DOM reference of the calendar popup.                                                                                                |
| `locale`, `blackoutDates`, `headers`, `minDate`, `maxDate`, `weekStart` from `CalendarViewProps` |                                                     |                                                         |                                                                                                                                         |
| `NativeFieldAttributes<HTMLInputAttributes>`                                                     |                                                     |                                                         |                                                                                                                                         |

<!-- /props:CalendarDatePickerProps -->

`locale`, `blackoutDates`, `headers`, `minDate`, `maxDate` and `weekStart` are forwarded
straight to the underlying `CalendarView`. Button HTML attributes, including `id`, `class` and ARIA attributes, are forwarded to the
trigger. Use `wrapperAttributes` and `wrapperRef` for the root element.
