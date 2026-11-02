import type { HTMLAttributes, HTMLButtonAttributes, HTMLInputAttributes } from 'svelte/elements';
import type { NativeFieldAttributes } from '$internal';

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
	/** The DOM reference of the native time input that holds the value. The other attributes of the picker are applied to it.
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
	 * @default 'Choose a time'
	 */
	popupLabel?: string;
} & NativeFieldAttributes<HTMLInputAttributes>;
