import type { HTMLAttributes, HTMLButtonAttributes, HTMLInputAttributes } from 'svelte/elements';
import type { NativeFieldAttributes } from '$internal';

/** @propsmith DatePickerProps */
export type DatePickerProps = {
	/** Selected date as `YYYY-MM-DD` (matches the underlying `<input type="date">`).
	 * @default ''
	 * @bindable
	 */
	value?: string;
	/** The order the three columns are laid out in.
	 * @default 'dd/MM/yyyy'
	 */
	format?: 'MM/dd/yyyy' | 'dd/MM/yyyy';
	/** Controls the open state of the picker.
	 * @default false
	 * @bindable
	 */
	open?: boolean;
	/** Removes the year column.
	 * @default false
	 */
	hideYears?: boolean;
	/** Removes the month column.
	 * @default false
	 */
	hideMonths?: boolean;
	/** Removes the day column.
	 * @default false
	 */
	hideDays?: boolean;
	/** The first year offered by the year column. Unless `min` is given, the native input accepts no earlier date.
	 * @default Current - 100
	 */
	minYear?: number;
	/** The last year offered by the year column. Unless `max` is given, the native input accepts no later date.
	 * @default Current + 100
	 */
	maxYear?: number;
	/** Specific days (year-month-day) that cannot be selected.
	 * @default []
	 */
	disabledDates?: Date[];
	/** Specific months (by month + year) that cannot be selected.
	 * @default []
	 */
	disabledMonths?: Date[];
	/** Specific years (by year) that cannot be selected.
	 * @default []
	 */
	disabledYears?: Date[];
	/** The DOM reference of the native date input that holds the value. The other attributes of the picker are applied to it.
	 * @bindable
	 */
	ref?: HTMLInputElement | null;
	/** The DOM reference of the button that opens the picker.
	 * @bindable
	 */
	buttonRef?: HTMLButtonElement | null;
	/** The attributes to spread on the button that opens the picker.
	 * @type HTMLButtonAttributes
	 */
	buttonAttributes?: HTMLButtonAttributes;
	/** The DOM reference of the element wrapping the button and the native input.
	 * @bindable
	 */
	wrapperRef?: HTMLDivElement | null;
	/** The attributes to spread on the wrapper element.
	 * @type HTMLAttributes
	 */
	wrapperAttributes?: HTMLAttributes<HTMLDivElement>;
	/** The accessible name of the popup, which is announced as a dialog.
	 * @default 'Choose a date'
	 */
	popupLabel?: string;
} & NativeFieldAttributes<HTMLInputAttributes>;
