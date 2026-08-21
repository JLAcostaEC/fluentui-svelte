import type { HTMLAttributes, HTMLButtonAttributes, HTMLInputAttributes } from 'svelte/elements';

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
	/** The DOM reference of the trigger button.
	 * @bindable
	 */
	element?: HTMLButtonElement;
	/** The DOM reference of the element wrapping the trigger and its input.
	 * @bindable
	 */
	wrapperRef?: HTMLDivElement;
	/** The attributes to spread on the wrapper element.
	 * @type HTMLAttributes
	 */
	wrapperAttributes?: HTMLAttributes<HTMLDivElement>;
	/** The DOM reference of the underlying input element.
	 * @bindable
	 */
	inputElement?: HTMLInputElement;
	/** HTML attributes for the underlying input element. Give it a `name` to submit the
	 * value with a form.
	 */
	inputProps?: HTMLInputAttributes;
	/** The accessible name of the popup, which is announced as a dialog.
	 * @default 'Choose a time'
	 */
	popupLabel?: string;
} & HTMLButtonAttributes;
