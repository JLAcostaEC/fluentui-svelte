import type { HTMLAttributes } from 'svelte/elements';
import type { ComputePositionConfig } from '@floating-ui/dom';
import type { CalendarViewProps } from '../calendar-view/types.js';

/** @propsmith CalendarDatePickerProps */
export type CalendarDatePickerProps = {
	/** The DOM reference of the picker element.
	 * @bindable
	 */
	ref?: HTMLDivElement;
	/** The selected date.
	 * @default null
	 * @bindable
	 */
	value?: Date | null;
	/** The options used to format the date rendered on the trigger.
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
	/** The DOM reference of the trigger button.
	 * @bindable
	 */
	triggerRef?: HTMLButtonElement;
	/** The DOM reference of the calendar popup.
	 * @bindable
	 */
	popupRef?: HTMLDivElement;
} & Pick<CalendarViewProps, 'locale' | 'blackoutDates' | 'headers' | 'minDate' | 'maxDate' | 'weekStart'> &
	HTMLAttributes<HTMLDivElement>;
