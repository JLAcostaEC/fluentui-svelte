/** @propsmith TimePickerProps */
export type TimePickerProps = {
	/** Selected time as 24h `HH:mm` or `HH:mm:ss` (matches `<input type="time">`).
	 * @default ''
	 * @bindable
	 */
	value?: string;
	/** Clock format: `24` (00-23) or `12` (01-12 with an AM/PM column).
	 * @default 24
	 */
	format?: 12 | 24;
	/** Controls the open state of the picker.
	 * @default false
	 * @bindable
	 */
	open?: boolean;
	/** Removes the hour column.
	 * @default false
	 */
	hideHours?: boolean;
	/** Removes the minute column.
	 * @default false
	 */
	hideMinutes?: boolean;
	/** Removes the second column.
	 * @default false
	 */
	hideSeconds?: boolean;
	/** The DOM reference of the picker element.
	 * @bindable
	 */
	element?: HTMLElement;
	/** The DOM reference of the underlying input element.
	 * @bindable
	 */
	inputElement?: HTMLInputElement;
};
