<script lang="ts">
	import { CalendarView, FluentUISvelte } from '$lib/index.js';
	import type { CalendarDateRange, CalendarSelectionMode, View } from '$lib/components/calendar-view/types.js';

	let {
		value = null,
		range = $bindable({ start: null, end: null }),
		view = 'days',
		selectionMode = 'single',
		blackoutBreaksRange,
		minDate,
		maxDate,
		blackoutDates,
		headers,
		weekStart = 1,
		locale = 'en-US',
		popup,
		onChange,
		onRangeChange,
		onViewChange
	}: {
		value?: Date | Date[] | null;
		range?: CalendarDateRange;
		view?: View;
		selectionMode?: CalendarSelectionMode;
		blackoutBreaksRange?: boolean;
		minDate?: Date;
		maxDate?: Date;
		blackoutDates?: Date[];
		headers?: boolean;
		weekStart?: number;
		locale?: string;
		/** Render the calendar the way a date picker does, as a floating popup. */
		popup?: boolean;
		onChange?: (event: Event, value: Date | Date[] | null) => void;
		onRangeChange?: (event: Event, range: CalendarDateRange) => void;
		onViewChange?: (event: Event, view: View) => void;
	} = $props();
</script>

<FluentUISvelte>
	<CalendarView
		{value}
		bind:range
		{view}
		{selectionMode}
		{blackoutBreaksRange}
		{minDate}
		{maxDate}
		{blackoutDates}
		{headers}
		{weekStart}
		{locale}
		{onChange}
		{onRangeChange}
		{onViewChange}
		floating={popup ? {} : undefined}
	/>
</FluentUISvelte>
