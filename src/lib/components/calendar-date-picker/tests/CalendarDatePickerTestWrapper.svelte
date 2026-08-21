<script lang="ts">
	import { CalendarDatePicker, FluentUISvelte } from '$lib/index.js';
	import type { CalendarDatePickerProps } from '$lib/components/calendar-date-picker/types.js';

	let { value = $bindable(null), ...props }: Partial<CalendarDatePickerProps> = $props();
</script>

<FluentUISvelte>
	<CalendarDatePicker bind:value {...props} />
</FluentUISvelte>

<p data-testid="value">{value ? value.toISOString().slice(0, 10) : 'empty'}</p>
