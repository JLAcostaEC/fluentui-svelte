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

| Name | Type | Description |
| --- | --- | --- |
| `value` | bindable `string` | Selected date as `YYYY-MM-DD` (matches the underlying `<input type="date">`). |
| `format` | `'MM/dd/yyyy' \| 'dd/MM/yyyy'` | The display format of the date. Default: `'dd/MM/yyyy'`. |
| `open` | bindable `boolean` | Whether the picker flyout is open. |
| `hideYears` | `boolean` | Hide the year selector column. |
| `hideMonths` | `boolean` | Hide the month selector column. |
| `hideDays` | `boolean` | Hide the day selector column. |
| `minYear` | `number` | Earliest selectable year. Default: current year − 100. |
| `maxYear` | `number` | Latest selectable year. Default: current year. |
| `disabledDates` | `Date[]` | Specific days (year-month-day) that cannot be selected. |
| `disabledMonths` | `Date[]` | Specific months (by month + year) that cannot be selected. |
| `disabledYears` | `Date[]` | Specific years (by year) that cannot be selected. |
| `element` | bindable `HTMLElement` | The DOM reference of the date picker root element. |
| `inputElement` | bindable `HTMLInputElement` | The DOM reference of the underlying input element. |
