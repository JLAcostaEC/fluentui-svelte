<script lang="ts">
	import { TextArea } from '$lib/index.js';
	import type { TextAreaProps } from '$lib/components/textarea/types.js';

	let { value = $bindable(''), ...props }: Partial<TextAreaProps> = $props();
</script>

<TextArea bind:value {...props} />

<p data-testid="value">{value}</p>
