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

## Examples

### Selecting a Date

Bind a variable to the `value` prop to read the selected date. The value updates when the user picks a day and the popup closes.

```svelte
<script>
	import { CalendarDatePicker } from 'fluentui-svelte';

	let value = $state(null);
</script>

<CalendarDatePicker bind:value />
```

## Component Props

| Name | Type | Description |
| --- | --- | --- |
| `value` | bindable `Date \| null` | The selected date. Bind to it to read or set the current selection. |
| `locale` | `string` | Locale used to format the displayed date. Default: `'en-US'`. |
| `format` | `Intl.DateTimeFormatOptions` | Formatting options for the displayed date. Default: numeric year, month and day. |
| `calendarPosition` | `object` | Positioning configuration forwarded to the calendar popup. |
| `blackoutDates` | `Date[]` | Dates that cannot be selected. Forwarded to the underlying `CalendarView`. |
| `minDate` | `Date` | Earliest selectable date. Forwarded to the underlying `CalendarView`. |
| `maxDate` | `Date` | Latest selectable date. Forwarded to the underlying `CalendarView`. |
| `weekStart` | `number` | The first day of the week. Forwarded to the underlying `CalendarView`. |
| `headers` | `object` | Header configuration forwarded to the underlying `CalendarView`. |
| `onChange` | `(value: Date) => void` | Callback fired when the selected date changes. |
| `element` | bindable `HTMLDivElement` | The DOM reference of the calendar date picker root element. |
