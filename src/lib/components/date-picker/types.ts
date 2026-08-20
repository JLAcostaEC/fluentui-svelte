import type { HTMLAttributes } from "svelte/elements";

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
	/** The first year offered by the year column.
	 * @default Current - 100
	 */
	minYear?: number;
	/** The last year offered by the year column.
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
	/** The DOM reference of the picker element.
	 * @bindable
	 */
	ref?: HTMLDivElement;
	/** The DOM reference of the underlying input element.
	 * @bindable
	 */
	inputElement?: HTMLInputElement;
	/** HTML attributes for the underlying input element. */
	inputProps?: HTMLAttributes<HTMLInputElement>;
}& HTMLAttributes<HTMLDivElement>;
