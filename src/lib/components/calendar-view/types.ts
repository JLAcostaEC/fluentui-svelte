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

export type CalendarViewProps = {
	element?: HTMLElement;
	/** How many dates the grid hands out, and in what shape. Default: `'single'`. */
	selectionMode?: CalendarSelectionMode;
	locale?: string;
	value?: Date | Date[] | null;
	/** The picked range. Only read and written when `selectionMode` is `'range'`. */
	range?: CalendarDateRange;
	/**
	 * Stop a range from spanning a blacked-out date. Off by default
	 */
	blackoutBreaksRange?: boolean;
	blackoutDates?: Date[];
	headers?: boolean;
	minDate?: Date;
	maxDate?: Date;
	view?: View;
	weekStart?: number;
	floating?: {
		/** The ref element to which the menu is anchored */
		ref?: HTMLElement | VirtualElement | null;
		/** The floating UI configuration object of the menu */
		positionConfig?: Partial<ComputePositionConfig>;
	};
	onChange?: (event: Event, value: Date | Date[] | null) => void;
	/** Fired on every step of a range, including the one that leaves `end` null. */
	onRangeChange?: (event: Event, range: CalendarDateRange) => void;
	onViewChange?: (event: Event, view: View) => void;
};

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

export type CalendarViewItemProps = {
	selected?: boolean;
	disabled?: boolean;
	current?: boolean;
	outOfRange?: boolean;
	blackout?: boolean;
	/** Set on the days a range covers, which paints the band behind them. */
	rangePosition?: RangePosition;
	header?: string;
	variant?: string;
	children?: Snippet;
	buttonAttributes?: HTMLButtonAttributes;
} & HTMLAttributes<HTMLDivElement>;
