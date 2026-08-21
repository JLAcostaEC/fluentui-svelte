# Calendar View

An inline calendar for browsing days, months, and years and selecting one date, several
dates, or a range.

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

Set `selectionMode` to `multiple` to allow selecting more than one date. `value` then
holds an array.

```svelte
<CalendarView selectionMode="multiple" />
```

### Range Selection

Set `selectionMode` to `range` to pick a start and an end. The range has its own binding
rather than sharing `value`, and `end` stays `null` between the two clicks so you can
tell a half-built range from a range of a single day.

```svelte
<script>
	let range = $state({ start: null, end: null });
</script>

<CalendarView selectionMode="range" bind:range />
```

A range spans blacked-out dates by default, since a blackout usually marks a day that
cannot be _picked_ rather than one that breaks the period. Set `blackoutBreaksRange`
for the range to stop at the first blackout.

```svelte
<CalendarView selectionMode="range" bind:range {blackoutDates} blackoutBreaksRange />
```

### Week Start

Use the `weekStart` prop to change the first day of the week (0 = Sunday, 1 = Monday).

```svelte
<CalendarView weekStart={0} />
```

## Keyboard

The grid is driven by [Tabspot](https://github.com/JLAcostaEC/tabspot): the calendar
registers its table as a grid mover and only adds the paging on top of it.

| Key                        | Action                                                      |
| -------------------------- | ----------------------------------------------------------- |
| `ArrowLeft` / `ArrowRight` | Previous / next cell, continuing into the neighbouring row. |
| `ArrowUp` / `ArrowDown`    | Same column, one row up / down.                             |
| `Home` / `End`             | First / last cell of the current row.                       |
| `Ctrl` + `ArrowUp`         | Zoom out: days to months, months to years.                  |
| `Ctrl` + `ArrowDown`       | Zoom in: years to months.                                   |
| `Delete` / `Backspace`     | Clear the range. Range selection only.                      |

Moving past the edge of the visible month, year or decade turns the page and keeps
focus on the date you moved to. Dates outside `minDate`/`maxDate` cannot be focused,
and `blackoutDates` are stepped over.

Focus follows the grid. Opening the calendar as a popup (`floating`) puts focus on the
selected date, on today, or on the first date of the page, in that order; an inline
calendar never takes focus on its own. Changing the view from a cell — `Ctrl` + arrow,
or picking a month or year — carries focus to the matching cell of the new view, while
changing it from the header button leaves focus on the button.

## CalendarView Props

| Name                  | Type                                                  | Default                      | Description                                                                    |
| --------------------- | ----------------------------------------------------- | ---------------------------- | ------------------------------------------------------------------------------ |
| `ref`                 | bindable `HTMLDivElement`                             |                              | The DOM reference of the calendar element.                                     |
| `value`               | bindable `Date \| Date[] \| null`                     | `null`                       | The selected date, or an array of dates in `multiple` mode. Unused by `range`. |
| `selectionMode`       | `'single' \| 'multiple' \| 'range'`                   | `'single'`                   | How many dates the grid hands out, and in what shape.                          |
| `range`               | bindable `{ start: Date \| null; end: Date \| null }` | `{ start: null, end: null }` | The picked range. `end` is `null` until the range is closed.                   |
| `blackoutBreaksRange` | `boolean`                                             | `false`                      | Stop a range from spanning a blacked-out date.                                 |
| `blackoutDates`       | `Date[]`                                              |                              | Dates that are rendered but cannot be selected.                                |
| `headers`             | `boolean`                                             |                              | Labels the first cell of a month or a year with its name.                      |
| `minDate`             | `Date`                                                |                              | The earliest selectable date.                                                  |
| `maxDate`             | `Date`                                                |                              | The latest selectable date.                                                    |
| `view`                | `'days' \| 'months' \| 'years'`                       | `'days'`                     | The calendar page the view opens on.                                           |
| `locale`              | `string`                                              | `'en-US'`                    | The locale used to format weekday and month names.                             |
| `weekStart`           | `number`                                              | `1`                          | The first day of the week, where 0 is Sunday.                                  |
| `floating`            | `CalendarViewFloating`                                |                              | Renders the calendar as a popup anchored to a reference element.               |
| `onChange`            | `(event, value) => void`                              |                              | Called whenever the selection changes. Not called in `range` mode.             |
| `onRangeChange`       | `(event, range) => void`                              |                              | Fired on every step of a range, including the one that leaves `end` null.      |
| `onViewChange`        | `(event, view) => void`                               |                              | Called whenever the active calendar page changes.                              |

All `div` HTML attributes are forwarded to the root element.

## CalendarViewItem Props

| Name               | Type                            | Default | Description                                                                       |
| ------------------ | ------------------------------- | ------- | --------------------------------------------------------------------------------- |
| `selected`         | `boolean`                       |         | Renders the cell as the selected one.                                             |
| `disabled`         | `boolean`                       |         | Disables the user interaction.                                                    |
| `current`          | `boolean`                       |         | Marks the cell as the current date.                                               |
| `outOfRange`       | `boolean`                       |         | Renders the cell as belonging to a neighbouring page.                             |
| `blackout`         | `boolean`                       |         | Renders the cell as blacked out, so it reads as unavailable rather than disabled. |
| `rangePosition`    | `'start' \| 'between' \| 'end'` |         | Set on the days a range covers, which paints the band behind them.                |
| `header`           | `string`                        |         | A small label rendered above the cell content.                                    |
| `variant`          | `'day' \| 'monthYear'`          | `'day'` | Which shape the cell takes: a circle for a day, a rounded rectangle otherwise.    |
| `children`         | `Snippet`                       |         | The content of the cell.                                                          |
| `buttonAttributes` | `HTMLButtonAttributes`          |         | The attributes to spread on the inner button element.                             |

All `div` HTML attributes are forwarded to the cell element.
