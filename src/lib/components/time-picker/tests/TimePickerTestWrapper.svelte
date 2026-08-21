<script lang="ts">
	import { TimePicker } from '$lib/index.js';
	import type { TimePickerProps } from '$lib/components/time-picker/types.js';

	let { value = $bindable(''), open = $bindable(false), ...props }: Partial<TimePickerProps> = $props();
</script>

<TimePicker bind:value bind:open {...props} />

<p data-testid="value">{value || 'empty'}</p>
