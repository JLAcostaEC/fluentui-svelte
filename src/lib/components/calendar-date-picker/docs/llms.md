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

| Name               | Type                             | Default                                                 | Description                                               |
| ------------------ | -------------------------------- | ------------------------------------------------------- | --------------------------------------------------------- |
| `ref`              | bindable `HTMLDivElement`        |                                                         | The DOM reference of the picker element.                  |
| `value`            | bindable `Date \| null`          | `null`                                                  | The selected date.                                        |
| `format`           | `Intl.DateTimeFormatOptions`     | `{ year: 'numeric', month: 'numeric', day: 'numeric' }` | The options used to format the date shown on the trigger. |
| `calendarPosition` | `Partial<ComputePositionConfig>` |                                                         | The floating UI configuration object of the popup.        |
| `onChange`         | `(event, value) => void`         |                                                         | Called whenever the selected date changes.                |

`locale`, `blackoutDates`, `headers`, `minDate`, `maxDate` and `weekStart` are forwarded
straight to the underlying `CalendarView`. All `div` HTML attributes are forwarded to the
root element.
