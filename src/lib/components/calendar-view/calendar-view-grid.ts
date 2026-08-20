import { tick } from 'svelte';
import { SvelteDate } from 'svelte/reactivity';
import { compareDates } from './calendar-view.svelte.js';
import type { TabspotEventListener, TabspotNavigationEvent, TabspotNodeOptions } from 'tabspot';
import type { CalendarGrid, CalendarNavigationOptions, DateComparisonPrecision, View } from './types.js';

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
		rows: { by: 'selector', row: '[role="row"]' },
		items: '[data-calendar-page]:not([inert]) button',
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

/** How far one move travels, in cells. `undefined` for directions the calendar ignores. */
function amountFor(direction: TabspotNavigationEvent['direction'], columns: number): number | undefined {
	switch (direction) {
		case 'left':
		case 'home':
			return -1;
		case 'right':
		case 'end':
			return 1;
		case 'up':
			return -columns;
		case 'down':
			return columns;
		default:
			return undefined;
	}
}

/** The date a rendered cell stands for. */
export function cellDate(element: Element | null): Date | null {
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
const FOCUSABLE_CELL = '[data-calendar-page]:not([inert]) button:not([disabled])';

function cellFor(root: HTMLElement, date: Date, precision: DateComparisonPrecision) {
	for (const cell of root.querySelectorAll<HTMLButtonElement>(FOCUSABLE_CELL)) {
		const value = cellDate(cell);
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
 * Turns the page when navigation runs off the rendered grid.
 *
 * Tabspot owns everything that happens *inside* the six-by-seven (or four-by-four)
 * matrix: which cell an arrow resolves to, wrapping from one row into the next,
 * `Home`/`End`, and the fact that a disabled cell cannot take focus. It reports
 * the two things it cannot decide on its own, and this listener answers them:
 *
 * - `atEdge` — the move ran out of cells. Only the calendar knows there is a date
 *   beyond that edge, so it turns the page and lands on it.
 * - the move resolved to a cell that does not belong to the page (an adjacent
 *   month, year or decade) or to a blacked-out date — page to it, or step past it.
 *
 * Both cases claim the key: the grid ran out of cells but the calendar did not,
 * so the browser must not scroll the page underneath it.
 */
export function createCalendarNavigation({
	grid,
	body,
	page,
	disabled,
	blackout,
	updatePage
}: CalendarNavigationOptions): TabspotEventListener {
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

	return (event) => {
		const amount = amountFor(event.direction, grid.columns);
		if (amount === undefined) return;

		if (event.atEdge) {
			const origin = cellDate(event.from);
			if (!origin) return;

			event.preventDefault();
			focusDate(grid.shift(origin, amount), amount);
			return;
		}

		const landed = cellDate(event.to);
		if (!landed || (!blackout(landed) && onPage(landed))) return;

		event.preventDefault();
		focusDate(landed, amount);
	};
}
