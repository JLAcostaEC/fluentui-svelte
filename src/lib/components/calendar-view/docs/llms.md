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

## Component Props

| Name                  | Type                                    | Description                                                                    |
| --------------------- | --------------------------------------- | ------------------------------------------------------------------------------ |
| `value`               | bindable `Date \| Date[] \| null`       | The selected date, or an array of dates in `multiple` mode. Unused by `range`. |
| `selectionMode`       | `'single' \| 'multiple' \| 'range'`     | How many dates the grid hands out. Default: `'single'`.                        |
| `range`               | bindable `{ start, end: Date \| null }` | The picked range. `end` is `null` until the range is closed.                   |
| `blackoutBreaksRange` | `boolean`                               | Stop a range from spanning a blacked-out date.                                 |
| `view`                | `'days' \| 'months' \| 'years'`         | The initial calendar view. Default: `'days'`.                                  |
| `minDate`             | `Date`                                  | Earliest selectable date.                                                      |
| `maxDate`             | `Date`                                  | Latest selectable date.                                                        |
| `locale`              | `string`                                | Locale used for formatting. Default: `'en-US'`.                                |
| `weekStart`           | `number`                                | The first day of the week (0 = Sunday). Default: `1`.                          |
| `blackoutDates`       | `Date[]`                                | Dates that cannot be selected.                                                 |
| `headers`             | `object`                                | Header configuration for the calendar.                                         |
| `floating`            | `object`                                | Floating UI configuration to render the calendar as a popup.                   |
| `onChange`            | `(e: Event, selection) => void`         | Callback fired when the selection changes.                                     |
| `onRangeChange`       | `(e: Event, range) => void`             | Callback fired on every step of a range.                                       |
| `onViewChange`        | `(view) => void`                        | Callback fired when the active view changes.                                   |
| `element`             | bindable `HTMLElement`                  | The DOM reference of the calendar view root element.                           |
