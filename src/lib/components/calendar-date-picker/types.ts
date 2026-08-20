import type { ComputePositionConfig } from '@floating-ui/dom';
import type { CalendarViewProps } from '../calendar-view/types.js';

export type CalendarDatePickerProps = {
	value?: Date | null;
	format?: Intl.DateTimeFormatOptions;
	calendarPosition?: Partial<ComputePositionConfig>;
	onChange?: (event: Event, value: Date | null) => void;
} & Omit<
	CalendarViewProps,
	| 'floating'
	| 'selectionMode'
	| 'range'
	| 'blackoutBreaksRange'
	| 'onRangeChange'
	| 'view'
	| 'onViewChange'
	| 'onChange'
	| 'value'
>;
