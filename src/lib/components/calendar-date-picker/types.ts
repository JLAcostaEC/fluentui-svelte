import type { HTMLAttributes, HTMLInputAttributes } from 'svelte/elements';
import type { ComputePositionConfig } from '@floating-ui/dom';
import type { CalendarViewProps } from '../calendar-view/types.js';
import type { ButtonProps } from '../button/types.js';
import type { NativeFieldAttributes } from '$internal';

/** @propsmith CalendarDatePickerProps */
export type CalendarDatePickerProps = {
	/** The DOM reference of the wrapper element.
	 * @bindable
	 */
	wrapperRef?: HTMLDivElement | null;
	/** The selected date.
	 * @default null
	 * @bindable
	 */
	value?: Date | null;
	/** The options used to format the date rendered on the trigger. When rendering on the server, give it a `timeZone`, or the server and the browser may show different days.
	 * @default { year: 'numeric', month: 'numeric', day: 'numeric' }
	 */
	format?: Intl.DateTimeFormatOptions;
	/** The floating UI configuration object of the calendar popup. Keys left out keep their default.
	 */
	calendarPosition?: Partial<ComputePositionConfig>;
	/** Called whenever the selected date changes. */
	onChange?: (event: Event, value: Date | null) => void;
	/** The accessible name of the calendar popup, which is announced as a dialog.
	 * @default 'Choose a date'
	 */
	popupLabel?: string;
	/** The DOM reference of the native date input that holds the value, as `YYYY-MM-DD`. The other attributes of the picker are applied to it.
	 * @bindable
	 */
	ref?: HTMLInputElement | null;
	/** The DOM reference of the button that opens the calendar.
	 * @bindable
	 */
	buttonRef?: HTMLButtonElement | null;
	/** The props to spread on the `Button` that opens the calendar.
	 * @type ButtonProps
	 */
	buttonProps?: Omit<ButtonProps<'button'>, 'as' | 'ref' | 'children'>;
	/** The attributes to spread on the wrapper element.
	 * @type HTMLAttributes
	 */
	wrapperAttributes?: HTMLAttributes<HTMLDivElement>;
	/** The DOM reference of the calendar popup.
	 * @bindable
	 */
	popupRef?: HTMLDivElement | null;
} & Pick<CalendarViewProps, 'locale' | 'blackoutDates' | 'headers' | 'minDate' | 'maxDate' | 'today' | 'weekStart'> &
	NativeFieldAttributes<HTMLInputAttributes>;
