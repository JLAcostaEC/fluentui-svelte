# Calendar View

An inline calendar for browsing days, months, and years and selecting one or more dates.

## Usage

```svelte
<script>
	import { CalendarView } from 'fluentui-svelte';

	let value = $state(null);
</script>

<CalendarView bind:value onChange={(e, selection) => console.log(selection)} />
```

## Examples

### Multiple Selection

Set the `multiple` prop to allow selecting more than one date.

```svelte
<CalendarView multiple />
```

### Week Start

Use the `weekStart` prop to change the first day of the week (0 = Sunday, 1 = Monday).

```svelte
<CalendarView weekStart={0} />
```

## Keyboard

The grid is driven by [Tabspot](https://github.com/JLAcostaEC/tabspot): the calendar
registers its table as a grid mover and only adds the paging on top of it.

| Key                                     | Action                                                                       |
| --------------------------------------- | ---------------------------------------------------------------------------- |
| `ArrowLeft` / `ArrowRight`              | Previous / next cell, continuing into the neighbouring row.                  |
| `ArrowUp` / `ArrowDown`                 | Same column, one row up / down.                                              |
| `Home` / `End`                          | First / last cell of the current row.                                        |
| `Ctrl` + `ArrowUp`                      | Zoom out: days to months, months to years.                                   |
| `Ctrl` + `ArrowDown`                    | Zoom in: years to months.                                                    |

Moving past the edge of the visible month, year or decade turns the page and keeps
focus on the date you moved to. Dates outside `minDate`/`maxDate` cannot be focused,
and `blackoutDates` are stepped over.

Focus follows the grid. Opening the calendar as a popup (`floating`) puts focus on the
selected date, on today, or on the first date of the page, in that order; an inline
calendar never takes focus on its own. Changing the view from a cell — `Ctrl` + arrow,
or picking a month or year — carries focus to the matching cell of the new view, while
changing it from the header button leaves focus on the button.

## Component Props

| Name            | Type                              | Description                                                     |
| --------------- | --------------------------------- | --------------------------------------------------------------- |
| `value`         | bindable `Date \| Date[] \| null` | The selected date, or an array of dates when `multiple` is set. |
| `multiple`      | `boolean`                         | Allow selecting more than one date.                             |
| `view`          | `'days' \| 'months' \| 'years'`   | The initial calendar view. Default: `'days'`.                   |
| `minDate`       | `Date`                            | Earliest selectable date.                                       |
| `maxDate`       | `Date`                            | Latest selectable date.                                         |
| `locale`        | `string`                          | Locale used for formatting. Default: `'en-US'`.                 |
| `weekStart`     | `number`                          | The first day of the week (0 = Sunday). Default: `1`.           |
| `blackoutDates` | `Date[]`                          | Dates that cannot be selected.                                  |
| `headers`       | `object`                          | Header configuration for the calendar.                          |
| `floating`      | `object`                          | Floating UI configuration to render the calendar as a popup.    |
| `onChange`      | `(e: Event, selection) => void`   | Callback fired when the selection changes.                      |
| `onViewChange`  | `(view) => void`                  | Callback fired when the active view changes.                    |
| `element`       | bindable `HTMLElement`            | The DOM reference of the calendar view root element.            |
