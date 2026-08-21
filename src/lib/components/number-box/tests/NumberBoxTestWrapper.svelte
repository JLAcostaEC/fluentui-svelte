<script lang="ts">
	import { NumberBox } from '$lib/index.js';
	import type { NumberBoxProps } from '$lib/components/number-box/types.js';

	let { value = $bindable(), ...props }: Partial<NumberBoxProps> = $props();
</script>

<NumberBox bind:value {...props} />

<p data-testid="value">{value ?? 'empty'}</p>
