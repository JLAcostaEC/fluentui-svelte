import { createFSContext } from '$internal';
import type {
	View,
	MonthLocaleOptions,
	CalendarViewContext,
	WeekdayLocaleOptions,
	DateComparisonPrecision
} from './types.js';
import { SvelteDate } from 'svelte/reactivity';

export const [getCalendarViewContext, setCalendarViewContext] = createFSContext<CalendarViewContext>();

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
