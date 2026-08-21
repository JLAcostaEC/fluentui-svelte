import type { HTMLAttributes, HTMLButtonAttributes } from 'svelte/elements';
import type { FSContext } from '$internal';
import type { Snippet } from 'svelte';
import type { ComputePositionConfig, VirtualElement } from '@floating-ui/dom';

export type View = 'days' | 'months' | 'years';
export type AnimationDirection = 'up' | 'down' | 'neutral';
export type CalendarSelectionMode = 'single' | 'multiple' | 'range';
export type DateTimeWeekdayFormat = 'long' | 'short' | 'narrow';
export type DateTimeMonthFormat = 'long' | 'short' | 'narrow' | 'numeric' | '2-digit';
export type DateComparisonPrecision = 'time' | 'day' | 'month' | 'year' | 'decade';

export interface WeekdayLocaleOptions {
	locale?: string;
	format?: DateTimeWeekdayFormat;
	offset?: number;
}

export interface MonthLocaleOptions {
	locale?: string;
	format?: DateTimeMonthFormat;
}

/**
 * A range of days.
 *
 * `end` stays `null` while the range is half-built
 */
export interface CalendarDateRange {
	start: Date | null;
	end: Date | null;
}

/** Where a day sits in the painted range: its two ends, or somewhere in between. */
export type RangePosition = 'start' | 'between' | 'end';

/** Anchors the calendar to a reference element and positions it with floating-ui. */
export interface CalendarViewFloating {
	/** The ref element to which the calendar is anchored */
	ref?: HTMLElement | VirtualElement | null;
	/** The floating UI configuration object of the calendar */
	positionConfig?: Partial<ComputePositionConfig>;
}

/** Shape of one rendered calendar page, as seen by keyboard navigation. */
export interface CalendarGrid {
	/** Cells per row. */
	columns: number;
	/** Cells rendered per page. */
	size: number;
	/** Precision at which a date still belongs to the rendered page. */
	precision: DateComparisonPrecision;
	/** `date` moved by `amount` cells along the row axis. */
	shift: (date: Date, amount: number) => Date;
}

export interface CalendarNavigationOptions {
	grid: CalendarGrid;
	/** The element rendering the live page. */
	body: () => HTMLElement | null;
	/** The page currently rendered. */
	page: () => Date;
	/** Whether a date is out of the `minDate`/`maxDate` range. */
	disabled: (date: Date) => boolean;
	/** Whether a date is rendered but not selectable. */
	blackout: (date: Date) => boolean;
	updatePage: (amount: number, direction: AnimationDirection) => void;
}

/** @propsmith CalendarViewProps */
export type CalendarViewProps = {
	/** The DOM reference of the calendar element.
	 * @bindable
	 */
	ref?: HTMLDivElement;
	/** The selected date, or an array of dates when `selectionMode` is `'multiple'`. Unused by `'range'`.
	 * @default null
	 * @bindable
	 */
	value?: Date | Date[] | null;
	/** How many dates the grid hands out, and in what shape.
	 * @default 'single'
	 */
	selectionMode?: CalendarSelectionMode;
	/** The picked range. Only read and written when `selectionMode` is `'range'`, and `end` stays `null` until the range is closed.
	 * @default { start: null, end: null }
	 * @bindable
	 */
	range?: CalendarDateRange;
	/** Stop a range from spanning a blacked-out date.
	 * @default false
	 */
	blackoutBreaksRange?: boolean;
	/** Dates that are rendered but cannot be selected. */
	blackoutDates?: Date[];
	/** Labels the first cell of a month or a year with its name. */
	headers?: boolean;
	/** The earliest selectable date. */
	minDate?: Date;
	/** The latest selectable date. */
	maxDate?: Date;
	/** The calendar page the view opens on.
	 * @default 'days'
	 */
	view?: View;
	/** The locale used to format weekday and month names.
	 * @default 'en-US'
	 */
	locale?: string;
	/** The first day of the week, where 0 is Sunday.
	 * @default 1
	 */
	weekStart?: number;
	/** Renders the calendar as a popup anchored to a reference element instead of inline.
	 * @type CalendarViewFloating
	 */
	floating?: CalendarViewFloating;
	/** Called whenever the selection changes. Not called in `'range'` mode. */
	onChange?: (event: Event, value: Date | Date[] | null) => void;
	/** Fired on every step of a range, including the one that leaves `end` null. */
	onRangeChange?: (event: Event, range: CalendarDateRange) => void;
	/** Called whenever the active calendar page changes. */
	onViewChange?: (event: Event, view: View) => void;
} & HTMLAttributes<HTMLDivElement>;

export type CalendarViewContext = FSContext<
	{
		locale: string;
		weekStart: number;
		minDate?: Date;
		maxDate?: Date;
		headers?: boolean;
		blackoutDates?: Date[];
		selectionMode: CalendarSelectionMode;
		blackoutBreaksRange?: boolean;
	},
	CalendarViewState,
	{
		onChange: (e: Event, value: Date) => void;
		onViewChange: (e: Event, newView: View) => void;
	},
	{
		/** `focusDate` carries focus into the new view; omit it to leave focus where it is. */
		updateView: (e: Event, newView: View, focusDate?: Date) => void;
		updatePage: (amount?: number, directionOverride?: AnimationDirection) => void;
		selectDay: (e: Event, day: Date) => void;
		selectMonth: (e: Event, month: Date) => void;
		selectYear: (e: Event, year: Date) => void;
		/** Empties whatever the current `selectionMode` holds. */
		clearSelection: (e: Event) => void;
	}
>;

export type CalendarViewState = {
	value: Date | Date[];
	range: CalendarDateRange;
	view: View;
	page: Date;
	viewAnimationDirection: AnimationDirection;
	pageAnimationDirection: AnimationDirection;
};

/** @propsmith CalendarViewItemProps */
export type CalendarViewItemProps = {
	/** Renders the cell as the selected one. */
	selected?: boolean;
	/** Disables the user interaction. */
	disabled?: boolean;
	/** Marks the cell as the current date. */
	current?: boolean;
	/** Renders the cell as belonging to a neighbouring page. */
	outOfRange?: boolean;
	/** Renders the cell as blacked out, so it reads as unavailable rather than disabled. */
	blackout?: boolean;
	/** Set on the days a range covers, which paints the band behind them. */
	rangePosition?: RangePosition;
	/** A small label rendered above the cell content. */
	header?: string;
	/** Which shape the cell takes: a circle for a day, a rounded rectangle for a month or a year.
	 * @default 'day'
	 */
	variant?: 'day' | 'monthYear';
	/** The content of the cell.
	 * @type Snippet
	 */
	children?: Snippet;
	/** The attributes to spread on the inner button element.
	 * @type HTMLButtonAttributes
	 */
	buttonAttributes?: HTMLButtonAttributes;
} & HTMLAttributes<HTMLDivElement>;
