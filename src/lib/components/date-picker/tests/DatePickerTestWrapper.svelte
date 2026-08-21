<script lang="ts">
	import { DatePicker } from '$lib/index.js';
	import type { DatePickerProps } from '$lib/components/date-picker/types.js';

	let { value = $bindable(''), open = $bindable(false), ...props }: Partial<DatePickerProps> = $props();
</script>

<DatePicker bind:value bind:open {...props} />

<p data-testid="value">{value || 'empty'}</p>
