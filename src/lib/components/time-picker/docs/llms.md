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

| Name | Type | Description |
| --- | --- | --- |
| `value` | bindable `string` | Selected time as 24h `HH:mm` or `HH:mm:ss` (matches `<input type="time">`). |
| `format` | `12 \| 24` | Clock format: `24` (00–23) or `12` (01–12 with an AM/PM column). Default: `24`. |
| `open` | bindable `boolean` | Whether the picker flyout is open. |
| `hideHours` | `boolean` | Hide the hours column. |
| `hideMinutes` | `boolean` | Hide the minutes column. |
| `hideSeconds` | `boolean` | Hide the seconds column. |
| `element` | bindable `HTMLElement` | The DOM reference of the time picker root element. |
| `inputElement` | bindable `HTMLInputElement` | The DOM reference of the underlying input element. |
