import { createFSContext } from '$internal';
import type {
	View,
	MonthLocaleOptions,
	CalendarDateRange,
	CalendarViewContext,
	WeekdayLocaleOptions,
	DateComparisonPrecision,
	RangePosition
} from './types.js';
import { SvelteDate } from 'svelte/reactivity';

export const [getCalendarViewContext, setCalendarViewContext] = createFSContext<CalendarViewContext>();

/** Milliseconds in a day. Only ever used with `Math.round`, so DST cannot skew it. */
const DAY_MS = 86_400_000;

/**
 * Midnight of `date`.
 *
 * Every date the grid renders is already at midnight, but a consumer can hand us a
 * `range` or a `value` carrying a time, and a range must not change meaning because
 * one of its ends happens to be half past two.
 */
export function startOfDay(date: Date) {
	return new SvelteDate(date.getFullYear(), date.getMonth(), date.getDate());
}

/** Whether a blacked-out date sits strictly inside the interval. Its ends do not count. */
export function hasBlackoutBetween(from: Date, to: Date, blackoutDates?: Date[]) {
	if (!blackoutDates?.length) return false;

	const min = startOfDay(from).getTime();
	const max = startOfDay(to).getTime();

	return blackoutDates.some((date) => {
		const time = startOfDay(date).getTime();
		return time > min && time < max;
	});
}

/**
 * Where `day` sits in a finished range, or `undefined` when it sits outside one.
 *
 * A range of a single day returns `undefined` too: there is no band to paint
 * across one cell, and the day already reads as selected.
 */
export function rangePositionOf(day: Date, range: CalendarDateRange): RangePosition | undefined {
	if (!range.start || !range.end) return undefined;

	const time = startOfDay(day).getTime();
	const start = startOfDay(range.start).getTime();
	const end = startOfDay(range.end).getTime();

	if (start === end) return undefined;
	if (time === start) return 'start';
	if (time === end) return 'end';

	return time > start && time < end ? 'between' : undefined;
}

/** The first and last day of the cell `date` stands for. */
function cellSpan(date: Date, precision: DateComparisonPrecision): [Date, Date] {
	switch (precision) {
		case 'month':
			return [
				new SvelteDate(date.getFullYear(), date.getMonth(), 1),
				new SvelteDate(date.getFullYear(), date.getMonth() + 1, 0)
			];
		case 'year':
			return [new SvelteDate(date.getFullYear(), 0, 1), new SvelteDate(date.getFullYear(), 11, 31)];
		default:
			return [startOfDay(date), startOfDay(date)];
	}
}

/**
 * Whether the range touches the cell `date` stands for.
 *
 * A month or a year is one cell standing for many days, so it counts as covered the
 * moment the range overlaps it at all — not only when an end of the range lands on it.
 */
export function rangeCovers(date: Date, range: CalendarDateRange, precision: DateComparisonPrecision) {
	if (!range.start) return false;

	const [from, to] = cellSpan(date, precision);
	const start = startOfDay(range.start).getTime();
	// Half-built, the range is just its start.
	const end = startOfDay(range.end ?? range.start).getTime();

	return start <= to.getTime() && end >= from.getTime();
}

/** How many days a finished range spans, both ends included. */
export function rangeLength(range: CalendarDateRange) {
	if (!range.start || !range.end) return 0;

	return Math.round((startOfDay(range.end).getTime() - startOfDay(range.start).getTime()) / DAY_MS) + 1;
}

export function indexOfDate(array: Date[], date: Date, precision: DateComparisonPrecision = 'time') {
	return array.findIndex((d) => compareDates(d, date, precision));
}

export function getWeekdayLocale(
	day: number,
	{ locale = undefined, format = 'long', offset = 0 }: WeekdayLocaleOptions = {}
) {
	const formatter = new Intl.DateTimeFormat(locale, {
		weekday: format,
		timeZone: 'UTC'
	}).format(new SvelteDate(Date.UTC(2000, 1, day + offset - 1)));

	// In some locales, the first letter may not be capitalized
	return formatter.charAt(0).toUpperCase() + formatter.slice(1);
}

export function getPageByOffset(offset: number, page: Date, view: View) {
	if (view === 'days') {
		return new SvelteDate(page.getFullYear(), page.getMonth() + offset, 1);
	} else if (view === 'months') {
		return new SvelteDate(page.getFullYear() + offset, 0, 1);
	} else if (view === 'years') {
		return new SvelteDate(Math.floor(page.getFullYear() / 10) * 10 + offset * 10, 0, 1);
	}

	// Fallback to current page if view is not recognized
	return page;
}

export function getMonthLength(year: number, month: number) {
	return new SvelteDate(year, month + 1, 0).getDate() - 1;
}

export function getMonthDays(year: number, month: number): Date[] {
	const days: Date[] = [];
	for (let i = 0; i < getMonthLength(year, month) + 1; i++) {
		days.push(new SvelteDate(year, month, i + 1));
	}
	return days;
}

export function compareDates(a: Date, b: Date, precision: DateComparisonPrecision = 'time') {
	switch (precision) {
		case 'time':
			return a.getTime() === b.getTime();
		case 'day':
			return a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth() && a.getDate() === b.getDate();
		case 'month':
			return a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth();
		case 'year':
			return a.getFullYear() === b.getFullYear();
		case 'decade':
			return Math.floor(a.getFullYear() / 10) * 10 === Math.floor(b.getFullYear() / 10) * 10;
	}
}

export function getMonthLocale(month: number, { locale = undefined, format = 'long' }: MonthLocaleOptions = {}) {
	const formatter = new Intl.DateTimeFormat(locale, {
		month: format
	}).format(new SvelteDate(2000, month));

	// In some locales, the first letter may not be capitalized
	return formatter.charAt(0).toUpperCase() + formatter.slice(1);
}

export function getCalendarDays(date: Date, weekStart = 0): Date[] {
	const year = date.getFullYear();
	const month = date.getMonth();
	const firstWeekday = new SvelteDate(year, month, 1).getDay();
	const calendarRows = 6;

	let days: Date[] = [];
	let nextMonth = month + 1;
	let lastMonth = month - 1;
	let nextMonthYear = year;
	let lastMonthYear = year;

	const daysBefore = (firstWeekday - weekStart + 7) % 7;
	if (daysBefore > 0) {
		if (lastMonth === -1) {
			lastMonth = 11;
			lastMonthYear = year - 1;
		}
		days = getMonthDays(lastMonthYear, lastMonth).slice(-daysBefore);
	}

	days = days.concat(getMonthDays(year, month));

	if (nextMonth === 12) {
		nextMonth = 0;
		nextMonthYear = year + 1;
	}

	const daysAfter = 7 * calendarRows - days.length;
	days = days.concat(getMonthDays(nextMonthYear, nextMonth).slice(0, daysAfter));

	return days;
}

export function getYearMonths(year: number): Date[] {
	const months: Date[] = [];
	for (let i = 0; i < 12; i++) {
		months.push(new SvelteDate(year, i, 1));
	}
	return months;
}

export function getCalendarMonths(date: Date): Date[] {
	const year = date.getFullYear();

	const months: Date[] = [];

	return months.concat(getYearMonths(year), getYearMonths(year + 1).slice(0, 4));
}

export function getCalendarYears(date: Date): Date[] {
	const decadeStart = Math.floor(date.getFullYear() / 10) * 10;

	const years: Date[] = [];

	for (let i = 0; i < 12; i++) {
		years.push(new SvelteDate(decadeStart + i, 0, 1));
	}

	if (decadeStart % 20 === 0) {
		for (let i = 0; i < 2; i++) {
			years.unshift(new SvelteDate(decadeStart - (i + 1), 0, 1));
		}
		for (let i = 0; i < 4; i++) {
			years.push(new SvelteDate(decadeStart + i + 12, 0, 1));
		}
	} else {
		for (let i = 0; i < 6; i++) {
			years.push(new SvelteDate(decadeStart + i + 12, 0, 1));
		}
	}

	return years;
}
