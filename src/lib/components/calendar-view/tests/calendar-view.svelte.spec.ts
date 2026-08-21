import { page, userEvent } from 'vitest/browser';
import { describe, expect, it, vi } from 'vitest';
import { render } from 'vitest-browser-svelte';
import CalendarViewTestWrapper from './CalendarViewTestWrapper.svelte';

/**
 * Every test below pins the calendar to January 2026 (`value` seeds the page) and
 * `weekStart: 1` (Monday), which produces a stable 42 cell grid:
 *
 *  index | date
 *  ------+-------------------------------
 *   0-2  | Dec 29 - Dec 31, 2025 (leading, out of month)
 *   3-33 | Jan 1 - Jan 31, 2026
 *  34-41 | Feb 1 - Feb 8, 2026 (trailing, out of month)
 *
 * Rows are 7 cells wide, so row N spans indices N*7 .. N*7+6.
 */
const JANUARY_2026 = new Date(2026, 0, 15);

/** Index of a January 2026 day within the rendered grid. */
const jan = (day: number) => 2 + day;

/** Cells of the live page. The outgoing page keeps rendering until its transition ends. */
const cells = () => page.selector('[data-calendar-page]:not([inert]) button');

const cell = (index: number) => cells().nth(index);

function focusCell(index: number) {
	const buttons = document.querySelectorAll<HTMLButtonElement>('[data-calendar-page]:not([inert]) button');
	buttons[index].focus();
}

/** Cells of the live page as gridcells, which is where the range band is painted. */
const gridCell = (index: number) => page.selector('[data-calendar-page]:not([inert]) [role="gridcell"]').nth(index);

const banded = (position?: string) =>
	document.querySelectorAll(`[data-calendar-page]:not([inert]) .${position ? `range-${position}` : 'in-range'}`);

const periodLabel = () => page.selector('.fs-calendar-controls .period-selector');

const clearButton = () => page.getByRole('button', { name: 'Clear the selected dates' });

const liveRegion = () => page.selector('.fs-calendar-live-region');

describe('CalendarView rendering', () => {
	it('renders a 42 cell day grid', async () => {
		render(CalendarViewTestWrapper, { value: JANUARY_2026 });
		await expect.element(cell(41)).toBeInTheDocument();
		expect(document.querySelectorAll('[data-calendar-page]:not([inert]) button')).toHaveLength(42);
	});

	it('opens on the month of the current value', async () => {
		render(CalendarViewTestWrapper, { value: JANUARY_2026 });
		await expect.element(periodLabel()).toHaveTextContent('January 2026');
	});

	it('renders seven weekday headers', async () => {
		render(CalendarViewTestWrapper, { value: JANUARY_2026 });
		await expect.element(page.selector('.fs-calendar-view-header')).toBeInTheDocument();
		expect(document.querySelectorAll('.calendar-header-item')).toHaveLength(7);
	});

	it('lays the month out against the configured week start', async () => {
		render(CalendarViewTestWrapper, { value: JANUARY_2026 });
		// Jan 1 2026 is a Thursday, so with weekStart 1 it sits at index 3.
		await expect.element(cell(jan(1))).toHaveTextContent('1');
		await expect.element(cell(0)).toHaveTextContent('29');
	});

	it('marks days outside the current month as out of range', async () => {
		render(CalendarViewTestWrapper, { value: JANUARY_2026 });
		await expect.element(cell(0)).toHaveClass(/out-of-range/);
		await expect.element(cell(jan(1))).not.toHaveClass(/out-of-range/);
	});

	it('disables days before minDate', async () => {
		render(CalendarViewTestWrapper, { value: JANUARY_2026, minDate: new Date(2026, 0, 10) });
		await expect.element(cell(jan(9))).toBeDisabled();
		await expect.element(cell(jan(10))).not.toBeDisabled();
	});
});

describe('CalendarView day navigation', () => {
	it('moves focus to the next day on ArrowRight', async () => {
		render(CalendarViewTestWrapper, { value: JANUARY_2026 });
		await expect.element(cell(jan(1))).toBeInTheDocument();

		focusCell(jan(1));
		await userEvent.keyboard('{ArrowRight}');

		await expect.element(cell(jan(2))).toHaveFocus();
	});

	it('moves focus to the previous day on ArrowLeft', async () => {
		render(CalendarViewTestWrapper, { value: JANUARY_2026 });
		await expect.element(cell(jan(8))).toBeInTheDocument();

		focusCell(jan(8));
		await userEvent.keyboard('{ArrowLeft}');

		await expect.element(cell(jan(7))).toHaveFocus();
	});

	it('moves focus a week forward on ArrowDown', async () => {
		render(CalendarViewTestWrapper, { value: JANUARY_2026 });
		await expect.element(cell(jan(8))).toBeInTheDocument();

		focusCell(jan(8));
		await userEvent.keyboard('{ArrowDown}');

		await expect.element(cell(jan(15))).toHaveFocus();
	});

	it('moves focus a week back on ArrowUp', async () => {
		render(CalendarViewTestWrapper, { value: JANUARY_2026 });
		await expect.element(cell(jan(15))).toBeInTheDocument();

		focusCell(jan(15));
		await userEvent.keyboard('{ArrowUp}');

		await expect.element(cell(jan(8))).toHaveFocus();
	});

	it('continues into the next week when ArrowRight leaves the last column', async () => {
		render(CalendarViewTestWrapper, { value: JANUARY_2026 });
		await expect.element(cell(jan(4))).toBeInTheDocument();

		// Jan 4 is the last cell of the first row.
		focusCell(jan(4));
		await userEvent.keyboard('{ArrowRight}');

		await expect.element(cell(jan(5))).toHaveFocus();
	});

	it('continues into the previous week when ArrowLeft leaves the first column', async () => {
		render(CalendarViewTestWrapper, { value: JANUARY_2026 });
		await expect.element(cell(jan(5))).toBeInTheDocument();

		focusCell(jan(5));
		await userEvent.keyboard('{ArrowLeft}');

		await expect.element(cell(jan(4))).toHaveFocus();
	});

	it('skips a blackout date', async () => {
		render(CalendarViewTestWrapper, {
			value: JANUARY_2026,
			blackoutDates: [new Date(2026, 0, 14)]
		});
		await expect.element(cell(jan(13))).toBeInTheDocument();

		focusCell(jan(13));
		await userEvent.keyboard('{ArrowRight}');

		await expect.element(cell(jan(15))).toHaveFocus();
	});

	it('does not move onto a day before minDate', async () => {
		render(CalendarViewTestWrapper, { value: JANUARY_2026, minDate: new Date(2026, 0, 10) });
		await expect.element(cell(jan(10))).toBeInTheDocument();

		focusCell(jan(10));
		await userEvent.keyboard('{ArrowLeft}');

		await expect.element(cell(jan(10))).toHaveFocus();
	});

	it('does not move onto a day after maxDate', async () => {
		render(CalendarViewTestWrapper, { value: JANUARY_2026, maxDate: new Date(2026, 0, 20) });
		await expect.element(cell(jan(20))).toBeInTheDocument();

		focusCell(jan(20));
		await userEvent.keyboard('{ArrowRight}');

		await expect.element(cell(jan(20))).toHaveFocus();
	});
});

describe('CalendarView day paging', () => {
	it('pages forward when ArrowRight leaves the month', async () => {
		render(CalendarViewTestWrapper, { value: JANUARY_2026 });
		await expect.element(cell(jan(31))).toBeInTheDocument();

		focusCell(jan(31));
		await userEvent.keyboard('{ArrowRight}');

		await expect.element(periodLabel()).toHaveTextContent('February 2026');
		// Feb 1 2026 is a Sunday, so with weekStart 1 it sits at index 6.
		await expect.element(cell(6)).toHaveFocus();
		await expect.element(cell(6)).toHaveTextContent('1');
	});

	it('pages back when ArrowLeft leaves the month', async () => {
		render(CalendarViewTestWrapper, { value: JANUARY_2026 });
		await expect.element(cell(jan(1))).toBeInTheDocument();

		focusCell(jan(1));
		await userEvent.keyboard('{ArrowLeft}');

		await expect.element(periodLabel()).toHaveTextContent('December 2025');
		// Dec 1 2025 is a Monday, so the grid starts on it and Dec 31 sits at index 30.
		await expect.element(cell(30)).toHaveFocus();
		await expect.element(cell(30)).toHaveTextContent('31');
	});

	it('pages back when ArrowUp leaves the month', async () => {
		render(CalendarViewTestWrapper, { value: JANUARY_2026 });
		await expect.element(cell(jan(1))).toBeInTheDocument();

		focusCell(jan(1));
		await userEvent.keyboard('{ArrowUp}');

		await expect.element(periodLabel()).toHaveTextContent('December 2025');
		await expect.element(cell(24)).toHaveFocus();
		await expect.element(cell(24)).toHaveTextContent('25');
	});

	it('pages forward when ArrowDown leaves the month', async () => {
		render(CalendarViewTestWrapper, { value: JANUARY_2026 });
		await expect.element(cell(jan(26))).toBeInTheDocument();

		focusCell(jan(26));
		await userEvent.keyboard('{ArrowDown}');

		await expect.element(periodLabel()).toHaveTextContent('February 2026');
		await expect.element(cell(7)).toHaveFocus();
		await expect.element(cell(7)).toHaveTextContent('2');
	});

	it('pages with the header navigation buttons', async () => {
		render(CalendarViewTestWrapper, { value: JANUARY_2026 });
		await expect.element(periodLabel()).toHaveTextContent('January 2026');

		await page.getByRole('button', { name: 'Next month' }).click();
		await expect.element(periodLabel()).toHaveTextContent('February 2026');

		await page.getByRole('button', { name: 'Previous month' }).click();
		await expect.element(periodLabel()).toHaveTextContent('January 2026');
	});
});

describe('CalendarView grid edges', () => {
	it('pages back when ArrowLeft leaves a grid that opens on the first of the month', async () => {
		// Dec 1 2025 is a Monday, so the grid has no leading days and its first cell
		// is the first of the month — the only case where the row-major sequence runs
		// out at index 0.
		render(CalendarViewTestWrapper, { value: new Date(2025, 11, 1) });
		await expect.element(periodLabel()).toHaveTextContent('December 2025');

		focusCell(0);
		await userEvent.keyboard('{ArrowLeft}');

		await expect.element(periodLabel()).toHaveTextContent('November 2025');
		// Nov 1 2025 is a Saturday, so Nov 30 sits at index 34.
		await expect.element(cell(34)).toHaveFocus();
		await expect.element(cell(34)).toHaveTextContent('30');
	});

	it('pages back when ArrowLeft leaves the month grid', async () => {
		render(CalendarViewTestWrapper, { value: JANUARY_2026, view: 'months' });
		await expect.element(cell(0)).toBeInTheDocument();

		focusCell(0);
		await userEvent.keyboard('{ArrowLeft}');

		await expect.element(periodLabel()).toHaveTextContent('2025');
		await expect.element(cell(11)).toHaveFocus();
		await expect.element(cell(11)).toHaveTextContent('Dec');
	});

	it('pages forward when ArrowDown leaves a grid whose last row is still in the month', async () => {
		// August 2026 runs to the sixth row, so Aug 31 has no row below it to clamp to.
		render(CalendarViewTestWrapper, { value: new Date(2026, 7, 31) });
		await expect.element(periodLabel()).toHaveTextContent('August 2026');

		focusCell(35);
		await userEvent.keyboard('{ArrowDown}');

		await expect.element(periodLabel()).toHaveTextContent('September 2026');
		// Sep 1 2026 is a Tuesday, so Sep 7 sits at index 7.
		await expect.element(cell(7)).toHaveFocus();
		await expect.element(cell(7)).toHaveTextContent('7');
	});

	it('pages back a decade when ArrowLeft leaves the year grid', async () => {
		render(CalendarViewTestWrapper, { value: JANUARY_2026, view: 'years' });
		await expect.element(cell(0)).toBeInTheDocument();

		focusCell(0);
		await userEvent.keyboard('{ArrowLeft}');

		await expect.element(periodLabel()).toHaveTextContent('2010');
		await expect.element(cell(7)).toHaveFocus();
		await expect.element(cell(7)).toHaveTextContent('2017');
	});

	it('skips a blackout date across a page boundary', async () => {
		render(CalendarViewTestWrapper, {
			value: JANUARY_2026,
			blackoutDates: [new Date(2026, 1, 1)]
		});
		await expect.element(cell(jan(31))).toBeInTheDocument();

		focusCell(jan(31));
		await userEvent.keyboard('{ArrowRight}');

		await expect.element(periodLabel()).toHaveTextContent('February 2026');
		await expect.element(cell(7)).toHaveFocus();
		await expect.element(cell(7)).toHaveTextContent('2');
	});

	it('selects a trailing day on click without paging', async () => {
		render(CalendarViewTestWrapper, { value: JANUARY_2026 });
		await expect.element(cell(34)).toBeInTheDocument();

		// Index 34 is Feb 1, rendered by the January page as an out of range day.
		await cell(34).click();

		await expect.element(periodLabel()).toHaveTextContent('January 2026');
		await expect.element(cell(34)).toHaveClass(/selected/);
	});
});

describe('CalendarView tabspot integration', () => {
	it('drives the grid through a tabspot root', async () => {
		render(CalendarViewTestWrapper, { value: JANUARY_2026 });
		await expect.element(page.selector('[data-calendar-grid]')).toHaveAttribute('data-tabspot');
	});

	it('moves to the start and end of the week with Home and End', async () => {
		render(CalendarViewTestWrapper, { value: JANUARY_2026 });
		await expect.element(cell(jan(15))).toBeInTheDocument();

		// Jan 15 sits on the row spanning Jan 12 - Jan 18.
		focusCell(jan(15));
		await userEvent.keyboard('{Home}');
		await expect.element(cell(jan(12))).toHaveFocus();

		await userEvent.keyboard('{End}');
		await expect.element(cell(jan(18))).toHaveFocus();
	});
});

describe('CalendarView focus', () => {
	it('focuses the selected date when it opens as a popup', async () => {
		render(CalendarViewTestWrapper, { value: JANUARY_2026, popup: true });
		await expect.element(cell(jan(15))).toHaveFocus();
	});

	it("falls back to today's cell when there is no selection", async () => {
		render(CalendarViewTestWrapper, { value: null, popup: true });
		await expect.element(page.selector('[data-calendar-page]:not([inert]) button.current')).toHaveFocus();
	});

	it('does not steal focus when rendered inline', async () => {
		render(CalendarViewTestWrapper, { value: JANUARY_2026 });
		await expect.element(cell(jan(15))).toBeInTheDocument();
		expect(document.activeElement?.closest('.fs-calendar-view')).toBeNull();
	});

	it('carries focus into the month view on Ctrl+ArrowUp', async () => {
		render(CalendarViewTestWrapper, { value: JANUARY_2026 });
		await expect.element(cell(jan(15))).toBeInTheDocument();

		focusCell(jan(15));
		await userEvent.keyboard('{Control>}{ArrowUp}{/Control}');

		await expect.element(page.selector('.fs-calendar-view-months')).toBeInTheDocument();
		await expect.element(cell(0)).toHaveFocus();
		await expect.element(cell(0)).toHaveTextContent('Jan');
	});

	it('carries focus into the year view on Ctrl+ArrowUp', async () => {
		render(CalendarViewTestWrapper, { value: JANUARY_2026, view: 'months' });
		await expect.element(cell(0)).toBeInTheDocument();

		focusCell(0);
		await userEvent.keyboard('{Control>}{ArrowUp}{/Control}');

		// The 2020s grid opens on 2018, so 2026 sits at index 8.
		await expect.element(cell(8)).toHaveFocus();
		await expect.element(cell(8)).toHaveTextContent('2026');
	});

	it('carries focus back into the month view on Ctrl+ArrowDown', async () => {
		render(CalendarViewTestWrapper, { value: JANUARY_2026, view: 'years' });
		await expect.element(cell(8)).toBeInTheDocument();

		focusCell(8);
		await userEvent.keyboard('{Control>}{ArrowDown}{/Control}');

		await expect.element(page.selector('.fs-calendar-view-months')).toBeInTheDocument();
		await expect.element(cell(0)).toHaveFocus();
		await expect.element(cell(0)).toHaveTextContent('Jan');
	});

	it('carries focus into the day view when a month is picked with the keyboard', async () => {
		render(CalendarViewTestWrapper, { value: JANUARY_2026, view: 'months' });
		await expect.element(cell(2)).toBeInTheDocument();

		focusCell(2);
		await userEvent.keyboard('{Enter}');

		await expect.element(periodLabel()).toHaveTextContent('March 2026');
		// Mar 1 2026 is a Sunday, so it sits at index 6.
		await expect.element(cell(6)).toHaveFocus();
		await expect.element(cell(6)).toHaveTextContent('1');
	});

	it('leaves focus on the period button when the view is changed from the header', async () => {
		render(CalendarViewTestWrapper, { value: JANUARY_2026 });

		await periodLabel().click();

		await expect.element(page.selector('.fs-calendar-view-months')).toBeInTheDocument();
		expect(document.activeElement?.closest('[data-calendar-page]')).toBeNull();
	});
});

describe('CalendarView selection', () => {
	it('selects the clicked day', async () => {
		const onChange = vi.fn();
		render(CalendarViewTestWrapper, { value: null, onChange });

		await cell(0).click();

		expect(onChange).toHaveBeenCalledTimes(1);
		expect(onChange.mock.calls[0][1]).toBeInstanceOf(Date);
	});

	it('marks the current value as selected', async () => {
		render(CalendarViewTestWrapper, { value: JANUARY_2026 });
		await expect.element(cell(jan(15))).toHaveClass(/selected/);
	});

	it('collects several days in multiple mode', async () => {
		const onChange = vi.fn();
		render(CalendarViewTestWrapper, { value: JANUARY_2026, selectionMode: 'multiple', onChange });

		await cell(jan(20)).click();
		await cell(jan(21)).click();

		await expect.element(cell(jan(20))).toHaveClass(/selected/);
		await expect.element(cell(jan(21))).toHaveClass(/selected/);
		expect(onChange).toHaveBeenCalledTimes(2);
	});
});

/**
 * `value` still seeds the page in range mode, and nothing else: the range has its own
 * binding, so passing a date here pins the grid to January 2026 without selecting it.
 */
const RANGE = { selectionMode: 'range' as const, value: JANUARY_2026 };

describe('CalendarView range selection', () => {
	const inJanuary = RANGE;

	it('opens a range on the first click and waits for the end', async () => {
		const onRangeChange = vi.fn();
		render(CalendarViewTestWrapper, { ...inJanuary, onRangeChange });

		await cell(jan(20)).click();

		expect(onRangeChange).toHaveBeenCalledTimes(1);
		expect(onRangeChange.mock.calls[0][1].start).toEqual(new Date(2026, 0, 20));
		expect(onRangeChange.mock.calls[0][1].end).toBeNull();
	});

	it('closes the range on the second click', async () => {
		const onRangeChange = vi.fn();
		render(CalendarViewTestWrapper, { ...inJanuary, onRangeChange });

		await cell(jan(20)).click();
		await cell(jan(23)).click();

		expect(onRangeChange).toHaveBeenCalledTimes(2);
		expect(onRangeChange.mock.calls[1][1].start).toEqual(new Date(2026, 0, 20));
		expect(onRangeChange.mock.calls[1][1].end).toEqual(new Date(2026, 0, 23));
	});

	it('closes a range of one day when the start is picked twice', async () => {
		const onRangeChange = vi.fn();
		render(CalendarViewTestWrapper, { ...inJanuary, onRangeChange });

		await cell(jan(20)).click();
		await cell(jan(20)).click();

		expect(onRangeChange.mock.calls[1][1].start).toEqual(new Date(2026, 0, 20));
		expect(onRangeChange.mock.calls[1][1].end).toEqual(new Date(2026, 0, 20));
	});

	it('starts over on the click after a finished range', async () => {
		const onRangeChange = vi.fn();
		render(CalendarViewTestWrapper, { ...inJanuary, onRangeChange });

		await cell(jan(20)).click();
		await cell(jan(23)).click();
		await cell(jan(26)).click();

		expect(onRangeChange.mock.calls[2][1].start).toEqual(new Date(2026, 0, 26));
		expect(onRangeChange.mock.calls[2][1].end).toBeNull();
	});

	it('restarts rather than inverting when the second click lands before the start', async () => {
		const onRangeChange = vi.fn();
		render(CalendarViewTestWrapper, { ...inJanuary, onRangeChange });

		await cell(jan(20)).click();
		await cell(jan(12)).click();

		expect(onRangeChange.mock.calls[1][1].start).toEqual(new Date(2026, 0, 12));
		expect(onRangeChange.mock.calls[1][1].end).toBeNull();
	});

	it('paints a band across the days the range covers', async () => {
		render(CalendarViewTestWrapper, inJanuary);

		await cell(jan(20)).click();
		await cell(jan(23)).click();

		await expect.element(gridCell(jan(21))).toHaveClass(/range-between/);
		expect(banded()).toHaveLength(4);
		expect(banded('start')).toHaveLength(1);
		expect(banded('end')).toHaveLength(1);
	});

	it('paints no band for a range of a single day', async () => {
		render(CalendarViewTestWrapper, inJanuary);

		await cell(jan(20)).click();
		await cell(jan(20)).click();

		await expect.element(cell(jan(20))).toHaveClass(/selected/);
		expect(banded()).toHaveLength(0);
	});

	it('previews the range under the pointer before it is closed', async () => {
		render(CalendarViewTestWrapper, inJanuary);

		await cell(jan(20)).click();
		await cell(jan(23)).hover();

		await expect.element(gridCell(jan(22))).toHaveClass(/range-between/);
		expect(banded()).toHaveLength(4);
	});

	it('previews nothing while the pointer is before the start', async () => {
		render(CalendarViewTestWrapper, inJanuary);

		await cell(jan(20)).click();
		await cell(jan(12)).hover();

		expect(banded()).toHaveLength(0);
	});

	it('previews the range as the keyboard moves through it', async () => {
		render(CalendarViewTestWrapper, inJanuary);
		await expect.element(cell(jan(20))).toBeInTheDocument();

		// Park the pointer outside the grid: where both are offering a day, the pointer wins.
		await periodLabel().hover();

		focusCell(jan(20));
		await userEvent.keyboard('{Enter}');
		await userEvent.keyboard('{ArrowRight}{ArrowRight}');

		await expect.element(cell(jan(22))).toHaveFocus();
		await expect.element(gridCell(jan(22))).toHaveClass(/range-end/);
		expect(banded()).toHaveLength(3);
	});

	it('spans a blacked-out day by default', async () => {
		render(CalendarViewTestWrapper, { ...inJanuary, blackoutDates: [new Date(2026, 0, 22)] });

		await cell(jan(20)).click();
		await cell(jan(25)).click();

		await expect.element(cell(jan(22))).toHaveClass(/blackout/);
		await expect.element(gridCell(jan(22))).toHaveClass(/range-between/);
		expect(banded()).toHaveLength(6);
	});

	it('starts a new range instead of spanning a blackout when blackoutBreaksRange is set', async () => {
		const onRangeChange = vi.fn();
		render(CalendarViewTestWrapper, {
			...inJanuary,
			blackoutBreaksRange: true,
			blackoutDates: [new Date(2026, 0, 22)],
			onRangeChange
		});

		await cell(jan(20)).click();
		await cell(jan(25)).click();

		expect(onRangeChange.mock.calls[1][1].start).toEqual(new Date(2026, 0, 25));
		expect(onRangeChange.mock.calls[1][1].end).toBeNull();
		expect(banded()).toHaveLength(0);
	});

	it('still closes a range that stops short of the blackout', async () => {
		const onRangeChange = vi.fn();
		render(CalendarViewTestWrapper, {
			...inJanuary,
			blackoutBreaksRange: true,
			blackoutDates: [new Date(2026, 0, 22)],
			onRangeChange
		});

		await cell(jan(20)).click();
		await cell(jan(21)).click();

		expect(onRangeChange.mock.calls[1][1].end).toEqual(new Date(2026, 0, 21));
	});
});

describe('CalendarView clearing a range', () => {
	const inJanuary = RANGE;

	it('offers no clear control outside range mode', async () => {
		render(CalendarViewTestWrapper, { value: JANUARY_2026 });
		await expect.element(cell(jan(15))).toBeInTheDocument();

		expect(document.querySelectorAll('[aria-label="Clear the selected dates"]')).toHaveLength(0);
	});

	it('disables the clear control while there is nothing to clear', async () => {
		render(CalendarViewTestWrapper, inJanuary);
		await expect.element(clearButton()).toBeDisabled();
	});

	it('empties the range from the clear control', async () => {
		const onRangeChange = vi.fn();
		render(CalendarViewTestWrapper, { ...inJanuary, onRangeChange });

		await cell(jan(20)).click();
		await cell(jan(23)).click();
		await clearButton().click();

		expect(onRangeChange.mock.calls[2][1]).toEqual({ start: null, end: null });
		expect(banded()).toHaveLength(0);
		await expect.element(clearButton()).toBeDisabled();
	});

	it('empties the range with Delete from inside the grid', async () => {
		const onRangeChange = vi.fn();
		render(CalendarViewTestWrapper, { ...inJanuary, onRangeChange });

		await cell(jan(20)).click();
		await cell(jan(23)).click();

		focusCell(jan(23));
		await userEvent.keyboard('{Delete}');

		expect(onRangeChange.mock.calls[2][1]).toEqual({ start: null, end: null });
	});
});

describe('CalendarView range accessibility', () => {
	const inJanuary = RANGE;

	it('marks every day of the range as selected', async () => {
		render(CalendarViewTestWrapper, inJanuary);

		await cell(jan(20)).click();
		await cell(jan(23)).click();

		expect(document.querySelectorAll('[role="gridcell"][aria-selected="true"]')).toHaveLength(4);
	});

	it('advertises the grid as multiselectable', async () => {
		render(CalendarViewTestWrapper, inJanuary);
		await expect.element(page.selector('[data-calendar-page]')).toHaveAttribute('aria-multiselectable', 'true');
	});

	it('announces each step of the range', async () => {
		render(CalendarViewTestWrapper, inJanuary);

		await expect.element(liveRegion()).toHaveAttribute('aria-live', 'polite');

		await cell(jan(20)).click();
		await expect.element(liveRegion()).toHaveTextContent('Choose the end date');

		await cell(jan(23)).click();
		await expect.element(liveRegion()).toHaveTextContent('4 days');

		await clearButton().click();
		await expect.element(liveRegion()).toHaveTextContent('Date range cleared');
	});

	it('marks every month the range passes through', async () => {
		render(CalendarViewTestWrapper, inJanuary);

		await cell(jan(20)).click();
		// Index 41 is Feb 8 2026, the last trailing day of the January page.
		await cell(41).click();

		await periodLabel().click();
		await expect.element(page.getByRole('grid', { name: '2026' })).toBeInTheDocument();

		// A month cell stands for the whole month, so the range only has to touch it.
		const monthGrid = document.querySelector('[role="grid"][aria-label="2026"]')!;
		expect(monthGrid.querySelectorAll('.calendar-item-button.selected')).toHaveLength(2);
	});
});

describe('CalendarView view switching', () => {
	it('switches to the month view with Ctrl+ArrowUp', async () => {
		const onViewChange = vi.fn();
		render(CalendarViewTestWrapper, { value: JANUARY_2026, onViewChange });
		await expect.element(cell(jan(1))).toBeInTheDocument();

		focusCell(jan(1));
		await userEvent.keyboard('{Control>}{ArrowUp}{/Control}');

		await expect.element(page.selector('.fs-calendar-view-months')).toBeInTheDocument();
		expect(onViewChange).toHaveBeenCalledWith(expect.anything(), 'months');
	});

	it('switches to the month view from the period button', async () => {
		render(CalendarViewTestWrapper, { value: JANUARY_2026 });

		await periodLabel().click();

		await expect.element(page.selector('.fs-calendar-view-months')).toBeInTheDocument();
		await expect.element(periodLabel()).toHaveTextContent('2026');
	});

	it('goes back to the day view when a month is picked', async () => {
		render(CalendarViewTestWrapper, { value: JANUARY_2026, view: 'months' });
		await expect.element(cell(2)).toBeInTheDocument();

		// Index 2 is March 2026 (the month grid starts on January of the page year).
		await cell(2).click();

		await expect.element(page.selector('.fs-calendar-view-days')).toBeInTheDocument();
		await expect.element(periodLabel()).toHaveTextContent('March 2026');
	});
});

describe('CalendarView month navigation', () => {
	it('moves focus to the next month on ArrowRight', async () => {
		render(CalendarViewTestWrapper, { value: JANUARY_2026, view: 'months' });
		await expect.element(cell(0)).toBeInTheDocument();

		focusCell(0);
		await userEvent.keyboard('{ArrowRight}');

		await expect.element(cell(1)).toHaveFocus();
		await expect.element(cell(1)).toHaveTextContent('Feb');
	});

	it('moves focus a row down on ArrowDown', async () => {
		render(CalendarViewTestWrapper, { value: JANUARY_2026, view: 'months' });
		await expect.element(cell(0)).toBeInTheDocument();

		focusCell(0);
		await userEvent.keyboard('{ArrowDown}');

		await expect.element(cell(4)).toHaveFocus();
		await expect.element(cell(4)).toHaveTextContent('May');
	});

	it('continues into the next row when ArrowRight leaves the last column', async () => {
		render(CalendarViewTestWrapper, { value: JANUARY_2026, view: 'months' });
		await expect.element(cell(3)).toBeInTheDocument();

		focusCell(3);
		await userEvent.keyboard('{ArrowRight}');

		await expect.element(cell(4)).toHaveFocus();
	});

	it('pages back a year when ArrowUp leaves the page', async () => {
		render(CalendarViewTestWrapper, { value: JANUARY_2026, view: 'months' });
		await expect.element(cell(0)).toBeInTheDocument();

		focusCell(0);
		await userEvent.keyboard('{ArrowUp}');

		await expect.element(periodLabel()).toHaveTextContent('2025');
		await expect.element(cell(8)).toHaveFocus();
		await expect.element(cell(8)).toHaveTextContent('Sep');
	});

	it('switches to the year view with Ctrl+ArrowUp', async () => {
		render(CalendarViewTestWrapper, { value: JANUARY_2026, view: 'months' });
		await expect.element(cell(0)).toBeInTheDocument();

		focusCell(0);
		await userEvent.keyboard('{Control>}{ArrowUp}{/Control}');

		await expect.element(periodLabel()).toHaveTextContent('2020');
	});
});

describe('CalendarView year navigation', () => {
	it('renders the decade padded with its neighbours', async () => {
		render(CalendarViewTestWrapper, { value: JANUARY_2026, view: 'years' });
		await expect.element(cell(0)).toHaveTextContent('2018');
		await expect.element(cell(2)).toHaveTextContent('2020');
	});

	it('moves focus to the next year on ArrowRight', async () => {
		render(CalendarViewTestWrapper, { value: JANUARY_2026, view: 'years' });
		await expect.element(cell(2)).toBeInTheDocument();

		focusCell(2);
		await userEvent.keyboard('{ArrowRight}');

		await expect.element(cell(3)).toHaveFocus();
		await expect.element(cell(3)).toHaveTextContent('2021');
	});

	it('moves focus a row down on ArrowDown', async () => {
		render(CalendarViewTestWrapper, { value: JANUARY_2026, view: 'years' });
		await expect.element(cell(2)).toBeInTheDocument();

		focusCell(2);
		await userEvent.keyboard('{ArrowDown}');

		await expect.element(cell(6)).toHaveFocus();
		await expect.element(cell(6)).toHaveTextContent('2024');
	});

	it('pages back a decade when ArrowUp leaves the page', async () => {
		render(CalendarViewTestWrapper, { value: JANUARY_2026, view: 'years' });
		await expect.element(cell(2)).toBeInTheDocument();

		focusCell(2);
		await userEvent.keyboard('{ArrowUp}');

		await expect.element(periodLabel()).toHaveTextContent('2010');
		await expect.element(cell(6)).toHaveFocus();
		await expect.element(cell(6)).toHaveTextContent('2016');
	});

	it('goes back to the month view when a year is picked', async () => {
		render(CalendarViewTestWrapper, { value: JANUARY_2026, view: 'years' });
		await expect.element(cell(4)).toBeInTheDocument();

		await cell(4).click();

		await expect.element(page.selector('.fs-calendar-view-months')).toBeInTheDocument();
		await expect.element(periodLabel()).toHaveTextContent('2022');
	});
});

describe('CalendarView accessibility', () => {
	it('exposes the page as a labelled grid of rows and cells', async () => {
		render(CalendarViewTestWrapper, { value: JANUARY_2026 });

		await expect.element(page.getByRole('grid', { name: 'January 2026' })).toBeInTheDocument();
		expect(document.querySelectorAll('[role="row"]')).toHaveLength(6);
		expect(document.querySelectorAll('[role="gridcell"]')).toHaveLength(42);
	});

	it('names every cell with its full date, weekday first', async () => {
		render(CalendarViewTestWrapper, { value: JANUARY_2026 });

		// Jan 15 2026 is a Thursday. The weekday is why the header row can stay decorative.
		await expect.element(page.getByRole('button', { name: 'Thursday, January 15, 2026' })).toBeInTheDocument();
	});

	it('names cells in the requested locale', async () => {
		render(CalendarViewTestWrapper, { value: JANUARY_2026, locale: 'es-ES' });

		await expect.element(page.getByRole('button', { name: 'jueves, 15 de enero de 2026' })).toBeInTheDocument();
	});

	it('marks the selected cell with aria-selected', async () => {
		render(CalendarViewTestWrapper, { value: JANUARY_2026 });

		await expect.element(cell(jan(15))).toHaveAttribute('aria-label', 'Thursday, January 15, 2026');
		expect(document.querySelectorAll('[role="gridcell"][aria-selected="true"]')).toHaveLength(1);
	});

	it('keeps the weekday row out of the accessibility tree', async () => {
		render(CalendarViewTestWrapper, { value: JANUARY_2026 });
		await expect.element(page.selector('.fs-calendar-view-header')).toHaveAttribute('aria-hidden', 'true');
	});

	it('names the month grid by its year and the year grid by its decade', async () => {
		render(CalendarViewTestWrapper, { value: JANUARY_2026, view: 'months' });
		await expect.element(page.getByRole('grid', { name: '2026' })).toBeInTheDocument();
		await expect.element(page.getByRole('button', { name: 'January 2026' })).toBeInTheDocument();
	});

	it('leaves the weekday names outside the clipped viewport', async () => {
		render(CalendarViewTestWrapper, { value: JANUARY_2026 });
		await expect.element(cell(jan(15))).toBeInTheDocument();

		// The page slides inside .page-viewport; if the header lived in there too, a
		// flying month would cross the weekday names — the bug this markup fixes.
		const header = document.querySelector('.fs-calendar-view-header')!;
		const viewport = document.querySelector('.page-viewport')!;

		expect(viewport.contains(header)).toBe(false);
		expect(viewport.contains(document.querySelector('[data-calendar-page]'))).toBe(true);
		expect(getComputedStyle(viewport).overflow).toBe('hidden');
	});
});
