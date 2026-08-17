<script lang="ts">
	import { CalendarView, FluentUISvelte } from '$lib/index.js';
	import type { View } from '$lib/components/calendar-view/types.js';

	let {
		value = null,
		view = 'days',
		multiple,
		minDate,
		maxDate,
		blackoutDates,
		headers,
		weekStart = 1,
		locale = 'en-US',
		popup,
		onChange,
		onViewChange
	}: {
		value?: Date | Date[] | null;
		view?: View;
		multiple?: boolean;
		minDate?: Date;
		maxDate?: Date;
		blackoutDates?: Date[];
		headers?: boolean;
		weekStart?: number;
		locale?: string;
		/** Render the calendar the way a date picker does, as a floating popup. */
		popup?: boolean;
		onChange?: (event: Event, value: Date | Date[] | null) => void;
		onViewChange?: (event: Event, view: View) => void;
	} = $props();
</script>

<FluentUISvelte>
	<CalendarView
		{value}
		{view}
		{multiple}
		{minDate}
		{maxDate}
		{blackoutDates}
		{headers}
		{weekStart}
		{locale}
		{onChange}
		{onViewChange}
		floating={popup ? {} : undefined}
	/>
</FluentUISvelte>
