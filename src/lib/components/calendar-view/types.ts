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

export interface FocusIncrementAmount {
	ArrowUp: number;
	ArrowDown: number;
	ArrowLeft: number;
	ArrowRight: number;
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
		updateView: (e: Event, newView: View) => void;
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
