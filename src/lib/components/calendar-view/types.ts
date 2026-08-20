import type { HTMLButtonAttributes, HTMLTdAttributes } from 'svelte/elements';
import type { FSContext } from '$internal';
import type { Snippet } from 'svelte';
import type { ComputePositionConfig, VirtualElement } from '@floating-ui/dom';

export type View = 'days' | 'months' | 'years';
export type AnimationDirection = 'up' | 'down' | 'neutral';
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
	/** The `<tbody>` rendering the live page. */
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
	multiple?: boolean;
	locale?: string;
	value?: Date | Date[] | null;
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
		multiple?: boolean;
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
	}
>;

export type CalendarViewState = {
	value: Date | Date[];
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
	header?: string;
	variant?: string;
	children?: Snippet;
	buttonAttributes?: HTMLButtonAttributes;
} & HTMLTdAttributes;
