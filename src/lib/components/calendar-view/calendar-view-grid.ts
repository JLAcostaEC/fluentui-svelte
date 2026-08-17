import { tick } from 'svelte';
import { SvelteDate } from 'svelte/reactivity';
import { compareDates } from './calendar-view.svelte.js';
import type { TabspotNodeOptions } from 'tabspot';
import type { CalendarGrid, CalendarKeyboardOptions, DateComparisonPrecision, View } from './types.js';

/**
 * Tabspot configuration shared by the three calendar grids.
 *
 * Rows are the `<tr>` elements, so a vertical move keeps its column, and
 * `flow: 'linear'` makes a horizontal move continue into the next (or previous)
 * row the way a run of dates does.
 *
 * `items` keeps *every* cell in the matrix — disabled ones included — so a month
 * clipped by `minDate`/`maxDate` still has square rows. Focusing a disabled
 * button is a no-op, which is exactly the "you cannot go there" behaviour we
 * want. The selector also drops the outgoing page while its transition plays,
 * since Svelte marks a transitioning-out element `inert`.
 *
 * Roving is off because each view authors its own tab stop: with roving on, the
 * first cell of the grid becomes the only tab stop, and that cell can be
 * disabled (a `minDate` late in the month) — which would leave the calendar
 * unreachable by <kbd>Tab</kbd>.
 */
export const CALENDAR_GRID_CONFIG: TabspotNodeOptions = {
	root: { manageSpecialKeys: { Home: true, End: true } },
	mover: {
		layout: 'grid',
		flow: 'linear',
		rows: { by: 'selector', row: 'tr' },
		items: 'tbody:not([inert]) button',
		activation: { mode: 'focus', roving: false }
	}
};

/** Six weeks of seven days; a day belongs to the page when it shares its month. */
export const DAY_GRID: CalendarGrid = {
	columns: 7,
	size: 42,
	precision: 'month',
	shift: (date, amount) => new SvelteDate(new SvelteDate(date).setDate(date.getDate() + amount))
};

/** The twelve months of the page year plus the first four of the next one. */
export const MONTH_GRID: CalendarGrid = {
	columns: 4,
	size: 16,
	precision: 'year',
	shift: (date, amount) => new SvelteDate(new SvelteDate(date).setMonth(date.getMonth() + amount, 1))
};

/** The page decade padded with its neighbours. */
export const YEAR_GRID: CalendarGrid = {
	columns: 4,
	size: 16,
	precision: 'decade',
	shift: (date, amount) => new SvelteDate(new SvelteDate(date).setFullYear(date.getFullYear() + amount))
};

/** How far one press of `key` travels, in cells. `undefined` for keys we ignore. */
function shiftAmount(key: string, columns: number): number | undefined {
	switch (key) {
		case 'ArrowLeft':
		case 'Home':
			return -1;
		case 'ArrowRight':
		case 'End':
			return 1;
		case 'ArrowUp':
			return -columns;
		case 'ArrowDown':
			return columns;
		default:
			return undefined;
	}
}

/** Whether `key` pressed on cell `index` points outside the rendered page. */
function leavesGrid(key: string, index: number, grid: CalendarGrid): boolean {
	switch (key) {
		case 'ArrowLeft':
			return index === 0;
		case 'ArrowRight':
			return index === grid.size - 1;
		case 'ArrowUp':
			return index < grid.columns;
		case 'ArrowDown':
			return index >= grid.size - grid.columns;
		default:
			// Home/End never leave their row, so Tabspot always resolves them itself.
			return false;
	}
}

function dateOf(element: Element | null): Date | null {
	const value = element?.getAttribute?.('data-date');
	return value ? new SvelteDate(Number(value)) : null;
}

/** Precision at which a date names exactly one cell of a view. */
export const VIEW_PRECISION: Record<View, DateComparisonPrecision> = {
	days: 'day',
	months: 'month',
	years: 'year'
};

/** Cells of the live page that can take focus. */
const FOCUSABLE_CELL = 'tbody:not([inert]) button:not([disabled])';

function cellFor(root: HTMLElement, date: Date, precision: DateComparisonPrecision) {
	for (const cell of root.querySelectorAll<HTMLButtonElement>(FOCUSABLE_CELL)) {
		const value = dateOf(cell);
		if (value && compareDates(value, date, precision)) return cell;
	}
	return null;
}

/**
 * Hands focus to the view rendered inside `root`.
 *
 * `date` — the cell that had focus before a view change — wins when the new view
 * renders it. Otherwise focus falls back to the selection, then to today, then to
 * the first date of the page: the order WAI-ARIA prescribes for a date grid.
 */
export function focusCalendarView(root: HTMLElement, date: Date | null, precision: DateComparisonPrecision) {
	const target =
		(date && cellFor(root, date, precision)) ??
		root.querySelector<HTMLButtonElement>(`${FOCUSABLE_CELL}.selected:not(.out-of-range)`) ??
		root.querySelector<HTMLButtonElement>(`${FOCUSABLE_CELL}.current:not(.out-of-range)`) ??
		root.querySelector<HTMLButtonElement>(`${FOCUSABLE_CELL}:not(.out-of-range)`);

	target?.focus({ preventScroll: true });
}

/**
 * Turns the page when keyboard navigation runs off the rendered grid.
 *
 * Tabspot owns everything that happens *inside* the six-by-seven (or four-by-four)
 * matrix: which cell the arrows resolve to, wrapping from one row into the next,
 * `Home`/`End`, and the fact that a disabled cell cannot take focus. It listens on
 * the document in the capture phase, so by the time this handler runs the move has
 * already happened and only two calendar-specific cases are left:
 *
 * - focus landed on a cell that does not belong to the page (an adjacent month,
 *   year or decade) or on a blacked-out date — page to it, or step past it;
 * - focus did not move because the destination is not rendered at all — page to it.
 */
export function createCalendarKeyboard({ grid, body, page, disabled, blackout, updatePage }: CalendarKeyboardOptions) {
	const onPage = (date: Date) => compareDates(date, page(), grid.precision);

	/** Resolve `target` to a focusable cell, turning the page when it lies outside it. */
	async function focusDate(target: Date, amount: number) {
		// Blacked-out dates are rendered but cannot be selected: keep going.
		for (let step = 0; step < grid.size && blackout(target); step++) {
			target = grid.shift(target, amount);
		}

		if (blackout(target) || disabled(target)) return;

		if (!onPage(target)) {
			updatePage(Math.sign(amount), 'neutral');
			await tick();
		}

		body()?.querySelector<HTMLButtonElement>(`button[data-date="${target.getTime()}"]`)?.focus();
	}

	return async function handleKeyDown(event: KeyboardEvent, date: Date, index: number) {
		const amount = shiftAmount(event.key, grid.columns);
		if (amount === undefined) return;

		const origin = event.currentTarget;
		const landed = document.activeElement;

		if (landed !== origin) {
			const target = dateOf(landed);
			if (target && (blackout(target) || !onPage(target))) await focusDate(target, amount);
			return;
		}

		// Tabspot clamped at the edge of the rendered grid.
		if (leavesGrid(event.key, index, grid)) await focusDate(grid.shift(date, amount), amount);
	};
}
